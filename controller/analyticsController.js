import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Auction from '../models/auctionModel.js';

/**
 * Get summary analytics for all sellers
 * @route GET /api/analytics/sellers
 * @access Private (Buyer)
 */
export const getAllSellersAnalytics = async (req, res) => {
  try {
    // Find all users who are sellers or both (seller and buyer)
    const sellers = await User.find({
      role: { $in: ['seller', 'both'] },
      isVerified: true
    }).select('name company state address createdAt');
    
    // Prepare response array
    const sellersWithAnalytics = await Promise.all(
      sellers.map(async (seller) => {
        // Get total products of the seller
        const totalProducts = await Product.countDocuments({ seller: seller._id });
        
        // Get total sales (completed orders where this user is the seller)
        const sales = await Order.aggregate([
          { $match: { sellerId: seller._id, status: 'completed' } },
          { $group: { _id: null, totalSales: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
        ]);
        
        // Get order completion percentage
        const totalOrders = await Order.countDocuments({ sellerId: seller._id });
        const completedOrders = await Order.countDocuments({ 
          sellerId: seller._id, 
          status: 'completed' 
        });
        
        // Calculate completion percentage
        const completionPercentage = totalOrders > 0 
          ? Math.round((completedOrders / totalOrders) * 100) 
          : 0;
        
        return {
          id: seller._id,
          name: seller.name,
          company: seller.company,
          location: seller.state + (seller.address ? `, ${seller.address}` : ''),
          totalProducts,
          totalSales: sales[0]?.totalSales || 0,
          totalOrders: sales[0]?.count || 0,
          completionPercentage
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: sellersWithAnalytics.length,
      data: sellersWithAnalytics
    });
    
  } catch (error) {
    console.error('Error in getAllSellersAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sellers analytics',
      error: error.message
    });
  }
};


/**
 * Get detailed analytics for a specific seller
 * @route GET /api/analytics/sellers/:sellerId
 * @access Private (Buyer)
 */
export const getSellerDetailedAnalytics = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId).select(
      'name company email phone state address postalCode createdAt'
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    const basicInfo = {
      farmName: seller.company,
      location: seller.state + (seller.address ? `, ${seller.address}` : ''),
      email: seller.email,
      phone: seller.phone,
      state: seller.state,
      postalCode: seller.postalCode,
      address: seller.address,
      joiningDate: seller.createdAt
    };

    const orderStats = await Order.aggregate([
      { $match: { sellerId: seller._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const orderStatusMap = orderStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        revenue: stat.revenue
      };
      return acc;
    }, {});

    const totalRevenue = Object.values(orderStatusMap).reduce((sum, stat) => sum + stat.revenue, 0);
    const totalOrders = Object.values(orderStatusMap).reduce((sum, stat) => sum + stat.count, 0);
    const completedOrders = orderStatusMap.completed?.count || 0;
    const pendingOrders = orderStatusMap.pending?.count || 0;
    const cancelledOrders = orderStatusMap.cancelled?.count || 0;

    const completionPercentage = totalOrders > 0
      ? Math.round((completedOrders / totalOrders) * 100)
      : 0;

    const productStats = await Product.aggregate([
      { $match: { seller: seller._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const productStatusMap = productStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const totalProducts = Object.values(productStatusMap).reduce((sum, count) => sum + count, 0);
    const activeProducts = productStatusMap.active || 0;
    const soldProducts = productStatusMap.sold || 0;
    const expiredProducts = productStatusMap.expired || 0;

    // New: Category-wise product stats
    const productCategoryStats = await Product.aggregate([
      { $match: { seller: seller._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryCounts = productCategoryStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalAuctions = await Auction.countDocuments({ ownerId: seller._id });
    const successfulAuctions = await Auction.countDocuments({
      ownerId: seller._id,
      status: 'expired',
      'highestBid.amount': { $gt: 0 }
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const timeSeriesData = await Order.aggregate([
      {
        $match: {
          sellerId: seller._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const graphData = {
      revenue: timeSeriesData.map(item => ({
        month: item._id,
        value: item.revenue
      })),
      orders: timeSeriesData.map(item => ({
        month: item._id,
        value: item.orderCount
      }))
    };

    const recentOrders = await Order.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productId', 'name')
      .populate('buyerId', 'name')
      .lean();

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order._id,
      productName: order.productId?.name || 'Unknown Product',
      buyerName: order.buyerId?.name || 'Unknown Buyer',
      amount: order.totalAmount,
      orderType: order.orderType,
      status: order.status,
      createdAt: order.createdAt
    }));

    const topProducts = await Order.aggregate([
      { $match: { sellerId: seller._id, status: 'completed' } },
      {
        $group: {
          _id: '$productId',
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
          totalQuantity: {
            $sum: {
              $cond: [
                { $eq: ['$orderType', 'fixed'] },
                '$quantity',
                1
              ]
            }
          }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          id: '$_id',
          name: '$productInfo.name',
          category: '$productInfo.category',
          totalSales: 1,
          count: 1,
          quantity: '$totalQuantity',
          unit: '$productInfo.unit'
        }
      }
    ]);

    const recentAuctions = await Auction.find({ ownerId: seller._id })
      .sort({ endTime: -1 })
      .limit(5)
      .populate('productId', 'name basePrice')
      .lean();

    const formattedRecentAuctions = recentAuctions.map(auction => ({
      id: auction._id,
      productName: auction.productId?.name || 'Unknown Product',
      basePrice: auction.basePrice,
      finalPrice: auction.status === 'expired' ? (auction.highestBid?.amount || auction.basePrice) : null,
      bidders: auction.bidders.length,
      status: auction.status
    }));

    const analyticsData = {
      basicInfo,
      businessMetrics: {
        totalRevenue,
        totalOrders,
        completionPercentage
      },
      orderStats: {
        completed: completedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders
      },
      productStats: {
        totalProducts,
        activeProducts,
        soldProducts,
        expiredProducts,
        byCategory: categoryCounts
      },
      auctionStats: {
        total: totalAuctions,
        successful: successfulAuctions
      },
      graphData,
      recentOrders: formattedRecentOrders,
      topProducts,
      recentAuctions: formattedRecentAuctions
    };

    res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error in getSellerDetailedAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller analytics',
      error: error.message
    });
  }
};
