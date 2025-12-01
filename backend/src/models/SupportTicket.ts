import mongoose, { Schema } from 'mongoose';
import { ISupportTicket } from '../types';

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    vendorId: {
      type: String,
      required: [true, 'Satıcı ID gereklidir'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Konu gereklidir'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'payment', 'account', 'other'],
      required: [true, 'Kategori gereklidir'],
    },
    message: {
      type: String,
      required: [true, 'Mesaj gereklidir'],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    response: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
supportTicketSchema.index({ vendorId: 1, status: 1 });
supportTicketSchema.index({ createdAt: -1 });

export default mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
