import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/3d-print-hub';
    await mongoose.connect(mongoUri);
    const email = 'connect2rachit882@gmail.com';
    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      const adminParams = {
        firstName: 'Admin',
        lastName: 'Account',
        email: email,
        mobile: '0000000000',
        password: 'Rachit@12',
        role: 'admin'
      };
      const user = new User(adminParams);
      await user.save();
      console.log('Admin user seeded properly via MONGODB_URI.');
    } else {
      existingAdmin.role = 'admin';
      existingAdmin.password = 'Rachit@12';
      await existingAdmin.save();
      console.log('Admin user updated via MONGODB_URI.');
    }
  } catch (error) {
    console.error('Error seeding admin', error);
  } finally {
    process.exit();
  }
};

seedAdmin();
