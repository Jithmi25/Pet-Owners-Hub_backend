import Clinic from '../Models/clinic.js';
import { sampleClinics } from './sampleClinics.js';

export const seedClinics = async () => {
  try {
    // Check if clinics already exist
    const clinicCount = await Clinic.countDocuments();
    
    if (clinicCount > 0) {
      console.log('✅ Clinics already exist in database');
      return;
    }

    // Insert sample clinics
    await Clinic.insertMany(sampleClinics);
    console.log(`✅ ${sampleClinics.length} clinics seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding clinics:', error.message);
  }
};
