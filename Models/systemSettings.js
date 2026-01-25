import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    // General Settings
    general: {
      siteName: {
        type: String,
        default: 'Pet Owners Hub',
      },
      siteDescription: {
        type: String,
        default: 'Your one-stop solution for all pet care needs',
      },
      adminEmail: {
        type: String,
        default: 'admin@petownershub.com',
      },
      timezone: {
        type: String,
        default: 'UTC-5',
      },
    },

    // Regional Settings
    regional: {
      defaultLanguage: {
        type: String,
        enum: ['en', 'es', 'fr', 'de', 'si', 'ta'],
        default: 'en',
      },
      dateFormat: {
        type: String,
        enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
        default: 'DD/MM/YYYY',
      },
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'LKR', 'JPY'],
        default: 'LKR',
      },
      measurementUnits: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric',
      },
    },

    // Notification Settings
    notifications: {
      emailNotifications: {
        systemNotifications: {
          type: Boolean,
          default: true,
        },
        newUserRegistrations: {
          type: Boolean,
          default: true,
        },
        appointmentAlerts: {
          type: Boolean,
          default: true,
        },
        marketingEmails: {
          type: Boolean,
          default: false,
        },
      },
      preferences: {
        emailFrequency: {
          type: String,
          enum: ['immediate', 'hourly', 'daily', 'weekly'],
          default: 'hourly',
        },
        notificationSound: {
          type: String,
          enum: ['default', 'chime', 'ding', 'bell', 'none'],
          default: 'default',
        },
        browserNotifications: {
          type: String,
          enum: ['enabled', 'disabled'],
          default: 'enabled',
        },
        pushNotifications: {
          type: String,
          enum: ['enabled', 'disabled'],
          default: 'disabled',
        },
      },
    },

    // Security Settings
    security: {
      authentication: {
        twoFactorAuth: {
          type: Boolean,
          default: false,
        },
        passwordExpiration: {
          type: Boolean,
          default: true,
        },
        sessionTimeout: {
          type: Number,
          default: 60, // in minutes
        },
        maxLoginAttempts: {
          type: String,
          enum: ['3', '5', '10', 'unlimited'],
          default: '5',
        },
      },
      policies: {
        ipWhitelisting: {
          type: Boolean,
          default: false,
        },
        allowedIPs: {
          type: [String],
          default: [],
        },
        httpsEnforcement: {
          type: Boolean,
          default: true,
        },
        apiRateLimiting: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Appearance Settings
    appearance: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light',
      },
      primaryColor: {
        type: String,
        default: '#007bff',
      },
      secondaryColor: {
        type: String,
        default: '#6c757d',
      },
      logoUrl: {
        type: String,
        default: '',
      },
      faviconUrl: {
        type: String,
        default: '',
      },
    },

    // Backup & Restore Settings
    backup: {
      autoBackupEnabled: {
        type: Boolean,
        default: true,
      },
      backupFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
      },
      backupRetentionDays: {
        type: Number,
        default: 30,
      },
      lastBackupDate: {
        type: Date,
        default: null,
      },
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { collection: 'systemSettings' }
);

export default mongoose.model('SystemSettings', systemSettingsSchema);
