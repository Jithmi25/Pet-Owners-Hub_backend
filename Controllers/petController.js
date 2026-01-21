import Pet from '../Models/pet.js';

// @desc    Get all pets with filtering and pagination
// @route   GET /api/admin/pets
// @access  Admin
export const getAllPets = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      location,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (location && location !== 'all') {
      query.location = location.toLowerCase();
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query with pagination
    const pets = await Pet.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Pet.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPets: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pets',
      error: error.message,
    });
  }
};

// @desc    Get single pet by ID
// @route   GET /api/admin/pets/:id
// @access  Admin
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet',
      error: error.message,
    });
  }
};

// @desc    Create new pet
// @route   POST /api/admin/pets
// @access  Admin
export const createPet = async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      price,
      location,
      status,
      owner,
      ownerContact,
      image,
      description,
      vaccinated,
      dewormed,
    } = req.body;

    // Validate required fields
    if (!name || !type || !breed || !age || !price || !location || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create new pet
    const pet = await Pet.create({
      name,
      type: type.toLowerCase(),
      breed,
      age,
      price: parseFloat(price),
      location: location.toLowerCase(),
      status: status ? status.toLowerCase() : 'available',
      owner,
      ownerContact,
      image: image || 'https://placehold.co/50x50?text=Pet',
      description,
      vaccinated: vaccinated || false,
      dewormed: dewormed || false,
    });

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: pet,
    });
  } catch (error) {
    console.error('Error creating pet:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create pet',
      error: error.message,
    });
  }
};

// @desc    Update pet
// @route   PUT /api/admin/pets/:id
// @access  Admin
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert specific fields to lowercase if they exist
    if (updateData.type) updateData.type = updateData.type.toLowerCase();
    if (updateData.location) updateData.location = updateData.location.toLowerCase();
    if (updateData.status) updateData.status = updateData.status.toLowerCase();

    const pet = await Pet.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      data: pet,
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update pet',
      error: error.message,
    });
  }
};

// @desc    Delete pet (soft delete)
// @route   DELETE /api/admin/pets/:id
// @access  Admin
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pet',
      error: error.message,
    });
  }
};

// @desc    Permanently delete pet
// @route   DELETE /api/admin/pets/:id/permanent
// @access  Admin
export const deletePetPermanent = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet permanently deleted',
    });
  } catch (error) {
    console.error('Error permanently deleting pet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete pet',
      error: error.message,
    });
  }
};

// @desc    Update pet status
// @route   PATCH /api/admin/pets/:id/status
// @access  Admin
export const updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['available', 'sold', 'pending'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: available, sold, or pending',
      });
    }

    const pet = await Pet.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Pet status updated to ${status}`,
      data: pet,
    });
  } catch (error) {
    console.error('Error updating pet status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pet status',
      error: error.message,
    });
  }
};

// @desc    Get pet statistics
// @route   GET /api/admin/pets/stats
// @access  Admin
export const getPetStatistics = async (req, res) => {
  try {
    const stats = await Pet.getStatistics();

    // Get pets by type
    const typeStats = await Pet.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get pets by location
    const locationStats = await Pet.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats,
        byType: typeStats,
        byLocation: locationStats,
      },
    });
  } catch (error) {
    console.error('Error fetching pet statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

// @desc    Bulk delete pets
// @route   POST /api/admin/pets/bulk-delete
// @access  Admin
export const bulkDeletePets = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of pet IDs',
      });
    }

    const result = await Pet.updateMany(
      { _id: { $in: ids } },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} pets`,
      data: result,
    });
  } catch (error) {
    console.error('Error bulk deleting pets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk delete pets',
      error: error.message,
    });
  }
};

// @desc    Restore deleted pet
// @route   PATCH /api/admin/pets/:id/restore
// @access  Admin
export const restorePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet restored successfully',
      data: pet,
    });
  } catch (error) {
    console.error('Error restoring pet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore pet',
      error: error.message,
    });
  }
};
