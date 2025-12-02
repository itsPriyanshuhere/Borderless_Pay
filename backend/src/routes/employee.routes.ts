import { Router, Request, Response } from 'express';
import blockchainService from '../services/blockchain.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Add employee
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { wallet, token, symbol, salaryUSD } = req.body;

        // Validation
        if (!wallet || !token || !symbol || !salaryUSD) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!ethers.isAddress(wallet) || !ethers.isAddress(token)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const result = await blockchainService.addEmployee(wallet, token, symbol, salaryUSD);

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            txHash: result.txHash,
        });
    } catch (error: any) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get employee details
router.get('/:address', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const employee = await blockchainService.getEmployee(address);

        res.json({
            success: true,
            employee,
        });
    } catch (error: any) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: error.message });
    }
});

// Remove employee
router.delete('/:address', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const result = await blockchainService.removeEmployee(address);

        res.json({
            success: true,
            message: 'Employee removed successfully',
            txHash: result.txHash,
        });
    } catch (error: any) {
        console.error('Error removing employee:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
