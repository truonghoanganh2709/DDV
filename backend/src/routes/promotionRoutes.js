import express from 'express';
import {
  checkPromotion,
  createPromotion,
  deletePromotion,
  getPromotions,
  updatePromotion
} from '../controllers/promotionController.js';
import { adminOnly, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getPromotions);
router.post('/', protect, adminOnly, createPromotion);
router.put('/:id', protect, adminOnly, updatePromotion);
router.delete('/:id', protect, adminOnly, deletePromotion);
router.post('/check', checkPromotion);

export default router;

