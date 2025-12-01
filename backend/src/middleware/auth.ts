import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import Vendor from '../models/Vendor';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme tokenı bulunamadı',
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      const vendor = await Vendor.findById(decoded.id).select('-passwordHash -refreshToken');

      if (!vendor) {
        res.status(401).json({
          success: false,
          message: 'Satıcı bulunamadı',
        });
        return;
      }

      req.vendor = vendor;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
    });
  }
};

export const requireApprovedStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    if (req.vendor.status !== 'approved') {
      let message = 'Hesabınız henüz onaylandı';
      
      if (req.vendor.status === 'pending_review') {
        message = 'Hesabınız inceleme aşamasında. Lütfen onay bekleyiniz.';
      } else if (req.vendor.status === 'rejected') {
        message = `Hesabınız reddedildi. Sebep: ${req.vendor.rejectionReason || 'Belirtilmemiş'}`;
      } else if (req.vendor.status === 'suspended') {
        message = 'Hesabınız askıya alınmıştır. Lütfen destek ekibi ile iletişime geçiniz.';
      }

      res.status(403).json({
        success: false,
        message,
        status: req.vendor.status,
        rejectionReason: req.vendor.rejectionReason,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
    });
  }
};
