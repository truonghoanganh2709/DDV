import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    cta: { type: String, default: '' },
    bg: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);

