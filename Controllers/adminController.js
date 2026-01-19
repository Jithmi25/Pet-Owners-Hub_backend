import Clinic from '../Models/clinic.js';
import Listing from '../Models/listing.js';
import Shop from '../Models/shop.js';
import User from '../Models/user.js';

// Aggregate high-level metrics for the admin dashboard
export const getDashboardStats = async (_req, res) => {
  try {
    const [
      totalUsers,
      totalPets,
      totalClinics,
      totalShops,
      pendingListings,
      pendingShops,
      recentUsers,
      recentListings,
      recentShops,
      recentClinics,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Clinic.countDocuments({ isActive: true }),
      Shop.countDocuments({ status: 'approved' }),
      Listing.countDocuments({ status: 'pending' }),
      Shop.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Listing.find().sort({ createdAt: -1 }).limit(5).select('name type status createdAt'),
      Shop.find().sort({ createdAt: -1 }).limit(5).select('name status location createdAt'),
      Clinic.find().sort({ createdAt: -1 }).limit(5).select('name location type createdAt'),
    ]);

    const recentActivity = [
      ...recentUsers.map((user) => ({
        type: 'user',
        title: `New user registered: ${user.name}`,
        meta: user.email,
        createdAt: user.createdAt,
      })),
      ...recentListings.map((listing) => ({
        type: 'listing',
        title: `Listing ${listing.status}: ${listing.name}`,
        meta: listing.type,
        createdAt: listing.createdAt,
      })),
      ...recentShops.map((shop) => ({
        type: 'shop',
        title: `Shop ${shop.status}: ${shop.name}`,
        meta: shop.location,
        createdAt: shop.createdAt,
      })),
      ...recentClinics.map((clinic) => ({
        type: 'clinic',
        title: `Clinic added: ${clinic.name}`,
        meta: clinic.location,
        createdAt: clinic.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          totalUsers,
          totalPets,
          totalClinics,
          totalShops,
        },
        pending: {
          pendingListings,
          pendingShops,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};
