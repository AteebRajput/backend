import mongoose from "mongoose";

// Product Model
const productSchema = new mongoose.Schema({
  // Name of the product
  name: {
    type: String,
    required: true, // Ensures the product has a name
    trim: true,     // Trims any leading or trailing spaces
  },
  
  // Description of the product
  description: {
    type: String,
    required: true, // Ensures the product has a description
    trim: true,     // Trims any leading or trailing spaces
  },

  // Category to which the product belongs (referencing a Category model)
  category: {
    type: String,
    required: true, // Ensures the product has a category assigned
  },

  // Seller of the product (referencing a User model)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensures the product has a seller
  },

  // Array of image URLs for the product
  images: {
    type: [String],
    required: true, // Ensures the product has at least one image
  },

  // Base price of the product
  basePrice: {
    type: Number,
    required: true, // Ensures the product has a base price
    min: [0, 'Base price cannot be less than zero'], // Ensures the price is positive
  },

  // Quantity available for the product
  quantity: {
    type: Number,
    required: true, // Ensures the product has a quantity
    min: [0, 'Quantity cannot be less than zero'], // Ensures quantity is not negative
  },

  // Unit of measurement for the product (e.g., kg, liter, piece)
  unit: {
    type: String,
    required: true, // Ensures the product has a unit
    enum: ['kg', 'liter', 'piece', 'box'], // Enum for possible unit values
  },

  // Quality information of the product
  quality: {
      type: String,
      required: true, // Ensures the product has a grade

  },

  upForAuction: {
    type: Boolean,
    default: false
  },

  // Location of the product (coordinates in longitude and latitude)
  location: {
    
      type: String, 
      required:true
  },

  // Harvest date of the product (when it was harvested)
  harvestDate: {
    type: Date,
    required: true, // Ensures the product has a harvest date
  },

  // Expiry date of the product (when it becomes unusable)
  expiryDate: {
    type: Date,
    required: true, // Ensures the product has an expiry date
  },

  // Status of the product (draft, active, sold, expired)
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'expired'],
    default: 'draft', // Default status is 'draft'
  },

  // End time for bidding on the product (if applicable)
  bidEndTime: {
    type: Date,
    required: false, // This field is optional, so not required
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
