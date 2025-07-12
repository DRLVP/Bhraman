import mongoose from 'mongoose';
import { serverEnvConfig } from '@/constants/envConfig';

const MONGODB_URI = serverEnvConfig.mongoDbUrl || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
  connectionAttempts: number;
  lastErrorTime: number | null;
} = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
    isConnecting: false,
    connectionAttempts: 0,
    lastErrorTime: null,
  };
}

/**
 * Connect to MongoDB with improved error handling and connection management
 * @returns Mongoose connection or error response
 */
async function connectDB() {
  // If we already have a connection, return it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.isConnecting && cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      // If the existing promise fails, we'll try again below
      console.error('Error while waiting for existing connection:', error);
    }
  }

  // Check if we've had too many recent connection attempts
  const MAX_ATTEMPTS = 5;
  const COOLDOWN_PERIOD = 10000; // 10 seconds
  const now = Date.now();

  if (
    cached.connectionAttempts >= MAX_ATTEMPTS &&
    cached.lastErrorTime &&
    now - cached.lastErrorTime < COOLDOWN_PERIOD
  ) {
    console.warn(`Too many connection attempts (${cached.connectionAttempts}). Cooling down.`);
    throw new Error('Database connection throttled due to multiple failed attempts. Please try again later.');
  }

  // Start a new connection attempt
  cached.isConnecting = true;
  cached.connectionAttempts++;

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
      socketTimeoutMS: 45000, // 45 seconds for socket timeout
      maxPoolSize: 10, // Maximum number of connections in the pool
    };

    // Clear any existing promise
    cached.promise = null;
    
    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
    
    // Wait for the connection
    cached.conn = await cached.promise;
    
    // Reset connection attempts on success
    cached.connectionAttempts = 0;
    cached.lastErrorTime = null;
    console.log('MongoDB connected successfully');
    
    // Setup connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cached.conn = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cached.conn = null;
    });
    
    return cached.conn;
  } catch (error) {
    // Handle connection error
    cached.lastErrorTime = Date.now();
    cached.promise = null;
    cached.conn = null;
    cached.isConnecting = false;
    
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  } finally {
    cached.isConnecting = false;
  }
}

export default connectDB;