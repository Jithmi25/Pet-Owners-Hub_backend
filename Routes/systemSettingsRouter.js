import express from 'express';
import {
  getSystemSettings,
  updateGeneralSettings,
  updateRegionalSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateAppearanceSettings,
  updateBackupSettings,
  clearSystemCache,
  resetSettingsToDefault,
  deleteAllData,
  getSettingSection,
} from '../Controllers/systemSettingsController.js';
// import { authenticate, requireAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and admin role check to all routes
// Uncomment these middleware when authentication is ready
// router.use(authenticate);
// router.use(requireAdmin);

// Get all system settings
router.get('/', getSystemSettings);

// Get specific setting section
router.get('/section/:section', getSettingSection);

// Update specific settings
router.put('/general', updateGeneralSettings);
router.put('/regional', updateRegionalSettings);
router.put('/notifications', updateNotificationSettings);
router.put('/security', updateSecuritySettings);
router.put('/appearance', updateAppearanceSettings);
router.put('/backup', updateBackupSettings);

// Dangerous operations
router.post('/clear-cache', clearSystemCache);
router.post('/reset-to-default', resetSettingsToDefault);
router.post('/delete-all-data', deleteAllData);

export default router;
