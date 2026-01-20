import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['government', 'private'],
      required: true,
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
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    hours: {
      weekday: {
        open: String, // e.g., "08:00"
        close: String, // e.g., "18:00"
      },
      weekend: {
        open: String,
        close: String,
      },
      emergency: {
        type: Boolean,
        default: false,
      },
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
        fee: Number, // in LKR
      },
    ],
    fees: {
      consultation: {
        type: Number,
        required: true,
      },
      minimumCharge: Number,
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    description: String,
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending'],
      default: 'pending',
      index: true,
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          min: 0,
          max: 6, // 0 = Sunday, 6 = Saturday
        },
        startTime: String, // HH:MM format
        endTime: String, // HH:MM format
        isAvailable: Boolean,
      },
    ],
    bookedSlots: [
      {
        date: Date,
        time: String,
        petId: String,
        service: String,
        status: {
          type: String,
          enum: ['booked', 'completed', 'cancelled'],
          default: 'booked',
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient searching
clinicSchema.index({ name: 'text', address: 'text', services: 'text' });
clinicSchema.index({ location: 1, type: 1 });
clinicSchema.index({ isActive: 1, type: 1 });

export default mongoose.model('Clinic', clinicSchema);
