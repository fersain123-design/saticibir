import { Response } from 'express';
import { AuthRequest } from '../types';
import Vendor from '../models/Vendor';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const vendorData = {
      id: req.vendor._id,
      email: req.vendor.email,
      ownerName: req.vendor.ownerName,
      phone: req.vendor.phone,
      storeName: req.vendor.storeName,
      storeType: req.vendor.storeType,
      storeDescription: req.vendor.storeDescription,
      taxNumber: req.vendor.taxNumber,
      taxOffice: req.vendor.taxOffice,
      companyType: req.vendor.companyType,
      status: req.vendor.status,
      rejectionReason: req.vendor.rejectionReason,
      logoUrl: req.vendor.logoUrl,
      coverImageUrl: req.vendor.coverImageUrl,
      address: req.vendor.address,
      workingHours: req.vendor.workingHours,
      documents: req.vendor.documents,
      createdAt: req.vendor.createdAt,
      updatedAt: req.vendor.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: {
        vendor: vendorData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profil bilgisi alınamadı',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const allowedUpdates = [
      'ownerName',
      'phone',
      'storeName',
      'storeType',
      'storeDescription',
      'address',
      'logoUrl',
      'coverImageUrl',
    ];

    const updates: any = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash -refreshToken');

    res.status(200).json({
      success: true,
      message: 'Profil güncellendi',
      data: {
        vendor,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Profil güncellenemedi',
      error: error.message,
    });
  }
};

export const updateWorkingHours = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { workingHours } = req.body;

    if (!workingHours) {
      res.status(400).json({
        success: false,
        message: 'Çalışma saatleri gereklidir',
      });
      return;
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      { $set: { workingHours } },
      { new: true, runValidators: true }
    ).select('-passwordHash -refreshToken');

    res.status(200).json({
      success: true,
      message: 'Çalışma saatleri güncellendi',
      data: {
        vendor,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Çalışma saatleri güncellenemedi',
      error: error.message,
    });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Dosya yüklenmedi',
      });
      return;
    }

    const { documentType } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const updateField: any = {};
    if (documentType === 'taxSheet') {
      updateField['documents.taxSheetUrl'] = fileUrl;
    } else if (documentType === 'tradeRegistry') {
      updateField['documents.tradeRegistryUrl'] = fileUrl;
    } else if (documentType === 'signatureCircular') {
      updateField['documents.signatureCircularUrl'] = fileUrl;
    } else {
      res.status(400).json({
        success: false,
        message: 'Geçersiz belge tipi',
      });
      return;
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      { $set: updateField },
      { new: true }
    ).select('-passwordHash -refreshToken');

    res.status(200).json({
      success: true,
      message: 'Belge yüklendi',
      data: {
        fileUrl,
        vendor,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Belge yüklenemedi',
      error: error.message,
    });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        documents: req.vendor.documents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Belgeler alınamadı',
    });
  }
};
