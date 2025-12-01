import { Response } from 'express';
import { AuthRequest } from '../types';
import Order from '../models/Order';
import Product from '../models/Product';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { period = 'day' } = req.query;

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setDate(now.getDate() - 30));

    const vendorId = req.vendor._id;

    // Today's stats
    const todayOrders = await Order.countDocuments({
      vendorId,
      createdAt: { $gte: todayStart },
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          vendorId: vendorId.toString(),
          createdAt: { $gte: todayStart },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Week stats
    const weekOrders = await Order.countDocuments({
      vendorId,
      createdAt: { $gte: weekStart },
    });

    const weekRevenue = await Order.aggregate([
      {
        $match: {
          vendorId: vendorId.toString(),
          createdAt: { $gte: weekStart },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Month stats
    const monthOrders = await Order.countDocuments({
      vendorId,
      createdAt: { $gte: monthStart },
    });

    const monthRevenue = await Order.aggregate([
      {
        $match: {
          vendorId: vendorId.toString(),
          createdAt: { $gte: monthStart },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      vendorId,
      status: 'pending',
    });

    // Product stats
    const totalProducts = await Product.countDocuments({
      vendorId,
    });

    const activeProducts = await Product.countDocuments({
      vendorId,
      status: 'active',
    });

    const lowStockProducts = await Product.countDocuments({
      vendorId,
      $expr: { $lte: ['$stock', '$minStockThreshold'] },
    });

    // Recent orders
    const recentOrders = await Order.find({
      vendorId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Order chart data (last 7 days)
    const orderChartData = await Order.aggregate([
      {
        $match: {
          vendorId: vendorId.toString(),
          createdAt: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $ne: ['$status', 'cancelled'] }, '$total', 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill missing days with 0
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existingData = orderChartData.find((d: any) => d._id === dateStr);
      
      last7Days.push({
        date: dateStr,
        orders: existingData?.count || 0,
        revenue: existingData?.revenue || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0,
        },
        week: {
          orders: weekOrders,
          revenue: weekRevenue[0]?.total || 0,
        },
        month: {
          orders: monthOrders,
          revenue: monthRevenue[0]?.total || 0,
        },
        pending: {
          orders: pendingOrders,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
        },
        recentOrders,
        chartData: last7Days,
      },
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınamadı',
      error: error.message,
    });
  }
};
