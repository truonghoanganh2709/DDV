import express from 'express';
import { createReview, deleteReview, getAllReviews, getReviewsByProduct, updateReviewStatus } from '../controllers/reviewController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/', protect, createReview);
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
