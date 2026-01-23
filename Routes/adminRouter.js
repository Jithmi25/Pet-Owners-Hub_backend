import express from 'express';
import { getDashboardStats } from '../Controllers/adminController.js';
import {
  getAllClinicsAdmin,
  getClinicDetailsAdmin,
  addClinicAdmin,
  updateClinicAdmin,
  deleteClinicAdmin,
  verifyClinicAdmin,
  getClinicStats,
} from '../Controllers/adminClinicController.js';
import {
  getAllShopsAdmin,
  getShopDetailsAdmin,
  addShopAdmin,
  updateShopAdmin,
  deleteShopAdmin,
  verifyShopAdmin,
  getShopStats,
} from '../Controllers/adminShopController.js';
import {
  getAllUsersAdmin,
  getUserDetailsAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  updateUserStatus,
  getUserStats,
  bulkDeleteUsers,
  exportUsersToCSV,
  resetUserPassword
} from '../Controllers/adminUserController.js';
import { authenticate, requireAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and admin role check to all routes
// Comment out these middleware if you want to test without authentication
// router.use(authenticate);
// router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// User management routes
router.get('/users/stats', getUserStats);
router.get('/users/export', exportUsersToCSV);
router.get('/users', getAllUsersAdmin);
router.get('/users/:id', getUserDetailsAdmin);
router.post('/users', createUserAdmin);
router.put('/users/:id', updateUserAdmin);
router.delete('/users/:id', deleteUserAdmin);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/reset-password', resetUserPassword);
router.post('/users/bulk-delete', bulkDeleteUsers);

// Clinic management routes
router.get('/clinics/stats', getClinicStats);
router.get('/clinics', getAllClinicsAdmin);
router.get('/clinics/:id', getClinicDetailsAdmin);
router.post('/clinics', addClinicAdmin);
router.put('/clinics/:id', updateClinicAdmin);
router.delete('/clinics/:id', deleteClinicAdmin);
router.patch('/clinics/:id/verify', verifyClinicAdmin);

// Shop management routes
router.get('/shops/stats', getShopStats);
router.get('/shops', getAllShopsAdmin);
router.get('/shops/:id', getShopDetailsAdmin);
router.post('/shops', addShopAdmin);
router.put('/shops/:id', updateShopAdmin);
router.delete('/shops/:id', deleteShopAdmin);
router.patch('/shops/:id/verify', verifyShopAdmin);

export default router;
