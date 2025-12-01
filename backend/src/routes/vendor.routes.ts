import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All vendor routes require authentication
router.use(authenticate);

router.get('/profile', vendorController.getProfile);
router.put('/profile', vendorController.updateProfile);
router.put('/working-hours', vendorController.updateWorkingHours);

router.get('/documents', vendorController.getDocuments);
router.post('/documents/upload', upload.single('document'), vendorController.uploadDocument);

export default router;
