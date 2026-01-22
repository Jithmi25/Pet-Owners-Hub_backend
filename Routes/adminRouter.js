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

const router = express.Router();

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

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
