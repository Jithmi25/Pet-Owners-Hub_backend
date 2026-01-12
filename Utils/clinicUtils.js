// Utility functions for clinic operations

/**
 * Generate time slots for a given date and time range
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {number} intervalMinutes - Interval between slots (default: 30)
 * @returns {Array} Array of time slot objects
 */
export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let current = new Date();
  current.setHours(startHour, startMinute, 0, 0);

  const endDateTime = new Date();
  endDateTime.setHours(endHour, endMinute, 0, 0);

  while (current < endDateTime) {
    const timeString = current.toTimeString().substring(0, 5);
    slots.push({
      time: timeString,
      available: true,
    });
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
};

/**
 * Get day of week from date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} Day of week (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  return date.getDay();
};

/**
 * Check if clinic is open on a specific date and time
 * @param {Array} availability - Clinic availability array
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {boolean} Whether clinic is open
 */
export const isClinicOpen = (availability, date, time) => {
  const dayOfWeek = getDayOfWeek(date);
  const dayAvailability = availability.find((av) => av.dayOfWeek === dayOfWeek);

  if (!dayAvailability || !dayAvailability.isAvailable) {
    return false;
  }

  const [availStart, availEnd] = [
    dayAvailability.startTime,
    dayAvailability.endTime,
  ];
  return time >= availStart && time <= availEnd;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - User latitude
 * @param {number} lon1 - User longitude
 * @param {number} lat2 - Clinic latitude
 * @param {number} lon2 - Clinic longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format date for display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Check if a time slot is available
 * @param {Array} bookedSlots - Array of booked slots
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {boolean} Whether slot is available
 */
export const isSlotAvailable = (bookedSlots, date, time) => {
  const selectedDate = new Date(date);
  return !bookedSlots.some(
    (slot) =>
      slot.date.toDateString() === selectedDate.toDateString() &&
      slot.time === time &&
      slot.status === 'booked'
  );
};

/**
 * Get business hours string
 * @param {object} hours - Clinic hours object
 * @returns {string} Formatted hours string
 */
export const getBusinessHoursString = (hours) => {
  const weekday = `${hours.weekday.open} - ${hours.weekday.close}`;
  const weekend = `${hours.weekend.open} - ${hours.weekend.close}`;
  const emergency = hours.emergency ? ' (24/7 Emergency)' : '';
  return `Mon-Fri: ${weekday}, Sat-Sun: ${weekend}${emergency}`;
};

/**
 * Sort clinics by proximity
 * @param {Array} clinics - Array of clinic objects
 * @param {number} userLat - User latitude
 * @param {number} userLon - User longitude
 * @returns {Array} Sorted clinics array
 */
export const sortClinicsByDistance = (clinics, userLat, userLon) => {
  return [...clinics].sort((a, b) => {
    const distanceA = calculateDistance(
      userLat,
      userLon,
      a.coordinates.latitude,
      a.coordinates.longitude
    );
    const distanceB = calculateDistance(
      userLat,
      userLon,
      b.coordinates.latitude,
      b.coordinates.longitude
    );
    return distanceA - distanceB;
  });
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

/**
 * Get clinic rating badge color
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Color code
 */
export const getRatingBadgeColor = (rating) => {
  if (rating >= 4.5) return '#27ae60'; // Green
  if (rating >= 4.0) return '#3498db'; // Blue
  if (rating >= 3.5) return '#f39c12'; // Orange
  if (rating >= 3.0) return '#e67e22'; // Dark Orange
  return '#e74c3c'; // Red
};

/**
 * Generate appointment confirmation text
 * @param {object} appointment - Appointment data
 * @returns {string} Confirmation text
 */
export const generateConfirmationText = (appointment) => {
  return `
    Appointment Confirmed!
    
    Clinic: ${appointment.clinic}
    Date: ${formatDate(appointment.date)}
    Time: ${appointment.time}
    Service: ${appointment.service}
    Pet ID: ${appointment.petId}
    
    Please arrive 10 minutes early.
  `.trim();
};
