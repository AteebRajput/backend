// orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderType: {
    type: String,
    enum: ["auction", "fixed"],
    required: true,
  },
  // For auction orders
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: function () {
      return this.orderType === "auction";
    },
  },
  bidAmount: {
    type: Number,
    required: function () {
      return this.orderType === "auction";
    },
  },
  // For fixed-price orders
  quantity: {
    type: Number,
    required: function () {
      return this.orderType === "fixed";
    },
  },
  unitPrice: {
    type: Number,
    required: function () {
      return this.orderType === "fixed";
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing","ending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total amount before saving
orderSchema.pre("save", function (next) {
  if (this.orderType === "fixed") {
    this.totalAmount = this.quantity * this.unitPrice;
  } else {
    this.totalAmount = this.bidAmount;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
