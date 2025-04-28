const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
workspaceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace; 