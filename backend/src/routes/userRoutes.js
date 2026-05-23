import express from 'express';
import { deleteUser, getUsers, updateUserRole, updateUserStatus } from '../controllers/userAdminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/status', protect, adminOnly, updateUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;

