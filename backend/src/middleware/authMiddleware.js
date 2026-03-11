import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
      return res.status(400).json({ msg: "invalid Token" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded._id;

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    req.user = user; 

    next();
  } catch (error) {
    return res.status(404).json({ message: "Page not found" });
  }
};

export {validateToken};