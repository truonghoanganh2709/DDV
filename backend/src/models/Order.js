import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productId: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' }
  },
  { _id: false }
);

const customerInfoSchema = new mongoose.Schema(
  {
    gender: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    district: { type: String, default: '', trim: true },
    delivery: { type: String, enum: ['home', 'store'], default: 'home' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    customerInfo: { type: customerInfoSchema, required: true },
    items: { type: [orderItemSchema], required: true, default: [] },

    subtotal: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    promoCode: { type: String, default: null, trim: true },
    shippingFee: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },

    paymentMethod: { type: String, default: 'cod', trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
      default: 'pending'
    },
    note: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

// Để frontend cũ dùng order.id như mock
orderSchema.virtual('id').get(function getId() {
  return this.orderCode;
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export default mongoose.model('Order', orderSchema);

