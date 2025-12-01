import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, requireApprovedStatus } from '../middleware/auth';
import { orderStatusValidation } from '../utils/validators';

const router = Router();

// All order routes require authentication and approved status
router.use(authenticate, requireApprovedStatus);

router.get('/stats', orderController.getOrderStats);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', orderStatusValidation, orderController.updateOrderStatus);

export default router;
