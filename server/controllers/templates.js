const Template = require('../models/Template');

// Get all templates (public and user's private templates)
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('Error getting templates:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single template
exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (err) {
    console.error('Error getting template:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    console.log('Creating template with data:', JSON.stringify(req.body, null, 2));
    
    const template = new Template({
      name: req.body.name,
      description: req.body.description,
      isPublic: req.body.isPublic,
      components: req.body.components,
      userId: req.user.id // Get user ID from auth middleware
    });

    const newTemplate = await template.save();
    console.log('Template created successfully:', JSON.stringify(newTemplate, null, 2));
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error('Error creating template:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (req.body.name) template.name = req.body.name;
    if (req.body.description) template.description = req.body.description;
    if (req.body.isPublic !== undefined) template.isPublic = req.body.isPublic;
    if (req.body.components) {
      template.components = req.body.components.map(comp => ({
        id: comp.id,
        type: comp.type,
        properties: comp.properties,
        position: comp.position
      }));
    }

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (err) {
    console.error('Error updating template:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.deleteOne();
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get user's templates
exports.getUserTemplates = async (req, res) => {
  try {
    const templates = await Template.find()
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('Error getting user templates:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get public templates
exports.getPublicTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isPublic: true })
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('Error getting public templates:', err);
    res.status(500).json({ message: err.message });
  }
}; 