import { Router, Request, Response } from 'express';
import blockchainService from '../services/blockchain.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get price for a specific token
router.get('/price/:symbol', async (req: Request, res: Response) => {
    try {
        const { symbol } = req.params;
        const price = await blockchainService.getLatestPrice(symbol.toUpperCase());

        res.json({
            success: true,
            symbol: symbol.toUpperCase(),
            price,
            unit: 'USD',
        });
    } catch (error: any) {
        console.error(`Error fetching price for ${req.params.symbol}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Get prices for all supported tokens
router.get('/prices', async (req: Request, res: Response) => {
    try {
        const symbols = ['BTC', 'ETH', 'XRP', 'SOL', 'QIE', 'XAUt', 'BNB'];
        const prices: Record<string, string> = {};

        for (const symbol of symbols) {
            try {
                prices[symbol] = await blockchainService.getLatestPrice(symbol);
            } catch (error) {
                prices[symbol] = 'N/A';
            }
        }

        res.json({
            success: true,
            prices,
        });
    } catch (error: any) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add new oracle feed (admin only)
router.post('/add', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { symbol, oracleAddress } = req.body;

        if (!symbol || !oracleAddress) {
            return res.status(400).json({ error: 'Symbol and oracle address required' });
        }

        const result = await blockchainService.addOracle(symbol.toUpperCase(), oracleAddress);

        res.json({
            success: true,
            message: 'Oracle added successfully',
            txHash: result.txHash,
        });
    } catch (error: any) {
        console.error('Error adding oracle:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
