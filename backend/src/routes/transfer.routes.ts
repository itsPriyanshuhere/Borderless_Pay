import { Router } from 'express';
import transferController from '../controllers/transfer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.post('/native', authenticate, transferController.transferNative);

// Public routes (read-only)
router.get('/balance/:address/:chain', transferController.getBalance);
router.get('/networks', transferController.getNetworks);

export default router;
