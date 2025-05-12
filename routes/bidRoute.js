import express from 'express';
import { getUserSpecificBids, placeBidController } from '../controller/biddingController.js';


const router = express.Router()

router.post("/place-bid",placeBidController)
router.get("/get-bids/:userId",getUserSpecificBids)

export default router