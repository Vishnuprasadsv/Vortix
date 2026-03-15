import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware function to protect routes by validating the JWT token
const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and starts with Bearer
    if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
      return res.status(400).json({ msg: "invalid Token" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    console.log(token);

    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded._id;

    // Find the user associated with the token in the database
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    req.user = user; // Attach the user details to the request object for later use

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(404).json({ message: "Page not found" });
  }
};

export { validateToken };