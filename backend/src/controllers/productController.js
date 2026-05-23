import Product from '../models/Product.js';

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function getProducts(req, res) {
  const { category, brand, keyword, status, includeHidden } = req.query || {};
  const isAdmin = req.user?.role === 'admin';

  const filter = {};
  if (category) filter.category = String(category);
  if (brand) filter.brand = String(brand);
  if (keyword) filter.name = { $regex: String(keyword), $options: 'i' };

  if (isAdmin && (includeHidden === 'true' || status)) {
    if (status) filter.status = String(status);
  } else {
    filter.status = 'active';
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return res.json(products);
}

export async function getProductById(req, res) {
  const { id } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const product = await Product.findOne({ id: String(id) });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (!isAdmin && product.status !== 'active') {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json(product);
}

export async function createProduct(req, res) {
  const data = req.body || {};
  const id = data.id || `p${Date.now()}`;

  const exists = await Product.findOne({ id });
  if (exists) return res.status(400).json({ message: 'Product id already exists' });

  const product = await Product.create({
    ...data,
    id,
    price: toNumber(data.price),
    oldPrice: toNumber(data.oldPrice, toNumber(data.price)),
    originalPrice: toNumber(data.originalPrice, toNumber(data.oldPrice, toNumber(data.price))),
    stock: toNumber(data.stock),
    sold: toNumber(data.sold),
    rating: toNumber(data.rating, 0),
    reviewCount: toNumber(data.reviewCount, 0)
  });

  return res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const data = req.body || {};
  const product = await Product.findOne({ id: String(id) });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, data);
  if (data.price != null) product.price = toNumber(data.price, product.price);
  if (data.oldPrice != null) product.oldPrice = toNumber(data.oldPrice, product.oldPrice);
  if (data.originalPrice != null) product.originalPrice = toNumber(data.originalPrice, product.originalPrice);
  if (data.stock != null) product.stock = toNumber(data.stock, product.stock);
  if (data.sold != null) product.sold = toNumber(data.sold, product.sold);
  if (data.rating != null) product.rating = toNumber(data.rating, product.rating);
  if (data.reviewCount != null) product.reviewCount = toNumber(data.reviewCount, product.reviewCount);

  await product.save();
  return res.json(product);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  const product = await Product.findOne({ id: String(id) });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.deleteOne();
  return res.json({ message: 'Deleted' });
}

