// Middleware for clinic operations

import { isValidEmail, isValidPhone } from '../Utils/clinicUtils.js';

/**
 * Validate clinic input data
 */
export const validateClinicInput = (req, res, next) => {
  const { name, type, location, address, phone, email } = req.body;

  // Validate required fields
  if (!name || !type || !location || !address || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, type, location, address, phone, email',
    });
  }

  // Validate type
  if (!['government', 'private'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid clinic type. Must be "government" or "private"',
    });
  }

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  // Validate phone
  if (!isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format',
    });
  }

  next();
};

/**
 * Validate appointment booking data
 */
export const validateBookingInput = (req, res, next) => {
  const { date, time, petId, service } = req.body;

  if (!date || !time || !petId || !service) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: date, time, petId, service',
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD',
    });
  }

  // Validate time format (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid time format. Use HH:MM',
    });
  }

  // Validate that date is not in the past
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Cannot book appointment for past dates',
    });
  }

  next();
};

/**
 * Validate rating input
 */
export const validateRatingInput = (req, res, next) => {
  const { rating } = req.body;

  if (rating === undefined || rating === null) {
    return res.status(400).json({
      success: false,
      message: 'Rating is required',
    });
  }

  const ratingValue = parseFloat(rating);

  if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be a number between 0 and 5',
    });
  }

  next();
};

/**
 * Validate clinic ID format
 */
export const validateClinicId = (req, res, next) => {
  const { id } = req.params;

  // Simple MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-f]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid clinic ID format',
    });
  }

  next();
};

/**
 * Validate query parameters for filtering
 */
export const validateFilterParams = (req, res, next) => {
  const { type, location, page, limit, sortBy } = req.query;

  // Validate type
  if (type && !['government', 'private', 'all'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid type filter. Must be "government", "private", or "all"',
    });
  }

  // Validate page and limit
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page number',
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit. Must be between 1 and 100',
    });
  }

  // Validate sortBy
  if (sortBy && !['name', 'location', 'type', 'rating'].includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid sortBy parameter. Must be "name", "location", "type", or "rating"',
    });
  }

  next();
};

/**
 * Check if clinic exists
 */
export const checkClinicExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Clinic = (await import('../Models/clinic.js')).default;

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    // Attach clinic to request for use in next middleware/controller
    req.clinic = clinic;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking clinic existence',
      error: error.message,
    });
  }
};

/**
 * Handle errors globally
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // MongoDB cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
};
