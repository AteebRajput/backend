// cloudinaryConfig.js
import dotenv from "dotenv"
import cloudinary from 'cloudinary';

dotenv.config()
// Cloudinary configuration with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary Cloud Name
  api_key: process.env.API_KEY, // Replace with your Cloudinary API Key
  api_secret: process.env.API_SECRET, // Replace with your Cloudinary API Secret
});

export default cloudinary;
