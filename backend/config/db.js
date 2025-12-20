import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      console.error("Please create a .env file in the backend directory with MONGO_URI");
      process.exit(1);
    }

    // Connect to MongoDB with proper options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options help with connection stability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error("❌ Mongo Connection Error:", err.message);
    console.error("\nTroubleshooting tips:");
    console.error("1. Make sure MongoDB is running (mongod command)");
    console.error("2. Check your MONGO_URI in the .env file");
    console.error("3. Verify the connection string format");
    console.error("4. For MongoDB Atlas, check your IP whitelist and credentials\n");
    process.exit(1);
  }
};

export default connectDB;
