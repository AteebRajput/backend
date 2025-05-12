import Auction from "../models/auctionModel.js";
import Product from "../models/productModel.js";
import { Bid } from "../models/bidModel.js";
import User from "../models/userModel.js";
import {sendNewBidEmailToOwner} from "../nodemailer/emails.js"

export const placeBidController = async (req, res) => {
  try {
    const { productId, bidderId, bidAmount } = req.body;

    if (!productId || !bidderId || isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ error: "Invalid input for bid" });
    }

    // Find the auction based on the productId
    const auction = await Auction.findOne({ productId }).populate("highestBid.bidder","name").populate("bidders.bidder","name");

    if (!auction) return res.status(404).json({ error: "Auction not found for the provided product" });

    // Check auction status
    if (auction.status !== "active") {
      return res.status(400).json({ error: "Auction is not active" });
    }

    // Validate bid amount
    if (bidAmount <= auction.basePrice || bidAmount <= auction.highestBid.amount) {
      return res.status(400).json({ error: "Bid amount must be higher than the current base price and highest bid" });
    }

    const user = await User.findOne({ _id: bidderId }).select("name");

    // console.log(user);
    console.log("Auction",auction._id);
    console.log("Product",productId);
    
    
    

    // Update auction with the new highest bid
    auction.highestBid = { bidder: bidderId, amount: bidAmount };
    auction.bidders.push({ bidder: bidderId, amount: bidAmount ,bidderName:user.name});
    await auction.save();

    // Save the bid with the auctionId
    const bid = new Bid({
      auctionId: auction._id,  // Include auctionId in the bid
      productId: auction.productId,
      productOwnerId: auction.ownerId,
      bidder: bidderId,
      amount: bidAmount,
    });
    await bid.save();

    // Fetch owner and product and bidder full details
const product = await Product.findById(productId);
const owner = await User.findById(auction.ownerId);
const bidder = await User.findById(bidderId);

// Prepare email data
const emailData = {
  ownerName: owner.name,
  ownerEmail: owner.email,
  productName: product.name,
  bidderName: bidder.name,
  bidderEmail: bidder.email,
  bidderPhone: bidder.phone,
  bidderLocation: bidder.location,
  bidAmount: bidAmount
};

// Send email
await sendNewBidEmailToOwner(owner.email, emailData);
    res.status(200).json({ message: "Bid placed successfully", auction });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUserSpecificBids = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all bids made by this user and populate related details
    const bidData = await Bid.find({ bidder: userId })
      .populate("auctionId") // Get auction details
      .populate("productId") // Get product details
      .populate("productOwnerId") // Get product owner details
      .populate({
        path: "bidder",
        select: "name email", // Populate user name & email
      });

    if (!bidData.length) {
      return res.status(404).json({ message: "No bids found for this user" });
    }

    res.status(200).json({ message: "User bids retrieved successfully", bids: bidData });
    console.log("User bids:", bidData);
    
  } catch (error) {
    console.error("Error fetching user bids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
