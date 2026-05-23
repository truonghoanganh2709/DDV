import Review from '../models/Review.js';
import Product from '../models/Product.js';

async function recalcProductRating(productIdStr) {
  const product = await Product.findOne({ id: String(productIdStr) });
  if (!product) return;

  const reviews = await Review.find({ product: product._id, status: 'visible' });
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
  product.reviewCount = count;
  product.rating = Math.round(avg * 10) / 10;
  await product.save();
}

export async function getReviewsByProduct(req, res) {
  const { productId } = req.params;
  const product = await Product.findOne({ id: String(productId) });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const reviews = await Review.find({ product: product._id, status: 'visible' })
    .sort({ createdAt: -1 })
    .select('-__v');
  return res.json(reviews);
}

export async function createReview(req, res) {
  const { productId, rating, comment = '' } = req.body || {};
  if (!productId || !rating) return res.status(400).json({ message: 'Missing fields' });

  const product = await Product.findOne({ id: String(productId) });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  try {
    const review = await Review.create({
      id: `rev-${Date.now()}`,
      user: req.user._id,
      product: product._id,
      userId: String(req.user._id),
      userName: req.user.name || req.user.email,
      productId: product.id,
      rating: Number(rating),
      comment,
      status: 'pending'
    });
    await recalcProductRating(product.id);
    return res.status(201).json(review);
  } catch (err) {
    if (String(err?.code) === '11000') {
      return res.status(400).json({ message: 'Ban da danh gia san pham nay' });
    }
    throw err;
  }
}

export async function getAllReviews(req, res) {
  const list = await Review.find({})
    .populate('user', 'name email role')
    .populate('product', 'id name')
    .sort({ createdAt: -1 });
  return res.json(list);
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  const review = await Review.findOne({ id: String(id) });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  const product = await Product.findById(review.product);
  await review.deleteOne();
  if (product) await recalcProductRating(product.id);
  return res.json({ message: 'Deleted' });
}

export async function updateReviewStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: 'Missing status' });

  const review = await Review.findOne({ id: String(id) });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  review.status = status;
  await review.save();

  const product = await Product.findById(review.product);
  if (product) await recalcProductRating(product.id);

  return res.json(review);
}
