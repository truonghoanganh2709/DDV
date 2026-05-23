import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },

    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true }, // category id (vd: 'dien-thoai')

    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    originalPrice: { type: Number, default: 0, min: 0 },

    image: { type: String, default: '' },
    images: { type: [String], default: [] },

    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },

    status: { type: String, enum: ['active', 'hidden', 'out_of_stock'], default: 'active' },

    // fields UI đang dùng (không bắt buộc)
    featured: { type: Boolean, default: false },
    flashSale: { type: Boolean, default: false },
    installment: { type: Boolean, default: true },
    promos: { type: [String], default: [] },
    colors: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

