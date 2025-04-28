const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/lowcode?authSource=admin';

const resetAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Deleted existing admin user');

    // Create new admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isAdmin: true
    });

    await admin.save();
    console.log('New admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin user:', error);
    process.exit(1);
  }
};

resetAdmin();
