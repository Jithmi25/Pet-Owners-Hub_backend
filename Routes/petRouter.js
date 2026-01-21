import express from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  deletePetPermanent,
  updatePetStatus,
  getPetStatistics,
  bulkDeletePets,
  restorePet,
} from '../Controllers/petController.js';

const router = express.Router();

// Statistics route - must come before /:id route
router.get('/stats', getPetStatistics);

// Main CRUD routes
router.route('/')
  .get(getAllPets)      // GET /api/admin/pets - Get all pets with filters
  .post(createPet);     // POST /api/admin/pets - Create new pet

// Bulk operations
router.post('/bulk-delete', bulkDeletePets);  // POST /api/admin/pets/bulk-delete

// Single pet operations
router.route('/:id')
  .get(getPetById)      // GET /api/admin/pets/:id - Get single pet
  .put(updatePet)       // PUT /api/admin/pets/:id - Update pet
  .delete(deletePet);   // DELETE /api/admin/pets/:id - Soft delete pet

// Special operations
router.delete('/:id/permanent', deletePetPermanent);  // DELETE /api/admin/pets/:id/permanent
router.patch('/:id/status', updatePetStatus);         // PATCH /api/admin/pets/:id/status
router.patch('/:id/restore', restorePet);             // PATCH /api/admin/pets/:id/restore

export default router;
