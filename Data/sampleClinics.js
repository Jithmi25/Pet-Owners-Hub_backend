// Sample clinic data for seeding the database
// This can be used to populate initial clinic records

export const sampleClinics = [
  {
    name: 'Peradeniya Veterinary Teaching Hospital',
    type: 'government',
    location: 'kandy',
    address: 'Faculty of Veterinary Medicine, Peradeniya',
    phone: '081 238 7654',
    email: 'pera.vet@gov.lk',
    coordinates: {
      latitude: 7.2575,
      longitude: 80.5957,
    },
    hours: {
      weekday: {
        open: '08:00',
        close: '16:00',
      },
      weekend: {
        open: '08:00',
        close: '12:00',
      },
      emergency: true,
    },
    services: [
      {
        name: 'Vaccinations',
        description: 'Rabies, DHPP, and other essential vaccines',
        fee: 0,
      },
      {
        name: 'Surgery',
        description: 'Sterilization and emergency surgeries',
        fee: 500,
      },
      {
        name: 'Consultation',
        description: 'General health checkups',
        fee: 200,
      },
      {
        name: 'Dental',
        description: 'Dental cleaning and procedures',
        fee: 1000,
      },
      {
        name: 'Emergency Care',
        description: '24/7 emergency services',
        fee: 1500,
      },
    ],
    fees: {
      consultation: 200,
      minimumCharge: 500,
    },
    description:
      'Primary government veterinary hospital with subsidized services including rabies vaccination and sterilization programs.',
    rating: {
      average: 4.5,
      count: 42,
    },
    availability: [
      { dayOfWeek: 0, startTime: '08:00', endTime: '12:00', isAvailable: true }, // Sunday
      { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true }, // Monday
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00', isAvailable: true }, // Saturday
    ],
  },
  {
    name: 'PetVet Animal Hospital',
    type: 'private',
    location: 'colombo',
    address: 'Colombo 05, Sri Lanka',
    phone: '011 345 6789',
    email: 'info@petvet.lk',
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612,
    },
    hours: {
      weekday: {
        open: '08:00',
        close: '20:00',
      },
      weekend: {
        open: '09:00',
        close: '18:00',
      },
      emergency: true,
    },
    services: [
      {
        name: 'Grooming',
        description: 'Professional grooming services',
        fee: 1500,
      },
      {
        name: 'Boarding',
        description: 'Pet boarding facility',
        fee: 2000,
      },
      {
        name: 'Ultrasound',
        description: 'Ultrasound diagnostics',
        fee: 3000,
      },
      {
        name: 'Surgery',
        description: 'Advanced surgical procedures',
        fee: 5000,
      },
      {
        name: 'Vaccination',
        description: 'All types of vaccinations',
        fee: 800,
      },
    ],
    fees: {
      consultation: 500,
      minimumCharge: 1000,
    },
    description:
      'Full-service private veterinary hospital offering advanced diagnostics, surgery, and grooming services.',
    rating: {
      average: 4.7,
      count: 85,
    },
    availability: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 1, startTime: '08:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '18:00', isAvailable: true },
    ],
  },
  {
    name: 'National Veterinary Hospital',
    type: 'government',
    location: 'colombo',
    address: 'Colombo 07, Sri Lanka',
    phone: '011 234 5678',
    email: 'national.vet@gov.lk',
    coordinates: {
      latitude: 6.9022,
      longitude: 79.8607,
    },
    hours: {
      weekday: {
        open: '08:00',
        close: '18:00',
      },
      weekend: {
        open: '08:00',
        close: '14:00',
      },
      emergency: false,
    },
    services: [
      {
        name: 'Vaccinations',
        description: 'Rabies and other vaccines',
        fee: 0,
      },
      {
        name: 'Diagnostics',
        description: 'Laboratory and imaging services',
        fee: 500,
      },
      {
        name: 'Livestock Care',
        description: 'Specialized livestock treatment',
        fee: 1000,
      },
      {
        name: 'Emergency Care',
        description: 'Emergency surgical and medical care',
        fee: 1000,
      },
    ],
    fees: {
      consultation: 300,
      minimumCharge: 500,
    },
    description:
      'Government veterinary hospital providing affordable care for pets and livestock with specialized departments.',
    rating: {
      average: 4.3,
      count: 62,
    },
    availability: [
      { dayOfWeek: 0, startTime: '08:00', endTime: '14:00', isAvailable: true },
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '14:00', isAvailable: true },
    ],
  },
  {
    name: 'Paws & Claws Veterinary Center',
    type: 'private',
    location: 'galle',
    address: 'Galle, Sri Lanka',
    phone: '091 223 4567',
    email: 'info@pawsandclaws.lk',
    coordinates: {
      latitude: 6.0535,
      longitude: 80.22,
    },
    hours: {
      weekday: {
        open: '09:00',
        close: '19:00',
      },
      weekend: {
        open: '10:00',
        close: '17:00',
      },
      emergency: true,
    },
    services: [
      {
        name: 'Emergency Care',
        description: '24/7 emergency surgical services',
        fee: 2000,
      },
      {
        name: 'Surgery',
        description: 'Advanced surgical procedures',
        fee: 5000,
      },
      {
        name: 'Dental',
        description: 'Dental cleaning and surgery',
        fee: 1500,
      },
      {
        name: 'Grooming',
        description: 'Professional grooming',
        fee: 1200,
      },
    ],
    fees: {
      consultation: 600,
      minimumCharge: 1200,
    },
    description:
      'Modern veterinary center offering comprehensive care including specialized surgeries and 24/7 emergency services.',
    rating: {
      average: 4.6,
      count: 73,
    },
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isAvailable: true },
    ],
  },
  {
    name: 'Anuradhapura Veterinary Hospital',
    type: 'government',
    location: 'anuradhapura',
    address: 'Anuradhapura, Sri Lanka',
    phone: '025 222 3456',
    email: 'anura.vet@gov.lk',
    coordinates: {
      latitude: 8.3114,
      longitude: 80.4037,
    },
    hours: {
      weekday: {
        open: '08:30',
        close: '16:30',
      },
      weekend: {
        open: '09:00',
        close: '13:00',
      },
      emergency: false,
    },
    services: [
      {
        name: 'Vaccinations',
        description: 'All essential vaccines',
        fee: 0,
      },
      {
        name: 'Livestock Care',
        description: 'Specialized livestock services',
        fee: 800,
      },
      {
        name: 'Basic Surgery',
        description: 'Basic surgical procedures',
        fee: 1000,
      },
      {
        name: 'Consultation',
        description: 'General veterinary consultation',
        fee: 250,
      },
    ],
    fees: {
      consultation: 250,
      minimumCharge: 500,
    },
    description:
      'Government veterinary hospital serving the North Central Province with focus on both companion animals and livestock.',
    rating: {
      average: 4.2,
      count: 38,
    },
    availability: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '13:00', isAvailable: true },
      { dayOfWeek: 1, startTime: '08:30', endTime: '16:30', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:30', endTime: '16:30', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:30', endTime: '16:30', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:30', endTime: '16:30', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:30', endTime: '16:30', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true },
    ],
  },
];
