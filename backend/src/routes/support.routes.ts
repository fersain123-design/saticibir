import { Router } from 'express';
import * as supportController from '../controllers/supportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All support routes require authentication
router.use(authenticate);

router.post('/', supportController.createTicket);
router.get('/', supportController.getTickets);
router.get('/:id', supportController.getTicket);

export default router;
