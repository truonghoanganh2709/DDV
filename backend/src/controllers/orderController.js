import Order from '../models/Order.js';
import Product from '../models/Product.js';

function genOrderCode() {
  return `ORD${Date.now()}`;
}

export async function createOrder(req, res) {
  const body = req.body || {};
  const {
    customerInfo,
    items = [],
    paymentMethod = 'cod',
    note = '',
    promoCode = null,
    discountAmount = 0,
    shippingFee = 0,
    subtotal = 0,
    totalPrice
  } = body;

  if (!customerInfo?.name || !customerInfo?.phone) {
    return res.status(400).json({ message: 'Missing customer info' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items is required' });
  }
  if (totalPrice == null) {
    return res.status(400).json({ message: 'totalPrice is required' });
  }

  const orderCode = body.orderCode || genOrderCode();

  const order = await Order.create({
    orderCode,
    user: req.user._id,
    customerInfo,
    items,
    subtotal: Number(subtotal) || 0,
    discountAmount: Number(discountAmount) || 0,
    promoCode,
    shippingFee: Number(shippingFee) || 0,
    totalPrice: Number(totalPrice) || 0,
    paymentMethod,
    note,
    status: body.status || 'pending'
  });

  // update stock/sold (best effort)
  for (const it of items) {
    if (!it.productId) continue;
    const p = await Product.findOne({ id: String(it.productId) });
    if (!p) continue;
    const qty = Number(it.quantity) || 0;
    if (qty > 0) {
      p.stock = Math.max(0, (p.stock || 0) - qty);
      p.sold = (p.sold || 0) + qty;
      if (p.stock <= 0) p.status = 'out_of_stock';
      await p.save();
    }
  }

  return res.status(201).json(order);
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json(orders);
}

export async function getAllOrders(req, res) {
  const orders = await Order.find({}).populate('user', 'name email role').sort({ createdAt: -1 });
  return res.json(orders);
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  const order = await Order.findOne({ orderCode: String(id) }).populate('user', 'name email role');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isAdmin = req.user?.role === 'admin';
  if (!isAdmin && String(order.user?._id) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: 'Missing status' });

  const order = await Order.findOne({ orderCode: String(id) });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();
  return res.json(order);
}

