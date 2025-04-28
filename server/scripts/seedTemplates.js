const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

// Create a dummy user ID for seeding
const dummyUserId = new mongoose.Types.ObjectId();

const sampleTemplates = [
  {
    name: 'Basic Form',
    description: 'A simple form template with basic input fields',
    components: [
      {
        type: 'input',
        properties: {
          label: 'Name',
          placeholder: 'Enter your name',
          required: true
        },
        position: { x: 100, y: 100 }
      },
      {
        type: 'input',
        properties: {
          label: 'Email',
          placeholder: 'Enter your email',
          required: true
        },
        position: { x: 100, y: 200 }
      }
    ],
    isPublic: true,
    createdBy: dummyUserId
  },
  {
    name: 'Contact Form',
    description: 'A contact form template with multiple fields',
    components: [
      {
        type: 'input',
        properties: {
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true
        },
        position: { x: 100, y: 100 }
      },
      {
        type: 'input',
        properties: {
          label: 'Email',
          placeholder: 'Enter your email',
          required: true
        },
        position: { x: 100, y: 200 }
      },
      {
        type: 'textarea',
        properties: {
          label: 'Message',
          placeholder: 'Enter your message',
          required: true
        },
        position: { x: 100, y: 300 }
      }
    ],
    isPublic: true,
    createdBy: dummyUserId
  }
];

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lowcode-platform');
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Add sample templates
    const templates = await Template.insertMany(sampleTemplates);
    console.log('Added sample templates:', templates);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding templates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedTemplates(); 