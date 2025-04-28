const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/lowcode?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
const authRouter = require('../routes/auth');
const templatesRouter = require('../routes/templates');
const deploymentsRouter = require('../routes/deployments');

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/templates', templatesRouter);
app.use('/.netlify/functions/api/deployments', deploymentsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the handler
module.exports.handler = serverless(app);
