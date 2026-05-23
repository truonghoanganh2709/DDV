import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },

    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, default: '', trim: true },

    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: 0, min: 0 },

    minOrderValue: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, default: () => new Date() },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Promotion', promotionSchema);

