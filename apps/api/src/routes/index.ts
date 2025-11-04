import { Router } from 'express';

import healthRoutes from './health.route';

const router = Router();

// Basic health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Enhanced health routes with validation demos
router.use('/health', healthRoutes);

// API Routes

export default router;
