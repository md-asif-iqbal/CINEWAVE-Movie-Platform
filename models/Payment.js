import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['monthly', 'sixMonth', 'yearly'] },
    amount: { type: Number },
    currency: { type: String, default: 'BDT' },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
    },
    transactionId: { type: String, unique: true },
    sslSessionKey: { type: String },
    sslValId: { type: String },
    bankTransactionId: { type: String },
    paymentMethod: { type: String },
    cardType: { type: String },
    storeAmount: { type: Number },
    ipnResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ userId: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
