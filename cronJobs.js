import cron from "node-cron";
import Product from "./models/productModel.js";
import Auction from "./models/auctionModel.js";
import {endAuction} from "./controller/auctionController.js"; // function to end auction


export const expireBids = async () => {
  try {
    const currentTime = new Date();

    const expiredAuctions = await Auction.find({
      endTime: { $lt: currentTime },
      status: "active",
    });

    for (const auction of expiredAuctions) {
      if (auction.highestBid && auction.highestBid.amount > 0) {
        // Auction has active bids, let `autoEndAuction` handle it
        auction.status = "ending";  // Mark it for handling by autoEndAuction
      } else {
        // No bids, mark the auction as expired and update the product status
        auction.status = "expired";
        await Product.findByIdAndUpdate(auction.productId, { status: "expired" });
        console.log(`Auction for product ${auction.productId} has expired.`);
      }
      await auction.save();
    }
  } catch (error) {
    console.error("Error expiring auctions:", error);
  }
};


export const autoEndAuction = async() =>{

// Runs every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
  try {
    const currentTime = new Date();
    const expiredAuctions = await Auction.find({
      endTime: { $lt: currentTime }, // Find auctions whose endTime has passed
      status: "active",
    });

    for (const auction of expiredAuctions) {
      await endAuction(auction); // Call your auction ending logic
      console.log(`Auction ${auction._id} ended automatically.`);
    }
  } catch (error) {
    console.error("Error running auction cron job:", error);
  }
});

}

// Run the job every minute
cron.schedule("* * * * *", expireBids);
