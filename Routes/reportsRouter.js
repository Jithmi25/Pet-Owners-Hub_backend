import express from 'express';
import {
    getSummaryReport,
    getUserActivityReport,
    getPetListingsReport,
    getTransactionsReport,
    getUserGrowthReport,
    getPetListingsByTypeReport,
    exportReportAsCSV,
    getAllReportsData
} from '../Controllers/reportsController.js';
import { authenticate, requireAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and admin role check to all report routes
// Uncomment these middleware for production
// router.use(authenticate);
// router.use(requireAdmin);

// Get all reports data (dashboard)
router.get('/all', getAllReportsData);

// Get summary report
router.get('/summary', getSummaryReport);

// Get user activity report
router.get('/user-activity', getUserActivityReport);

// Get pet listings report
router.get('/pet-listings', getPetListingsReport);

// Get transactions report
router.get('/transactions', getTransactionsReport);

// Get user growth chart data
router.get('/user-growth', getUserGrowthReport);

// Get pet listings by type chart data
router.get('/pet-types', getPetListingsByTypeReport);

// Export report as CSV
router.get('/export', exportReportAsCSV);

export default router;
