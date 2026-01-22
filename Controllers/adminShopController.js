import Shop from '../Models/shop.js';

// @desc    Get all shops with admin filters
// @route   GET /api/admin/shops
// @access  Admin
export const getAllShopsAdmin = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {};

    // Apply search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ];
    }

    // Apply type filter
    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    // Apply status filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Shop.countDocuments(query);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get shops with pagination
    const shops = await Shop.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

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
    console.error('Error fetching shops (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shops',
      error: error.message,
    });
  }
};

// @desc    Get single shop details (admin)
// @route   GET /api/admin/shops/:id
// @access  Admin
export const getShopDetailsAdmin = async (req, res) => {
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
    console.error('Error fetching shop details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop details',
      error: error.message,
    });
  }
};

// @desc    Add new shop (admin)
// @route   POST /api/admin/shops
// @access  Admin
export const addShopAdmin = async (req, res) => {
  try {
    const {
      name,
      type,
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
      status,
      facebook,
      instagram,
      whatsapp,
      twitter,
    } = req.body;

    // Validate required fields
    if (!name || !location || !address || !phone || !email || !hours) {
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
      type: type ? type.toLowerCase() : 'budget',
      location: location.toLowerCase(),
      address,
      phone,
      email: email.toLowerCase(),
      hours,
      categories: categories || [],
      description: description || '',
      services: services || [],
      owner: {
        name: ownerName || name,
        email: ownerEmail || email.toLowerCase(),
        phone: ownerPhone || phone,
        since: ownerSince ? parseInt(ownerSince) : null,
      },
      socialMedia: {
        facebook: facebook || null,
        instagram: instagram || null,
        whatsapp: whatsapp || null,
        twitter: twitter || null,
      },
      status: status || 'verified', // Admin can set status directly
    });

    await newShop.save();

    res.status(201).json({
      success: true,
      message: 'Shop added successfully',
      data: newShop,
    });
  } catch (error) {
    console.error('Error adding shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add shop',
      error: error.message,
    });
  }
};

// @desc    Update shop (admin)
// @route   PUT /api/admin/shops/:id
// @access  Admin
export const updateShopAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert certain fields to lowercase if present
    if (updateData.type) updateData.type = updateData.type.toLowerCase();
    if (updateData.location) updateData.location = updateData.location.toLowerCase();
    if (updateData.email) updateData.email = updateData.email.toLowerCase();
    if (updateData.status) updateData.status = updateData.status.toLowerCase();

    updateData.updatedAt = Date.now();

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

// @desc    Delete shop (admin)
// @route   DELETE /api/admin/shops/:id
// @access  Admin
export const deleteShopAdmin = async (req, res) => {
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

// @desc    Verify shop (admin)
// @route   PATCH /api/admin/shops/:id/verify
// @access  Admin
export const verifyShopAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByIdAndUpdate(
      id,
      { status: 'verified', updatedAt: Date.now() },
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
      message: 'Shop verified successfully',
      data: shop,
    });
  } catch (error) {
    console.error('Error verifying shop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify shop',
      error: error.message,
    });
  }
};

// @desc    Get shop statistics (admin)
// @route   GET /api/admin/shops/stats
// @access  Admin
export const getShopStats = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments();
    const verifiedShops = await Shop.countDocuments({ status: 'verified' });
    const pendingShops = await Shop.countDocuments({ status: 'pending' });
    const rejectedShops = await Shop.countDocuments({ status: 'rejected' });
    const premiumShops = await Shop.countDocuments({ type: 'premium' });
    const budgetShops = await Shop.countDocuments({ type: 'budget' });

    // Get shops by location
    const shopsByLocation = await Shop.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get shops by type and status
    const shopsByType = await Shop.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Get recent shops
    const recentShops = await Shop.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type status createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalShops,
        verifiedShops,
        pendingShops,
        rejectedShops,
        premiumShops,
        budgetShops,
        shopsByLocation,
        shopsByType,
        recentShops,
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
