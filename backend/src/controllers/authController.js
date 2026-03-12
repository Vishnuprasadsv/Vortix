import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cloudinary } from "../config/cloudinary.js";

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Couldn't find a user with this email id. Please register before login" })
        }

        let isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const formattedUser = {
                ...user.toObject(),
                uid: user._id,
                displayName: user.userName,
                photoURL: user.avatar_url || ""
            };

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

const register = async (req, res) => {
    try {
        const { username, email, password, mobile, agreed_to_terms } = req.body;

        const isExising = await userModel.findOne({ email: email })

        if (isExising) {
            return res.status(400).json({ msg: "user already exist with this email" })
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            userName: username,
            email,
            password: hashedPassword,
            mobile,
            agreed_to_terms
        });

        res.status(201).json({ msg: "user created successfully", user: newUser })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "error while adding data", error: error.message })
    }
}

const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ userName: username });
        if (user) {
            return res.json({ available: false });
        }
        res.json({ available: true });
    } catch (error) {
        res.status(500).json({ msg: "Server error checking username", error: error.message });
    }
}

const profile = async (req, res) => {
    const user = req.user;

    const formattedUser = {
        ...user.toObject ? user.toObject() : user,
        uid: user._id,
        displayName: user.userName,
        photoURL: user.avatar_url || ""
    };

    res.status(200).json({ user: formattedUser });
}

const updateProfile = async (req, res) => {
    try {
        const { email, mobile } = req.body;
        const userId = req.user._id;

        const updateData = {};
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true, context: 'query' }
        ).select('-password');

        res.status(200).json({ msg: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Error updating profile", error: error.message });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect current password" });
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error updating password", error: error.message });
    }
}

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No image file provided" });
        }

        const userId = req.user._id;

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