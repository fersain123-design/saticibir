import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import Vendor from '../models/Vendor';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken } from '../utils/jwt';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const {
      ownerName,
      email,
      phone,
      password,
      storeName,
      storeType,
      storeDescription,
      taxNumber,
      taxOffice,
      companyType,
      address,
      documents,
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (existingVendor) {
      res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı',
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
      return;
    }

    // Check if tax sheet is uploaded (required)
    if (!documents || !documents.taxSheetUrl) {
      res.status(400).json({
        success: false,
        message: 'Vergi levhası yüklenmesi zorunludur',
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create vendor
    const vendor = await Vendor.create({
      ownerName,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      storeName,
      storeType,
      storeDescription,
      taxNumber,
      taxOffice,
      companyType,
      address,
      documents,
      status: 'pending_review', // Default status
    });

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı. Hesabınız inceleme aşamasındadır.',
      data: {
        vendor: {
          id: vendor._id,
          email: vendor.email,
          storeName: vendor.storeName,
          status: vendor.status,
        },
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu',
      error: error.message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    // Find vendor
    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) {
      res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı',
      });
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, vendor.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı',
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: vendor._id, email: vendor.email });
    const refreshToken = generateRefreshToken({ id: vendor._id, email: vendor.email });

    // Save refresh token
    vendor.refreshToken = refreshToken;
    await vendor.save();

    // Prepare vendor data (without sensitive info)
    const vendorData = {
      id: vendor._id,
      email: vendor.email,
      ownerName: vendor.ownerName,
      phone: vendor.phone,
      storeName: vendor.storeName,
      storeType: vendor.storeType,
      storeDescription: vendor.storeDescription,
      status: vendor.status,
      rejectionReason: vendor.rejectionReason,
      logoUrl: vendor.logoUrl,
      coverImageUrl: vendor.coverImageUrl,
      address: vendor.address,
      workingHours: vendor.workingHours,
      createdAt: vendor.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        accessToken,
        refreshToken,
        vendor: vendorData,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu',
      error: error.message,
    });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token gereklidir',
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find vendor
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor || vendor.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz refresh token',
      });
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({ id: vendor._id, email: vendor.email });

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token yenileme başarısız',
    });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.vendor) {
      req.vendor.refreshToken = undefined;
      await req.vendor.save();
    }

    res.status(200).json({
      success: true,
      message: 'Çıkış başarılı',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Çıkış sırasında bir hata oluştu',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) {
      // Don't reveal if email exists
      res.status(200).json({
        success: true,
        message: 'Eğer email kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
      });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
    await vendor.save();

    // In production, send email here
    // For now, just return success (email simulation)
    
    res.status(200).json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi',
      // In development, include token
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi başarısız',
    });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token ve yeni şifre gereklidir',
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
      return;
    }

    // Find vendor with valid reset token
    const vendor = await Vendor.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!vendor) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token',
      });
      return;
    }

    // Update password
    vendor.passwordHash = await hashPassword(newPassword);
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpire = undefined;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Şifre başarıyla güncellendi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi başarısız',
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Mevcut şifre ve yeni şifre gereklidir',
      });
      return;
    }

    // Check current password
    const isPasswordValid = await comparePassword(currentPassword, req.vendor.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Mevcut şifre hatalı',
      });
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
      return;
    }

    // Update password
    req.vendor.passwordHash = await hashPassword(newPassword);
    await req.vendor.save();

    res.status(200).json({
      success: true,
      message: 'Şifre başarıyla güncellendi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Şifre güncelleme işlemi başarısız',
    });
  }
};
