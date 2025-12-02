import { Router, Request, Response } from 'express';
import blockchainService from '../services/blockchain.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const history = await blockchainService.getTransactionHistory();

        res.json({
            success: true,
            transactions: history,
        });
    } catch (error: any) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
