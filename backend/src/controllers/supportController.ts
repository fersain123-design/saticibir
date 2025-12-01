import { Response } from 'express';
import { AuthRequest } from '../types';
import SupportTicket from '../models/SupportTicket';

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { subject, category, message } = req.body;

    if (!subject || !category || !message) {
      res.status(400).json({
        success: false,
        message: 'Konu, kategori ve mesaj gereklidir',
      });
      return;
    }

    const ticket = await SupportTicket.create({
      vendorId: req.vendor._id,
      subject,
      category,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Destek talebi oluşturuldu',
      data: {
        ticket,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Destek talebi oluşturulamadı',
      error: error.message,
    });
  }
};

export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { vendorId: req.vendor._id };

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SupportTicket.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        tickets,
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
      message: 'Destek talepleri alınamadı',
      error: error.message,
    });
  }
};

export const getTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: 'Destek talebi bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ticket,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Destek talebi alınamadı',
      error: error.message,
    });
  }
};
