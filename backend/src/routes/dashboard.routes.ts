import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticate, requireApprovedStatus } from '../middleware/auth';

const router = Router();

// Dashboard route requires authentication and approved status
router.get('/', authenticate, requireApprovedStatus, dashboardController.getDashboard);

export default router;
