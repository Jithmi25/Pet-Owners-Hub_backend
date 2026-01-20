import Clinic from '../Models/clinic.js';

// Get all clinics with filtering, search, and pagination (Admin Dashboard)
export const getAllClinicsAdmin = async (req, res) => {
  try {
    const {
      type = 'all',
      status = 'all',
      search = '',
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    // Filter by type
    if (type && type !== 'all') {
      filter.type = type;
    }

    // Filter by verification status
    if (status && status !== 'all') {
      filter.verificationStatus = status;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Fetch clinics
    const clinics = await Clinic.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Count total documents matching filter
    const total = await Clinic.countDocuments(filter);

    // Format response to match frontend expectations
    const formattedClinics = clinics.map((clinic) => ({
      _id: clinic._id,
      id: clinic._id.toString(),
      name: clinic.name,
      type: clinic.type,
      address: clinic.address,
      phone: clinic.phone,
      hours: clinic.hours.weekday
        ? `${clinic.hours.weekday.open || '9'} AM - ${clinic.hours.weekday.close || '5'} PM`
        : '9 AM - 5 PM',
      status: clinic.verificationStatus === 'verified' ? 'Verified' : 'Pending',
      verificationStatus: clinic.verificationStatus,
    }));

    res.status(200).json({
      success: true,
      data: formattedClinics,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching clinics for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clinics',
      error: error.message,
    });
  }
};

// Get clinic details by ID (Admin)
export const getClinicDetailsAdmin = async (req, res) => {
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
    console.error('Error fetching clinic details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic details',
      error: error.message,
    });
  }
};

// Add new clinic (Admin)
export const addClinicAdmin = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      address,
      phone,
      email,
      hours,
      coordinates,
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
        message: 'Missing required fields: name, type, location, address, phone, email',
      });
    }

    // Check if clinic already exists by email
    const existingClinic = await Clinic.findOne({ email });
    if (existingClinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic with this email already exists',
      });
    }

    // Create new clinic
    const newClinic = new Clinic({
      name,
      type,
      location,
      address,
      phone,
      email,
      hours: hours || {
        weekday: { open: '09:00', close: '17:00' },
        weekend: { open: '10:00', close: '16:00' },
        emergency: false,
      },
      coordinates: coordinates || { latitude: 0, longitude: 0 },
      services: services || [],
      fees: fees || { consultation: 0 },
      description,
      imageUrl,
      availability: availability || [],
      verificationStatus: 'pending',
    });

    await newClinic.save();

    res.status(201).json({
      success: true,
      message: 'Clinic added successfully',
      data: newClinic,
    });
  } catch (error) {
    console.error('Error adding clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding clinic',
      error: error.message,
    });
  }
};

// Update clinic (Admin)
export const updateClinicAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating verification status through this endpoint
    delete updateData.verificationStatus;

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
    console.error('Error updating clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating clinic',
      error: error.message,
    });
  }
};

// Delete clinic (Admin) - Soft delete by marking as inactive
export const deleteClinicAdmin = async (req, res) => {
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
    console.error('Error deleting clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting clinic',
      error: error.message,
    });
  }
};

// Verify clinic (Admin)
export const verifyClinicAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findByIdAndUpdate(
      id,
      { verificationStatus: 'verified' },
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
      message: 'Clinic verified successfully',
      data: clinic,
    });
  } catch (error) {
    console.error('Error verifying clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying clinic',
      error: error.message,
    });
  }
};

// Get clinic statistics for admin dashboard
export const getClinicStats = async (req, res) => {
  try {
    const totalClinics = await Clinic.countDocuments({ isActive: true });
    const verifiedClinics = await Clinic.countDocuments({
      isActive: true,
      verificationStatus: 'verified',
    });
    const pendingClinics = await Clinic.countDocuments({
      isActive: true,
      verificationStatus: 'pending',
    });
    const governmentClinics = await Clinic.countDocuments({
      isActive: true,
      type: 'government',
    });
    const privateClinics = await Clinic.countDocuments({
      isActive: true,
      type: 'private',
    });

    res.status(200).json({
      success: true,
      data: {
        totalClinics,
        verifiedClinics,
        pendingClinics,
        governmentClinics,
        privateClinics,
      },
    });
  } catch (error) {
    console.error('Error fetching clinic statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
