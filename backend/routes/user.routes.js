import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUsers,
  deleteUser,
  getDashboardStats,
  suspendUser,
  unsuspendUser,
  restrictUserIP,
  removeIPRestriction,
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.post('/', registerUser);

// Protected routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/dashboard', protect, admin, getDashboardStats);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/suspend', protect, admin, suspendUser);
router.put('/:id/unsuspend', protect, admin, unsuspendUser);
router.put('/:id/restrict-ip', protect, admin, restrictUserIP);
router.put('/:id/unrestrict-ip', protect, admin, removeIPRestriction);

export default router;
