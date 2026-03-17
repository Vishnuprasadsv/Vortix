import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cloudinary } from "../config/cloudinary.js";

// Function to handle user login
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // Normalize email to lowercase
        email = email.trim().toLowerCase();
        
        // Find user by email in the database
        let user = await userModel.findOne({ email });

        // If user doesn't exist, return error
        if (!user) {
            return res.status(400).json({ msg: "Couldn't find a user with this email id. Please register before login" })
        }

        // Compare the provided password with the stored hashed password
        let isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            // Format user details for response
            const formattedUser = {
                ...user.toObject(),
                uid: user._id,
                displayName: user.userName,
                photoURL: user.avatar_url || ""
            };

            // Generate a JWT token valid for 7 days
            const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: "7d" })
            res.status(200).json({
                msg: "logged in successfully",
                token,
                user: formattedUser
            })
        } else {
            return res.status(400).json({ msg: "email or password not matching" })
        }
    } catch (error) {
        console.log("Login Error:", error.message);
        res.status(500).json({ msg: "Internal server error during login", error: error.message });
    }
}

// Function to handle new user registration
const register = async (req, res) => {
    try {
        const { username, email, password, mobile, agreed_to_terms } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Check if a user with this email already exists
        const isExising = await userModel.findOne({ email: normalizedEmail })

        if (isExising) {
            return res.status(400).json({ msg: "user already exist with this email" })
        }

        // Hash the password securely
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user in the database
        const newUser = await userModel.create({
            userName: username,
            email: normalizedEmail,
            password: hashedPassword,
            mobile,
            agreed_to_terms
        });

        res.status(201).json({ msg: "user created successfully", user: newUser })
    } catch (error) {
        console.log("Registration Error:", error.message);
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ msg: "Validation Error", error: error.message });
        }
        res.status(500).json({ msg: "error while adding data", error: error.message })
    }
}

// Function to check if a username is already taken
const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        // Search for the username in the database
        const user = await userModel.findOne({ userName: username });
        if (user) {
            return res.json({ available: false }); // Taken
        }
        res.json({ available: true }); // Available
    } catch (error) {
        console.error("CheckUsername Error:", error);
        res.status(500).json({
            msg: "Server error checking username",
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
}

// Function to get the logged-in user's profile
const profile = async (req, res) => {
    const user = req.user; // Retrieved from auth middleware

    // Format data to match frontend expectations
    const formattedUser = {
        ...user.toObject ? user.toObject() : user,
        uid: user._id,
        displayName: user.userName,
        photoURL: user.avatar_url || ""
    };

    res.status(200).json({ user: formattedUser });
}

// Function to update user profile (email, mobile)
const updateProfile = async (req, res) => {
    try {
        const { email, mobile } = req.body;
        const userId = req.user._id;

        // Build data object only with provided fields
        const updateData = {};
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;

        // Update the user details and returning the updated document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true, context: 'query' }
        ).select('-password'); // Exclude password from response

        res.status(200).json({ msg: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Error updating profile", error: error.message });
    }
}

// Function to update password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect current password" });
        }

        // Hash the new password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(newPassword, salt);

        // Save the new password to database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error updating password", error: error.message });
    }
}

// Function to upload/update user avatar
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No image file provided" });
        }

        const userId = req.user._id;

        // Upload the file buffer to Cloudinary using a stream
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "vortix_profiles" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const avatar_url = uploadResponse.secure_url;

        // Save the avatar URL back to the user document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { avatar_url },
            { new: true }
        ).select('-password');

        res.status(200).json({ msg: "Avatar updated successfully", user: updatedUser, url: avatar_url });
    } catch (error) {
        res.status(500).json({ msg: "Error uploading avatar", error: error.message });
    }
}

export { login, register, profile, checkUsername, updateProfile, updatePassword, uploadAvatar };