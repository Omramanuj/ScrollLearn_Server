import mongoose from 'mongoose';
require('dotenv').config(); // For environment variables

// Get connection string from environment variables or use directly
const uri = process.env.MONGODB_URI;
// Replace <username>, <password>, and <cluster-url> with your actual values

const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

export default connectDB;