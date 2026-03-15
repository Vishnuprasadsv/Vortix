import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config();

// Track if the database is already connected
let isConnected = false;

// Function to connect to MongoDB
const dbconnect = async () => {
    // If already connected, reuse the existing connection
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }

    try {
        // Connect to MongoDB using the URI from environment variables
        const db = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL);
        isConnected = db.connections[0].readyState; // Update connection state
        console.log("DB connected successfully !!!");
    } catch (error) {
        console.error(`Error while connecting DB: ${error.message}`);
        throw error; // Throw error if connection fails
    }
}

export default dbconnect
