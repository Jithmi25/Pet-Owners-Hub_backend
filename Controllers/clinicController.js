import Clinic from '../Models/clinic.js';

// Get all clinics with filtering and pagination
export const getAllClinics = async (req, res) => {
  try {
    const { type, location, search, page = 1, limit = 10, sortBy = 'name' } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (location && location !== 'all') {
      filter.location = location;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { 'services.name': { $regex: search, $options: 'i' } },
      ];
    }

    // Define sort options
    const sortOptions = {
      name: { name: 1 },
      location: { location: 1 },
      type: { type: 1 },
      rating: { 'rating.average': -1 },
    };

    const sortObj = sortOptions[sortBy] || sortOptions.name;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const clinics = await Clinic.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Clinic.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: clinics,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinics',
      error: error.message,
    });
  }
};

// Get clinic by ID
export const getClinicById = async (req, res) => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic',
      error: error.message,
    });
  }
};

// Create new clinic (Admin only)
export const createClinic = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      address,
      phone,
      email,
      coordinates,
      hours,
      services,
      fees,
      description,
      imageUrl,
      availability,
    } = req.body;

    // Validate required fields
    if (!name || !type || !location || !address || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if clinic already exists
    const existingClinic = await Clinic.findOne({ email });
    if (existingClinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic with this email already exists',
      });
    }

    const clinic = new Clinic({
      name,
      type,
      location,
      address,
      phone,
      email,
      coordinates,
      hours,
      services,
      fees,
      description,
      imageUrl,
      availability,
    });

    await clinic.save();

    res.status(201).json({
      success: true,
      message: 'Clinic created successfully',
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating clinic',
      error: error.message,
    });
  }
};

// Update clinic (Admin only)
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const clinic = await Clinic.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clinic updated successfully',
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating clinic',
      error: error.message,
    });
  }
};

// Delete clinic (Admin only)
export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clinic deleted successfully',
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting clinic',
      error: error.message,
    });
  }
};

// Get emergency clinics
export const getEmergencyClinics = async (req, res) => {
  try {
    const { location } = req.query;

    const filter = {
      isActive: true,
      'hours.emergency': true,
    };

    if (location && location !== 'all') {
      filter.location = location;
    }

    const clinics = await Clinic.find(filter).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency clinics',
      error: error.message,
    });
  }
};

// Get available time slots for a clinic
export const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required',
      });
    }

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    // Get availability for this day
    const dayAvailability = clinic.availability.find(
      (av) => av.dayOfWeek === dayOfWeek
    );

    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Clinic is closed on this day',
      });
    }

    // Generate time slots (30-minute intervals)
    const slots = [];
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);

    const startTime = new Date(selectedDate);
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, endMinute, 0);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().substring(0, 5);
      const isBooked = clinic.bookedSlots.some(
        (slot) =>
          slot.date.toDateString() === selectedDate.toDateString() &&
          slot.time === timeString &&
          slot.status === 'booked'
      );

      slots.push({
        time: timeString,
        isAvailable: !isBooked,
      });

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message,
    });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, petId, service } = req.body;

    if (!date || !time || !petId || !service) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: date, time, petId, service',
      });
    }

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    // Check if slot is already booked
    const selectedDate = new Date(date);
    const existingBooking = clinic.bookedSlots.find(
      (slot) =>
        slot.date.toDateString() === selectedDate.toDateString() &&
        slot.time === time &&
        slot.status === 'booked'
    );

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    // Add booking
    clinic.bookedSlots.push({
      date: selectedDate,
      time,
      petId,
      service,
      status: 'booked',
    });

    await clinic.save();

    res.status(200).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        clinic: clinic.name,
        date,
        time,
        service,
        petId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message,
    });
  }
};

// Get clinic by location
export const getClinicsByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const clinics = await Clinic.find({
      location,
      isActive: true,
    }).sort({ 'rating.average': -1 });

    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinics by location',
      error: error.message,
    });
  }
};

// Search clinics
export const searchClinics = async (req, res) => {
  try {
    const { query, type, location } = req.query;

    const filter = { isActive: true };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { 'services.name': { $regex: query, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (location && location !== 'all') {
      filter.location = location;
    }

    const clinics = await Clinic.find(filter).sort({ 'rating.average': -1 });

    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching clinics',
      error: error.message,
    });
  }
};

// Add clinic rating
export const rateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5',
      });
    }

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    // Calculate new average rating
    const newTotal = clinic.rating.average * clinic.rating.count + rating;
    const newCount = clinic.rating.count + 1;
    clinic.rating.average = newTotal / newCount;
    clinic.rating.count = newCount;

    await clinic.save();

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: clinic.rating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating clinic',
      error: error.message,
    });
  }
};
