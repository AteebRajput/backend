import express from "express";
import {
  createAuctionController,
  getFarmerAuctionsController,
  getAuctionDetails,
  endAuctionController,
  getAuctionBidsController,
} from "../controller/auctionController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// POST route to create an auction
router.post("/create-auction", createAuctionController);

// GET route to fetch farmer's auctions
router.get("/farmer-auctions", getFarmerAuctionsController);

router.get("/:auctionId/bids", getAuctionBidsController);
// POST route to end an auction
router.post("/:auctionId/end", endAuctionController);

router.get("/auction-details/:productId", getAuctionDetails);

export default router;
