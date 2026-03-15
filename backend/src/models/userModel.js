import mongoose, { Schema } from "mongoose";

// Define the schema (structure) for User accounts in the database
const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "username is required"],
        minLength: 3,
        maxLength: 15,
        trim: true, // Removes extra spaces
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        minLength: 3,
        trim: true,
        unique: true,
        lowercase: true, // Converts email to lowercase
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    mobile: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Mobile Number required"],
        minLength: 10,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6
    },
    avatar_url: {
        type: String, // Store URL of uploaded profile picture
        default: ""
    }
},
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the user model
export default mongoose.models['user'] || mongoose.model('user', userSchema);
