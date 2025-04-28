const Deployment = require('../models/Deployment');
const Template = require('../models/Template');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { deploy_web_app, read_deployment_config } = require('../utils/deployment');

// Convert component to JSX
const componentToJsx = (comp) => {
  const { type, properties, position, styles = {} } = comp;
  const baseStyle = {
    position: 'absolute',
    left: position.x + 'px',
    top: position.y + 'px',
    ...styles
  };

  switch(type) {
    case 'button':
      return `<button style={${JSON.stringify(baseStyle)}} onClick={() => ${properties.action || 'alert("Clicked!")'}}>${properties.text || 'Button'}</button>`;
    case 'textbox':
      return `<input type="text" style={${JSON.stringify(baseStyle)}} placeholder="${properties.placeholder || ''}" onChange={(e) => ${properties.onChange || 'console.log(e.target.value)'}} />`;
    case 'label':
      return `<div style={${JSON.stringify(baseStyle)}}>${properties.text || 'Label'}</div>`;
    case 'container':
      return `<div style={${JSON.stringify({ ...baseStyle, width: '200px', height: '200px', border: '1px solid #ccc' })}>${properties.children ? properties.children.map(child => componentToJsx(child)).join('\n') : ''}</div>`;
    default:
      return '';
  }
};

// Create deployment directory
const createDeploymentFiles = async (template, deploymentId) => {
  const deploymentDir = path.join(__dirname, '..', 'deployments', deploymentId.toString());
  const pagesDir = path.join(deploymentDir, 'pages');
  
  // Create directories
  await fs.mkdir(deploymentDir, { recursive: true });
  await fs.mkdir(pagesDir, { recursive: true });

  // Create package.json
  const packageJson = {
    name: `template-${deploymentId}`,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      export: 'next export'
    },
    dependencies: {
      next: '^12.0.0',
      react: '^17.0.2',
      'react-dom': '^17.0.2',
      '@mui/material': '^5.0.0',
      '@emotion/react': '^11.0.0',
      '@emotion/styled': '^11.0.0'
    }
  };

  await fs.writeFile(
    path.join(deploymentDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create pages/index.js
  const componentsJsx = template.components.map(comp => {
    const { type, properties, position } = comp;
    const style = `position: absolute; left: ${position.x}px; top: ${position.y}px`;
    
    switch(type) {
      case 'button':
        return `<button style={\`${style}\`} onClick={() => alert('${properties.action || 'Clicked!'}')}>${properties.text || 'Button'}</button>`;
      case 'textbox':
        return `<input type="text" style={\`${style}\`} placeholder="${properties.placeholder || ''}" />`;
      case 'label':
        return `<div style={\`${style}\`}>${properties.text || 'Label'}</div>`;
      default:
        return '';
    }
  }).join('\n      ');

  const indexJs = `
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme(${JSON.stringify(template.theme || {})})

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>${template.name}</title>
        <meta name="description" content="${template.description}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style='position: relative; min-height: 100vh; padding: 20px'>
        ${template.components.map(comp => componentToJsx(comp)).join('\n        ')}
      </main>
    </ThemeProvider>
  )
}`;

  await fs.writeFile(path.join(pagesDir, 'index.js'), indexJs);
  
  return deploymentDir;
};

// Deploy template
const createDeployablePackage = async (deploymentDir) => {
  // Create a zip file of the deployment
  const archiver = require('archiver');
  const outputPath = path.join(deploymentDir, 'deployment.zip');
  const output = require('fs').createWriteStream(outputPath);
  const archive = archiver('zip');

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(outputPath));
    archive.on('error', err => reject(err));
    
    archive.pipe(output);
    archive.directory(deploymentDir, false);
    archive.finalize();
  });
};

exports.deployTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create deployment record
    const deployment = new Deployment({
      templateId,
      userId: req.user.id,
      status: 'pending'
    });
    await deployment.save();

    // Create deployment files
    const deploymentDir = await createDeploymentFiles(template, deployment._id);

    // Create a deployable package
    const packagePath = await createDeployablePackage(deploymentDir);

    // Update deployment status
    deployment.status = 'completed';
    deployment.url = packagePath;
    await deployment.save();

    // Send the package path in response
    res.json({
      message: 'Template converted to deployable package successfully',
      deploymentId: deployment._id,
      packagePath: packagePath
    });
    const netlifyConfig = `
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
`;

    await fs.writeFile(
      path.join(deploymentDir, 'netlify.toml'),
      netlifyConfig
    );

    // Initialize Git repository
    await new Promise((resolve, reject) => {
      exec('git init && git add . && git commit -m "Initial commit"', {
        cwd: deploymentDir
      }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // First read deployment config
    await read_deployment_config({
      projectPath: deploymentDir
    });

    // Deploy to Netlify
    const deploymentId = await deploy_web_app({
      framework: 'nextjs',
      projectPath: deploymentDir,
      subdomain: `template-${deployment._id}`
    });

    // Update deployment status
    deployment.status = 'deployed';
    deployment.url = `https://template-${deployment._id}.netlify.app`;
    await deployment.save();

    res.json(deployment);
  } catch (err) {
    console.error('Error deploying template:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get deployments
exports.getDeployments = async (req, res) => {
  try {
    const deployments = await Deployment.find({ userId: req.user.id })
      .populate('templateId')
      .sort('-createdAt');
    res.json(deployments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get deployment
exports.getDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id)
      .populate('templateId');
    if (!deployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }
    res.json(deployment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
