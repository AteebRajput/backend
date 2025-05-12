import Auction from "../models/auctionModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { sendAuctionEndEmaiToOwner,sendAuctionWinEmailToWinner } from "../nodemailer/emails.js";

export const createAuctionController = async (req, res) => {
  try {
    const { productId, bidDuration } = req.body;
    console.log("request hits");

    // Validate input
    if (
      !productId ||
      !bidDuration ||
      !["hours", "days"].includes(bidDuration.unit) ||
      isNaN(bidDuration.value)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input for auction creation" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const sellerInfo = await User.findById(product.seller);
    console.log("Seller info", sellerInfo);

    const currentTime = new Date();

    const endTime =
      bidDuration.unit === "hours"
        ? new Date(currentTime.getTime() + bidDuration.value * 60 * 60 * 1000)
        : new Date(
            currentTime.getTime() + bidDuration.value * 24 * 60 * 60 * 1000
          );

    const auction = new Auction({
      productId,
      ownerId: product.seller,
      basePrice: product.basePrice,
      endTime,
    });
    await sendAuctionCreatedEmail(sellerInfo.email, {
      name: sellerInfo.name,
      productName: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      basePrice: product.basePrice,
      quality: product.quality,
      harvestDate: product.harvestDate.toDateString(),
      expiryDate: product.expiryDate.toDateString(),
      location: product.location,
      bidEndTime: endTime.toDateString(),
      productURL: `https://your-domain.com/products/${product._id}`,
    });
    await auction.save();

    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller methods
export const getFarmerAuctionsController = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from query parameters
    // console.log('Fetch request is made', userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const auctions = await Auction.find({ ownerId: userId })
      .populate("productId", "name")
      .populate("highestBid.bidder", "name")
      .lean();

    const formattedAuctions = auctions.map((auction) => ({
      id: auction._id,
      productName: auction.productId
        ? auction.productId.name
        : "Unknown Product", // Handle null productId
      basePrice: auction.basePrice,
      highestBid: auction.highestBid,
      bidderCount: auction.bidders ? auction.bidders.length : 0, // Handle missing bidders array
      startTime: auction.startTime,
      endTime: auction.endTime,
      ownerId: userId,
      status: auction.status,
    }));

    res.status(200).json(formattedAuctions);
  } catch (error) {
    console.error("Error fetching farmer auctions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAuctionBidsController = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId).populate({
      path: "bidders.bidder",
      select: "name",
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    // console.log("These are the functions:",auction);

    res.status(200).json(auction.bidders);
  } catch (error) {
    console.error("Error fetching auction bids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const endAuctionController = async (req, res) => {
  try {
    const { auctionId } = req.params; // auctionId comes from URL params
    const { ownerId, manualEnd } = req.body; // manualEnd flag indicates manual ending

    console.log("Auction Id:", auctionId);
    console.log("Farmer Id:", ownerId);

    // Find the active auction by auctionId, ownerId, and status
    const auction = await Auction.findOne({
      _id: auctionId,
      ownerId: ownerId || auction?.ownerId, // Handle auto-end scenario
      status: "active",
    });

    if (!auction) {
      console.log("No active auction found.");
      return res.status(404).json({ error: "Active auction not found" });
    }

    // Check whether the auction has expired or if manual ending is triggered
    if (manualEnd || new Date() > auction.endTime) {
      console.log(
        manualEnd ? "Ending auction manually" : "Auction time has passed."
      );

      // Call helper function to end the auction (same logic for both manual and auto-ending)
      await endAuction(auction, auctionId);

      return res.status(200).json({
        message: "Auction ended successfully",
        winner: auction.highestBid?.bidder || "No winner",
      });
    }

    return res.status(400).json({ error: "Auction time has not yet ended." });
  } catch (error) {
    console.error("Error ending auction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to handle auction ending process (winner logic and order creation)
export const endAuction = async (auction, auctionId) => {
  try {
    auction.status = "expired";

    if (auction.highestBid) {
      console.log("Auction has a highest bidder. Marking winner and creating order.");

      const order = new Order({
        productId: auction.productId,
        buyerId: auction.highestBid.bidder,
        sellerId: auction.ownerId,
        orderType: "auction",
        auctionId: auction._id,
        bidAmount: auction.highestBid.amount,
        totalAmount: auction.highestBid.amount,
        status: "completed",
      });

      await order.save();

      await Product.findByIdAndUpdate(auction.productId, {
        status: "sold",
        upForAuction: false,
      });

      const [seller, buyer, product] = await Promise.all([
        User.findById(auction.ownerId),
        User.findById(auction.highestBid.bidder),
        Product.findById(auction.productId),
      ]);

      const data = {
        productName: product.name,
        ownerName: seller.name,
        ownerPhone: seller.phone,
        ownerEmail: seller.email,
        ownerLocation: seller.location,
        winnerName: buyer.name,
        winnerPhone: buyer.phone,
        winnerEmail: buyer.email,
        winnerLocation: buyer.location,
        bidAmount: auction.highestBid.amount,
      };

      await Promise.all([
        sendAuctionEndEmaiToOwner(seller.email, data),
        sendAuctionWinEmailToWinner(buyer.email, data),
      ]);

    } else {
      console.log("No bids placed. Auction ended without a winner.");
    }

    await auction.save();

  } catch (error) {
    console.error(`Error ending auction ${auctionId}:`, error);
  }
};

// Fetch auction details for a specific product
export const getAuctionDetails = async (req, res) => {
  const { productId } = req.params;

  try {
    const auction = await Auction.findOne({ productId: productId }).populate(
      "highestBid.bidder bidders.bidder"
    ); // Populate bidder data

    if (!auction) {
      return res
        .status(404)
        .json({ message: "Auction not found or auction has ended." });
    }

    // Calculate highest bid (if any)
    const highestBid = auction.highestBid.amount;

    // Calculate total bidders (length of bidders array)
    const totalBidders = auction.bidders.length;

    // Calculate remaining time
    const remainingTime = new Date(auction.endTime) - new Date();
    const formattedRemainingTime = remainingTime > 0 ? remainingTime : 0; // Remaining time in milliseconds

    res.json({
      highestBid,
      totalBidders,
      remainingTime: formattedRemainingTime, // Return remaining time in ms
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching auction details.",
        error: error.message,
      });
  }
};
