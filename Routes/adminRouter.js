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

export default router;
