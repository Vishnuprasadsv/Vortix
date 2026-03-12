import mongoose from'mongoose'
import dotenv from 'dotenv'

dotenv.config(); 

let isConnected = false;

const dbconnect = async () => {
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL); 
        isConnected = db.connections[0].readyState;
        console.log("DB connected successfully !!!");
    } catch (error) {
        console.error(`Error while connecting DB: ${error.message}`);
        throw error;
    }
}

export default dbconnect
