import express from 'express';
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,
  getPendingShops,
  getShopStats,
} from '../Controllers/shopController.js';

const router = express.Router();

// Public routes
router.get('/', getAllShops); // Get all approved shops with filters
router.get('/stats', getShopStats); // Get shop statistics
router.get('/:id', getShopById); // Get single shop by ID
router.post('/', createShop); // Submit new shop for approval

// Admin routes (these would normally require authentication middleware)
router.get('/pending', getPendingShops); // Get pending shops for admin review
router.put('/:id', updateShop); // Update shop
router.delete('/:id', deleteShop); // Delete shop
router.patch('/:id/approve', approveShop); // Approve shop
router.patch('/:id/reject', rejectShop); // Reject shop

export default router;
