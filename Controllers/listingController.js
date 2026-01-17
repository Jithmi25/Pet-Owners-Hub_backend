import Listing from '../Models/listing.js';

// Get all active listings (with optional filters)
export const getAllListings = async (req, res) => {
  try {
    const { type, location, search, page = 1, limit = 10 } = req.query;

    let filter = { status: 'active' };

    // Apply search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { breed: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
      ];
    }

    // Apply type filter
    if (type && type !== '') {
      filter.type = type;
    }

    // Apply location filter
    if (location && location !== '') {
      filter.location = location;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Listing.countDocuments(filter);

    // Get listings with pagination
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message,
    });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message,
    });
  }
};

// Create new listing
export const createListing = async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      price,
      location,
      address,
      description,
      vaccinated,
      dewormed,
      neutered,
      healthNotes,
      sellerName,
      sellerEmail,
      sellerPhone,
    } = req.body;

    // Validate required fields
    if (!name || !type || !price || !location || !description || !sellerName || !sellerEmail || !sellerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than or equal to 0',
      });
    }

    const newListing = new Listing({
      name,
      type: type.toLowerCase(),
      breed: breed || null,
      age: age || null,
      gender: gender || '',
      price: parseInt(price),
      location: location.toLowerCase(),
      address: address || null,
      description,
      health: {
        vaccinated: vaccinated === 'true' || vaccinated === true,
        dewormed: dewormed === 'true' || dewormed === true,
        neutered: neutered === 'true' || neutered === true,
        notes: healthNotes || null,
      },
      seller: {
        name: sellerName,
        email: sellerEmail.toLowerCase(),
        phone: sellerPhone,
      },
      status: 'pending', // Listings need approval
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      message: 'Listing submitted successfully. It will be reviewed shortly.',
      data: newListing,
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message,
    });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing,
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message,
    });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
      data: deletedListing,
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message,
    });
  }
};

// Approve listing (admin)
export const approveListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: 'active', updatedAt: Date.now() },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing approved successfully',
      data: listing,
    });
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve listing',
      error: error.message,
    });
  }
};

// Reject listing (admin)
export const rejectListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: 'removed', updatedAt: Date.now() },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing rejected successfully',
      data: listing,
    });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject listing',
      error: error.message,
    });
  }
};

// Mark listing as sold
export const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: 'sold', updatedAt: Date.now() },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing marked as sold',
      data: listing,
    });
  } catch (error) {
    console.error('Error marking listing as sold:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark listing as sold',
      error: error.message,
    });
  }
};

// Get pending listings (admin)
export const getPendingListings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Listing.countDocuments({ status: 'pending' });

    const listings = await Listing.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending listings',
      error: error.message,
    });
  }
};

// Get marketplace statistics
export const getListingStats = async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const soldListings = await Listing.countDocuments({ status: 'sold' });

    // Get listings by type
    const listingsByType = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get listings by location
    const listingsByLocation = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get average price by type
    const avgPriceByType = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$type', avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalListings,
        activeListings,
        pendingListings,
        soldListings,
        listingsByType,
        listingsByLocation,
        avgPriceByType,
      },
    });
  } catch (error) {
    console.error('Error fetching listing statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing statistics',
      error: error.message,
    });
  }
};

// Record inquiry
export const recordInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { inquiries: 1 } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry recorded',
      data: listing,
    });
  } catch (error) {
    console.error('Error recording inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record inquiry',
      error: error.message,
    });
  }
};
