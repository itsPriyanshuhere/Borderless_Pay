import { Router } from 'express';
import transferController from '../controllers/transfer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/native', transferController.transferNative);

// Public routes (read-only)
router.get('/balance/:address/:chain', transferController.getBalance);
router.get('/networks', transferController.getNetworks);

export default router;
