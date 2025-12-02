import { Router, Request, Response } from 'express';
import { generateToken, verifySignature } from '../middleware/auth.middleware';
import blockchainService from '../services/blockchain.service';

const router = Router();

// Wallet-based authentication
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { address, message, signature } = req.body;

        if (!address || !message || !signature) {
            return res.status(400).json({ error: 'Address, message, and signature required' });
        }

        // Verify signature
        const isValid = verifySignature(message, signature, address);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Generate JWT token
        const token = generateToken(address);

        res.json({
            success: true,
            token,
            address,
        });
    } catch (error: any) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get network info
router.get('/network', async (req: Request, res: Response) => {
    try {
        const networkInfo = await blockchainService.getNetworkInfo();
        const blockNumber = await blockchainService.getBlockNumber();

        res.json({
            success: true,
            network: networkInfo,
            blockNumber,
        });
    } catch (error: any) {
        console.error('Error fetching network info:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
