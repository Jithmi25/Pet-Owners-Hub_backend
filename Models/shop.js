import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
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
    hours: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      enum: ['food', 'toys', 'grooming', 'supplies'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
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
      since: {
        type: Number,
        default: null,
      },
      photo: {
        type: String,
        default: null,
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
    socialMedia: {
      facebook: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      whatsapp: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
