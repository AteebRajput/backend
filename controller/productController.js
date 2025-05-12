import Product from "../models/productModel.js";
import Auction from "../models/auctionModel.js";

import { createAuctionController } from "./auctionController.js"; // Import your auction controller

export const addProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      quantity,
      unit,
      quality,
      location,
      harvestDate,
      expiryDate,
      status,
      upForAuction,
      bidEndTime,
      seller,
    } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    // Validation
    if (
      !name ||
      !description ||
      !location ||
      !category ||
      !seller ||
      !images.length ||
      !basePrice ||
      !quantity ||
      !unit ||
      !quality ||
      !harvestDate ||
      !expiryDate ||
      !status
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(basePrice) || basePrice <= 0) {
      return res
        .status(400)
        .json({ error: "Base price must be a positive number" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }

    // Parse dates
    const parsedHarvestDate = new Date(harvestDate);
    const parsedExpiryDate = new Date(expiryDate);
    if (upForAuction === "true") {
      var parsedBidEndTime = new Date(bidEndTime);
    }

    // Create product
    const product = new Product({
      name,
      description,
      category,
      seller,
      images,
      basePrice: Number(basePrice),
      quantity: Number(quantity),
      unit,
      quality,
      location,
      harvestDate: parsedHarvestDate,
      expiryDate: parsedExpiryDate,
      status,
      upForAuction: upForAuction === "true",
      bidEndTime: parsedBidEndTime,
    });

    await product.save();

    let auction = null;

    // Create auction if required
    if (upForAuction === "true") {
      auction = new Auction({
        productId: product._id,
        ownerId: seller,
        basePrice: Number(basePrice),
        endTime: parsedBidEndTime,
        status: "active",
      });

      await auction.save();
    }

    res.status(201).json({
      message: "Product added successfully",
      product,
      ...(auction && { auction }),
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all products for a specific user
export const getUserProductsController = async (req, res) => {
  try {
    const userId = req.user._id; // req.user._id is populated by the verifyToken middleware

    // Fetch products where seller matches userId
    const products = await Product.find({ seller: userId });

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found for this user",
        products: [],
      });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Update product by ID

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log("Product data to be updated: ", updatedData);

    // Find the existing product before updating
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Prepare data for update
    const dataToUpdate = {
      name: updatedData.name,
      description: updatedData.description,
      category: updatedData.category,
      basePrice: Number(updatedData.basePrice),
      quantity: Number(updatedData.quantity),
      unit: updatedData.unit,
      quality: updatedData.quality,
      location: updatedData.location,
      harvestDate: new Date(updatedData.harvestDate),
      expiryDate: new Date(updatedData.expiryDate),
      status: updatedData.status,
      upForAuction: updatedData.upForAuction,
      bidEndTime: updatedData.upForAuction
        ? new Date(updatedData.bidEndTime)
        : null,
      seller: updatedData.seller,
    };

    // Update the product
    const product = await Product.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found after update" });
    }

    // Check if there's an associated auction for this product
    const auction = await Auction.findOne({ productId: id });

    if (auction) {
      const currentTime = new Date();
      const newBidEndTime = new Date(updatedData.bidEndTime);
      const previousBidEndTime = auction.endTime;

      if (newBidEndTime > previousBidEndTime && newBidEndTime > currentTime) {
        product.status = "active";
        await product.save();
      }
      // Check if the auction is expired and the new bid time is valid
      if (
        auction.status === "expired" &&
        newBidEndTime > previousBidEndTime &&
        newBidEndTime > currentTime
      ) {
        auction.status = "active";
        auction.endTime = newBidEndTime;
        await auction.save();

        // Update product status as well
        product.status = "active";
        await product.save();
        console.log(`Auction for product ${id} has been reactivated.`);
      }
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Detailed update error:", error);
    res.status(500).json({
      message: "Failed to update product",
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};

// Delete product by ID
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from request params

    // Check if product ID is provided
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Check if the product exists
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with a success message and the deleted product details
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    // Handle server error
    res.status(500).json({
      message: "Failed to delete product due to a server error",
      error: error.message,
    });
  }
};

// Get all active products
export const getAllProductsController = async (req, res) => {
  try {
    // Fetch all active products
    const products = await Product.find({
      status: "active",
      // Optionally add more filters like not expired
      // expiryDate: { $gt: new Date() }
    });

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No active products found",
        products: [],
        totalProducts: 0,
      });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      totalProducts: products.length,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
