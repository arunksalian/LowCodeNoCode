const TemplateData = require('../models/TemplateData');
const Template = require('../models/Template');

// Create new template data entry
exports.createTemplateData = async (req, res) => {
  try {
    const { templateId, name, data } = req.body;
    
    // Verify template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create new template data
    const templateData = new TemplateData({
      templateId,
      name,
      data,
      createdBy: req.user._id
    });

    await templateData.save();
    res.status(201).json(templateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get template data by ID
exports.getTemplateData = async (req, res) => {
  try {
    const templateData = await TemplateData.findById(req.params.id)
      .populate('templateId', 'name description components')
      .populate('createdBy', 'name email');
    
    if (!templateData) {
      return res.status(404).json({ message: 'Template data not found' });
    }

    res.json(templateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all template data for a specific template
exports.getAllTemplateData = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { templateId };
    if (status) {
      query.status = status;
    }

    const templateData = await TemplateData.find(query)
      .populate('templateId', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await TemplateData.countDocuments(query);

    res.json({
      templateData,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update template data
exports.updateTemplateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, status } = req.body;

    const templateData = await TemplateData.findById(id);
    if (!templateData) {
      return res.status(404).json({ message: 'Template data not found' });
    }

    // Only allow updates by creator or admin
    if (templateData.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this template data' });
    }

    templateData.data = data || templateData.data;
    templateData.status = status || templateData.status;

    await templateData.save();
    res.json(templateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete template data
exports.deleteTemplateData = async (req, res) => {
  try {
    const templateData = await TemplateData.findById(req.params.id);
    if (!templateData) {
      return res.status(404).json({ message: 'Template data not found' });
    }

    // Only allow deletion by creator or admin
    if (templateData.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this template data' });
    }

    await templateData.remove();
    res.json({ message: 'Template data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
