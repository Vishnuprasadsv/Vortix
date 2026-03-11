import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINAARY_NAME,
    api_key: process.env.CLOUDINAARY_API,
    api_secret: process.env.CLOUDINAARY_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export { cloudinary, upload };

