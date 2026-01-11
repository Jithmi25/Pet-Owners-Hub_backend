import express from 'express';
import {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
  getEmergencyClinics,
  getAvailableSlots,
  bookAppointment,
  getClinicsByLocation,
  searchClinics,
  rateClinic,
} from '../Controllers/clinicController.js';
import {
  validateClinicInput,
  validateBookingInput,
  validateRatingInput,
  validateClinicId,
  validateFilterParams,
} from '../Middleware/clinicMiddleware.js';

const router = express.Router();

// Apply filter validation to GET routes
router.use(validateFilterParams);

// Public routes
router.get('/', getAllClinics);
router.get('/search', searchClinics);
router.get('/emergency', getEmergencyClinics);
router.get('/location/:location', getClinicsByLocation);

// Routes with clinic ID parameter - validate ID format
router.get('/:id', validateClinicId, getClinicById);
router.get('/:id/slots', validateClinicId, getAvailableSlots);

// Booking and rating routes with validation
router.post('/:id/book', validateClinicId, validateBookingInput, bookAppointment);
router.post('/:id/rate', validateClinicId, validateRatingInput, rateClinic);

// Admin routes (These should be protected by authentication middleware in production)
router.post('/', validateClinicInput, createClinic);
router.put('/:id', validateClinicId, updateClinic);
router.delete('/:id', validateClinicId, deleteClinic);

export default router;
