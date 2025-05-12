import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// Controller for fixed-price orders
export const placeOrderController = async (req, res) => {
  try {
    const { productId, buyerId, quantity } = req.body;

    // Input validation
    if (!productId || !buyerId || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input for order placement" });
    }

    // Find and validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate buyer
    if (buyerId === product.seller.toString()) {
      return res.status(400).json({ error: "You cannot order your own product" });
    }

    // Validate quantity
    if (quantity > product.quantity) {
      return res.status(400).json({ error: "Requested quantity exceeds available stock" });
    }

    if (product.minQuantity && quantity < product.minQuantity) {
      return res.status(400).json({ 
        error: `Minimum order quantity is ${product.minQuantity}` 
      });
    }

    // Create fixed-price order
    const order = new Order({
      productId,
      buyerId,
      sellerId: product.seller,
      orderType: "fixed",
      quantity,
      unitPrice: product.basePrice,
      totalAmount: quantity * product.basePrice,
      status: "pending"
    });

    await order.save();

    // Update product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({
      message: "success",
      order
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createOrderController = async (req, res) => {
  try {
    const { auctionId, winnerId, productId, bidAmount, sellerId } = req.body;

    // Input validation
    if (!auctionId || !winnerId || !productId || !bidAmount || !sellerId) {
      return res.status(400).json({ 
        error: "Missing required fields for auction order" 
      });
    }

    // Create auction order
    const order = new Order({
      productId,
      buyerId: winnerId,
      sellerId,
      orderType: "auction",
      auctionId,
      bidAmount,
      totalAmount: bidAmount,
      status: "pending"
    });

    await order.save();

    res.status(201).json({
      message: "Auction order created successfully",
      order
    });

  } catch (error) {
    console.error("Error creating auction order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be one of: " + validStatuses.join(", ") 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller to delete an order
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params; // Get orderId from route parameters

    // Find the order by ID
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status === "completed") {
      return res.status(400).json({error:"The order is completed. You can't delete it now"})
    }
    // Restore the product's quantity if the order was canceled
    const product = await Product.findById(order.productId);
    if (product && order.orderType === "fixed") {
      product.quantity += order.quantity;
      await product.save(); // Save updated product quantity
    }

    // Delete the order from the database
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const fetchFarmerOrdersController = async (req, res) => {
  const { farmerId } = req.params; // Extract farmerId from route params
  const { status } = req.query; // Extract status from query params

  try {
    // Build a filter object
    const filter = { sellerId: farmerId };
    if (status) filter.status = status;

    // Fetch orders and populate referenced fields
    const orders = await Order.find(filter)
      .populate('productId', 'name email') // Populate product details
      .populate('buyerId', 'name email'); // Populate buyer details (winner)

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const fetchUserOrder = async(req,res) => {
  const { userId} = req.params
  
  try {
    // Build a filter object
    const filter = { buyerId: userId };
    

    // Fetch orders and populate referenced fields
    const orders = await Order.find(filter)
      .populate('productId', 'name email') // Populate product details
      .populate('buyerId', 'name email') // Populate buyer details (winner)
      .populate('sellerId','name email');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

