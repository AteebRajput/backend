import express from "express";
import {
  createOrderController,
  placeOrderController,
  updateOrderStatusController,
  fetchFarmerOrdersController,
  fetchUserOrder,
  deleteOrderController
} from "../controller/orderController.js";

const router = express.Router();

router.post("/create", createOrderController);
router.post("/place-order", placeOrderController);
router.put("/:orderId/status", updateOrderStatusController);
// Fetch orders for a specific farmer
router.get("/get-orders/:farmerId", fetchFarmerOrdersController);
router.get("/get-user-orders/:userId", fetchUserOrder);
router.delete("/delete-order/:orderId",deleteOrderController)
// router.get("")
export default router;
