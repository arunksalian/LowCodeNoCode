const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'deployed', 'failed'],
    default: 'pending'
  },
  url: {
    type: String
  },
  framework: {
    type: String,
    default: 'nextjs'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Deployment = mongoose.model('Deployment', deploymentSchema);

module.exports = Deployment;
