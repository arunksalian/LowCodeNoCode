const mongoose = require('mongoose');

const dataSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['rest', 'graphql', 'database']
  },
  config: {
    url: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE']
    },
    headers: {
      type: Map,
      of: String
    },
    body: String,
    queryParams: {
      type: Map,
      of: String
    }
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

dataSourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DataSource', dataSourceSchema); 