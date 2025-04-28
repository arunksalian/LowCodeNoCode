const Workspace = require('../models/Workspace');
const Template = require('../models/Template');

// Get all workspaces for a user
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ userId: req.user._id })
      .populate('templates');
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single workspace
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('templates');
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const workspace = new Workspace({
      ...req.body,
      userId: req.user._id
    });
    
    const savedWorkspace = await workspace.save();
    res.status(201).json(savedWorkspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    ).populate('templates');
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    // Delete all templates associated with this workspace
    await Template.deleteMany({ _id: { $in: workspace.templates } });
    
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a template to a workspace
exports.addTemplate = async (req, res) => {
  try {
    const { templateId } = req.body;
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    // Check if template exists and belongs to user
    const template = await Template.findOne({
      _id: templateId,
      userId: req.user._id
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Add template to workspace if not already present
    if (!workspace.templates.includes(templateId)) {
      workspace.templates.push(templateId);
      await workspace.save();
    }
    
    const updatedWorkspace = await Workspace.findById(workspace._id).populate('templates');
    res.json(updatedWorkspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a template from a workspace
exports.removeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    workspace.templates = workspace.templates.filter(
      template => template.toString() !== templateId
    );
    
    await workspace.save();
    
    const updatedWorkspace = await Workspace.findById(workspace._id).populate('templates');
    res.json(updatedWorkspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 