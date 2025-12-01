import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IVendor extends Document {
  _id: Types.ObjectId;
  ownerName: string;
  email: string;
  phone: string;
  passwordHash: string;
  storeName: string;
  storeType?: string;
  storeDescription?: string;
  taxNumber?: string;
  taxOffice?: string;
  companyType?: string;
  address: {
    province: string;
    district: string;
    fullAddress: string;
    postalCode?: string;
  };
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  workingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  documents: {
    taxSheetUrl?: string;
    tradeRegistryUrl?: string;
    signatureCircularUrl?: string;
  };
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  _id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  unit: string;
  stock: number;
  minStockThreshold: number;
  status: 'active' | 'inactive';
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  _id: string;
  vendorId: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: Array<{
    productId: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status: string;
    changedAt: Date;
    note?: string;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupportTicket extends Document {
  _id: string;
  vendorId: string;
  subject: string;
  category: 'technical' | 'payment' | 'account' | 'other';
  message: string;
  status: 'open' | 'closed';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  vendor?: IVendor;
}

export interface JWTPayload {
  id: string;
  email: string;
}
