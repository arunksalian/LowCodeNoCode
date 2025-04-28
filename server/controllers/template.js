const Template = require('../models/Template');

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { name, description, components } = req.body;
    const template = new Template({
      name,
      description,
      components,
      userId: req.user.id,
    });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Error creating template' });
  }
};

// Get all templates for the current user
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ userId: req.user.id });
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
};

// Get a single template by ID
exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Error fetching template' });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const { name, description, components } = req.body;
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, components },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Error updating template' });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Error deleting template' });
  }
};
