import express from 'express';

const router = express.Router();

// Stateless logout endpoint for frontend integration
router.post('/logout', (_req, res) => {
  // If you later store auth tokens in cookies, clear them here
  return res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
