import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction", // Reference to the Auction model
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const Bid = mongoose.model("Bid", bidSchema);
