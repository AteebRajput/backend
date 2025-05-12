import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary with your account credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Set up Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // The folder in Cloudinary where images will be stored
    allowed_formats: ["jpeg", "png", "jpg"], // Specify allowed file formats
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Optional transformations
  },
});

export { cloudinary, storage };
