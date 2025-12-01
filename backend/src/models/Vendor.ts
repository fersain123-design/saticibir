import mongoose, { Schema } from 'mongoose';
import { IVendor } from '../types';

const vendorSchema = new Schema<IVendor>(
  {
    ownerName: {
      type: String,
      required: [true, 'Yetkili kişi adı gereklidir'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email gereklidir'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefon numarası gereklidir'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Şifre gereklidir'],
    },
    storeName: {
      type: String,
      required: [true, 'Mağaza adı gereklidir'],
      trim: true,
    },
    storeType: {
      type: String,
      trim: true,
    },
    storeDescription: {
      type: String,
      trim: true,
    },
    taxNumber: {
      type: String,
      trim: true,
    },
    taxOffice: {
      type: String,
      trim: true,
    },
    companyType: {
      type: String,
      trim: true,
    },
    address: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      fullAddress: { type: String, required: true },
      postalCode: String,
    },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected', 'suspended'],
      default: 'pending_review',
    },
    rejectionReason: String,
    logoUrl: String,
    coverImageUrl: String,
    workingHours: {
      monday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: true },
      },
    },
    documents: {
      taxSheetUrl: String,
      tradeRegistryUrl: String,
      signatureCircularUrl: String,
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
vendorSchema.index({ email: 1 });
vendorSchema.index({ status: 1 });

export default mongoose.model<IVendor>('Vendor', vendorSchema);
