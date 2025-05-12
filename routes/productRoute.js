import express from "express";
import multer from "multer";
import { storage } from "../CloudinaryConfig.js"; // Import Cloudinary storage
import { protect, verifyToken } from "../middleware/verifyToken.js"; // Middleware for authentication
import { 
  addProductController, 
  deleteProductController, 
  getUserProductsController, 
  getAllProductsController,
  updateProductController 
} from "../controller/productController.js";

const router = express.Router();
const upload = multer({ storage }); // Configure multer with Cloudinary storage

// Route to add a product (with multiple image uploads)
router.post("/add-product", upload.array('images', 5), addProductController);

// Route to update a product (with multiple image uploads)
router.put("/update-product/:id", upload.array('images', 5), updateProductController);

// Get all products for a specific user
router.get("/get-all-products/:userId", verifyToken, getUserProductsController);

// Delete a product
router.delete("/delete-product/:id",  deleteProductController);

router.get("/get-all-products", getAllProductsController);

export default router;
