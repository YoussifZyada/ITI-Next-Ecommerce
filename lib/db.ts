import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = mongoose;

  // Set connection options to avoid timeout and buffering issues
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  }).then((mongoose) => {
    console.log('✅ MongoDB connected successfully');
  }).catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  (global as any).mongoose = cached;
}

const db = cached;

// Ensuring the connection is ready before queries
(db as any).connect = async () => {
  if (mongoose.connection.readyState === 1) return;

  // If we are not connected, wait for the initial connection to complete
  if (mongoose.connection.readyState === 2) {
    // Ready state 2 means connecting, wait for it to finish
    return new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
  }

  await mongoose.connect(MONGODB_URI);
};

export default db;
