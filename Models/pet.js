import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'other'],
      required: [true, 'Pet type is required'],
      lowercase: true,
      index: true,
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['colombo', 'kandy', 'galle', 'jaffna', 'anuradhapura', 'gampaha', 'matara', 'kurunegala'],
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
      lowercase: true,
      index: true,
    },
    owner: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    ownerContact: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://placehold.co/50x50?text=Pet',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    // Health information
    vaccinated: {
      type: Boolean,
      default: false,
    },
    dewormed: {
      type: Boolean,
      default: false,
    },
    // Metadata
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for better query performance
petSchema.index({ type: 1, status: 1 });
petSchema.index({ location: 1, status: 1 });
petSchema.index({ price: 1 });
petSchema.index({ createdAt: -1 });

// Virtual for formatted price
petSchema.virtual('formattedPrice').get(function () {
  return `Rs. ${this.price.toLocaleString()}`;
});

// Instance method to mark as sold
petSchema.methods.markAsSold = function () {
  this.status = 'sold';
  return this.save();
};

// Instance method to mark as available
petSchema.methods.markAsAvailable = function () {
  this.status = 'available';
  return this.save();
};

// Static method to get pets by status
petSchema.statics.findByStatus = function (status) {
  return this.find({ status, isActive: true });
};

// Static method to get pets by location
petSchema.statics.findByLocation = function (location) {
  return this.find({ location: location.toLowerCase(), isActive: true });
};

// Static method to get statistics
petSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalPets: { $sum: 1 },
        availablePets: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
        },
        soldPets: {
          $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] },
        },
        totalValue: { $sum: '$price' },
        averagePrice: { $avg: '$price' },
      },
    },
  ]);

  return stats[0] || {
    totalPets: 0,
    availablePets: 0,
    soldPets: 0,
    totalValue: 0,
    averagePrice: 0,
  };
};

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
