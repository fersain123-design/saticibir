import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import Order from '../models/Order';

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const {
      status,
      paymentStatus,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const query: any = { vendorId: req.vendor._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Filter by date range
    if (from || to) {
      query.createdAt = {};
      if (from) {
        query.createdAt.$gte = new Date(from as string);
      }
      if (to) {
        query.createdAt.$lte = new Date(to as string);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Siparişler alınamadı',
      error: error.message,
    });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const order = await Order.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Sipariş alınamadı',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Doğrulama hatası',
        errors: errors.array(),
      });
      return;
    }

    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { status, note } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı',
      });
      return;
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['preparing', 'cancelled'],
      preparing: ['on_the_way', 'cancelled'],
      on_the_way: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      res.status(400).json({
        success: false,
        message: `${order.status} durumundan ${status} durumuna geçiş yapılamaz`,
      });
      return;
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      changedAt: new Date(),
      note,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      data: {
        order,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Sipariş durumu güncellenemedi',
      error: error.message,
    });
  }
};

export const getOrderStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { from, to } = req.query;

    const query: any = { vendorId: req.vendor._id };

    if (from || to) {
      query.createdAt = {};
      if (from) {
        query.createdAt.$gte = new Date(from as string);
      }
      if (to) {
        query.createdAt.$lte = new Date(to as string);
      }
    }

    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
        },
      },
    ]);

    const statusCounts = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
        statusCounts: statusCounts.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınamadı',
      error: error.message,
    });
  }
};
