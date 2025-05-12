import express from 'express';
import { getAllSellersAnalytics, getSellerDetailedAnalytics } from "../controller/analyticsController.js";
// import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for analytics
// Only authenticated buyers can access analytics
router.get('/sellers',  getAllSellersAnalytics);
router.get('/sellers/:sellerId',  getSellerDetailedAnalytics);
// router.get('/sellers', protect, restrictTo('buyer', 'both'), getAllSellersAnalytics);
// router.get('/sellers/:sellerId', protect, restrictTo('buyer', 'both'), getSellerDetailedAnalytics);

export default router;