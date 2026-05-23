import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

    userId: { type: String, default: '', trim: true }, // phục vụ UI cũ (mock)
    userName: { type: String, default: '', trim: true },
    productId: { type: String, default: '', trim: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true },
    status: { type: String, enum: ['visible', 'hidden', 'pending'], default: 'pending' }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);

