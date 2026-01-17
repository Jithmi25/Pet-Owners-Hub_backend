import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'other'],
      required: true,
      index: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', ''],
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      enum: [
        'colombo',
        'kandy',
        'galle',
        'gampaha',
        'kalutara',
        'matara',
        'kurunegala',
        'kegalle',
        'ratnapura',
        'jaffna',
        'batticaloa',
        'anuradhapura',
        'badulla',
      ],
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    health: {
      vaccinated: {
        type: Boolean,
        default: false,
      },
      dewormed: {
        type: Boolean,
        default: false,
      },
      neutered: {
        type: Boolean,
        default: false,
      },
      notes: {
        type: String,
        default: null,
      },
    },
    seller: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'sold', 'removed'],
      default: 'pending',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
