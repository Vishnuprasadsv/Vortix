import mongoose from'mongoose'
import dotenv from 'dotenv'

dotenv.config(); 

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log("DB connected successfully !!!");
        
    } catch (error) {
        console.log(`Error while connectting DB ${error.message}`);
        
    }
}

export default dbconnect
