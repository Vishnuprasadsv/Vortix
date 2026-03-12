import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINAARY_NAME || process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINAARY_API || process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINAARY_SECRET || process.env.API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export { cloudinary, upload };

