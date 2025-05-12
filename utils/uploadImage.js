// upload.js

import multer from 'multer';
import cloudinary from './cloudinaryConfig.js';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Set storage engine for multer (store image in memory)
const storage = multer.memoryStorage();

// Initialize multer
const upload = multer({ storage: storage });

// Function to upload an image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result); // Returns Cloudinary URL and other image metadata
        }
      })
      .end(file.buffer); // Send the buffer of the uploaded file to Cloudinary
  });
};

export { upload, uploadToCloudinary };
