import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticate, requireApprovedStatus } from '../middleware/auth';
import { productValidation } from '../utils/validators';
import { upload } from '../middleware/upload';

const router = Router();

// All product routes require authentication and approved status
router.use(authenticate, requireApprovedStatus);

router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productValidation, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/toggle-status', productController.toggleProductStatus);

export default router;
