import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  basePrice: { type: Number, required: true },
  highestBid: { 
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, default: 0 },
  },
  bidders: [
    {
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bidderName: {type: String},
      amount: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ["active", "expired","ending"], default: "active" },
});

// Middleware to remove bid from auction when a bid is deleted
auctionSchema.post("findOneAndDelete", async function (bid) {
  if (!bid) return;
  
  const auction = await mongoose.model("Auction").findOne({ "bidders._id": bid._id });

  if (auction) {
    // Remove bid from bidders array
    auction.bidders = auction.bidders.filter(b => b._id.toString() !== bid._id.toString());

    // If the deleted bid was the highest, find new highest bid
    if (auction.highestBid && auction.highestBid.amount === bid.amount) {
      const newHighestBid = auction.bidders.length
        ? auction.bidders.reduce((prev, current) => (prev.amount > current.amount ? prev : current))
        : { bidder: null, amount: 0 };

      auction.highestBid = newHighestBid;
    }

    await auction.save();
  }
});

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
