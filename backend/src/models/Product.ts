import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    vendorId: {
      type: String,
      required: [true, 'Satıcı ID gereklidir'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Ürün adı gereklidir'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Kategori gereklidir'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Fiyat gereklidir'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'İndirimli fiyat negatif olamaz'],
    },
    unit: {
      type: String,
      required: [true, 'Birim gereklidir'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stok gereklidir'],
      min: [0, 'Stok negatif olamaz'],
      default: 0,
    },
    minStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Minimum stok eşiği negatif olamaz'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ vendorId: 1, status: 1 });
productSchema.index({ vendorId: 1, category: 1 });
productSchema.index({ name: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
