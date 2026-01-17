import express from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  approveListing,
  rejectListing,
  markAsSold,
  getPendingListings,
  getListingStats,
  recordInquiry,
} from '../Controllers/listingController.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings); // Get all active listings with filters
router.get('/stats', getListingStats); // Get listing statistics
router.get('/:id', getListingById); // Get single listing by ID
router.post('/', createListing); // Submit new listing for approval
router.post('/:id/inquiry', recordInquiry); // Record inquiry for a listing

// Admin routes (these would normally require authentication middleware)
router.get('/pending', getPendingListings); // Get pending listings for admin review
router.put('/:id', updateListing); // Update listing
router.delete('/:id', deleteListing); // Delete listing
router.patch('/:id/approve', approveListing); // Approve listing
router.patch('/:id/reject', rejectListing); // Reject listing
router.patch('/:id/sold', markAsSold); // Mark as sold

export default router;
