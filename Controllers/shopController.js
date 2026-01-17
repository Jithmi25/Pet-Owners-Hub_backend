import Shop from '../Models/shop.js';

// Get all shops (with optional filters)
export const getAllShops = async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;

    let filter = { status: 'approved' };

    // Apply search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
      ];
    }

    // Apply category filter
    if (category && category !== '') {
      filter.categories = category;
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
    const totalCount = await Shop.countDocuments(filter);

    // Get shops with pagination
    const shops = await Shop.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: shops,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shops',
      error: error.message,
    });
  }
};

// Get single shop by ID
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop',
      error: error.message,
    });
  }
};

// Create new shop
export const createShop = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      phone,
      email,
      hours,
      categories,
      description,
      services,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerSince,
      facebook,
      instagram,
      whatsapp,
      twitter,
    } = req.body;

    // Validate required fields
    if (!name || !location || !address || !phone || !email || !hours || !categories || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if shop with same email already exists
    const existingShop = await Shop.findOne({ email: email.toLowerCase() });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'Shop with this email already exists',
      });
    }

    const newShop = new Shop({
      name,
      location: location.toLowerCase(),
      address,
      phone,
      email: email.toLowerCase(),
      hours,
      categories: Array.isArray(categories) ? categories : [categories],
      description,
      services: services ? services.split('\n').filter((s) => s.trim()) : [],
      owner: {
        name: ownerName,
        email: ownerEmail.toLowerCase(),
        phone: ownerPhone,
        since: ownerSince ? parseInt(ownerSince) : null,
      },
      socialMedia: {
        facebook: facebook || null,
        instagram: instagram || null,
        whatsapp: whatsapp || null,
        twitter: twitter || null,
      },
      status: 'pending', // Shops need approval
    });

    await newShop.save();

    res.status(201).json({
      success: true,
      message: 'Shop submitted successfully. It will be reviewed shortly.',
      data: newShop,
    });
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shop',
      error: error.message,
    });
  }
};

// Update shop (admin only)
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent direct status updates except through approval endpoints
    if (updateData.status && updateData.status !== 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Cannot directly update status. Use approval endpoints.',
      });
    }

    const updatedShop = await Shop.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedShop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop,
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shop',
      error: error.message,
    });
  }
};

// Delete shop (admin only)
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully',
      data: deletedShop,
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shop',
      error: error.message,
    });
  }
};

// Approve shop (admin only)
export const approveShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByIdAndUpdate(
      id,
      { status: 'approved', updatedAt: Date.now() },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop approved successfully',
      data: shop,
    });
  } catch (error) {
    console.error('Error approving shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve shop',
      error: error.message,
    });
  }
};

// Reject shop (admin only)
export const rejectShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      id,
      { status: 'rejected', updatedAt: Date.now() },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop rejected successfully',
      data: shop,
    });
  } catch (error) {
    console.error('Error rejecting shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject shop',
      error: error.message,
    });
  }
};

// Get pending shops (admin only)
export const getPendingShops = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Shop.countDocuments({ status: 'pending' });

    const shops = await Shop.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: shops,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching pending shops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending shops',
      error: error.message,
    });
  }
};

// Get shop statistics
export const getShopStats = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments();
    const approvedShops = await Shop.countDocuments({ status: 'approved' });
    const pendingShops = await Shop.countDocuments({ status: 'pending' });
    const rejectedShops = await Shop.countDocuments({ status: 'rejected' });

    // Get shops by location
    const shopsByLocation = await Shop.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get shops by category
    const shopsByCategory = await Shop.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalShops,
        approvedShops,
        pendingShops,
        rejectedShops,
        shopsByLocation,
        shopsByCategory,
      },
    });
  } catch (error) {
    console.error('Error fetching shop statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop statistics',
      error: error.message,
    });
  }
};
