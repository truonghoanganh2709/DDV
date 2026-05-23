import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);

