import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>(
  {
    vendorId: {
      type: String,
      required: [true, 'Satıcı ID gereklidir'],
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      address: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        unit: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
orderSchema.index({ vendorId: 1, status: 1 });
orderSchema.index({ vendorId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderNumber = `ORD-${dateStr}-${random}`;
  }
  
  // Initialize status history
  if (this.isNew) {
    this.statusHistory = [
      {
        status: this.status,
        changedAt: new Date(),
      },
    ];
  }
  
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
