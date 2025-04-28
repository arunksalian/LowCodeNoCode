const mongoose = require('mongoose');

const componentDataSchema = new mongoose.Schema({
  componentId: {
    type: String,
    required: true
  },
  value: mongoose.Schema.Types.Mixed,
  isValid: {
    type: Boolean,
    default: true
  },
  validationMessage: String
}, { _id: false });

const templateDataSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: [componentDataSchema],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for faster queries
templateDataSchema.index({ templateId: 1, createdBy: 1 });

const TemplateData = mongoose.model('TemplateData', templateDataSchema);
module.exports = TemplateData;
