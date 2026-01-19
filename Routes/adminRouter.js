import express from 'express';
import { getDashboardStats } from '../Controllers/adminController.js';

const router = express.Router();

router.get('/dashboard-stats', getDashboardStats);

export default router;
