import { Router } from "express";
import {login, register, profile, checkUsername,updateProfile, updatePassword, uploadAvatar} from "../controllers/authController.js";
import { validateToken } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js"; 

const router = Router();

router.get('/check-username/:username', checkUsername);
router.post('/register', register);
router.post('/login', login);


router.get('/profile', validateToken, profile);
router.put('/profile', validateToken, updateProfile);
router.put('/profile/password', validateToken, updatePassword);


router.post('/profile/avatar', validateToken, upload.single('avatar'), uploadAvatar);

export default router;