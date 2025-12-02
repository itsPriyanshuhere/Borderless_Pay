import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import blockchainService from '../services/blockchain.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Fund payroll contract
router.post('/fund', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const result = await blockchainService.fundPayroll(amount);

        res.json({
            success: true,
            message: 'Payroll funded successfully',
            txHash: result.txHash,
        });
    } catch (error: any) {
        console.error('Error funding payroll:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get payroll balance
router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
    try {
        const balance = await blockchainService.getBalance();

        res.json({
            success: true,
            balance,
        });
    } catch (error: any) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pay single employee
router.post('/execute/:address', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const result = await blockchainService.payEmployee(address);

        res.json({
            success: true,
            message: 'Employee paid successfully',
            txHash: result.txHash,
        });
    } catch (error: any) {
        console.error('Error paying employee:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pay all employees (batch payment)
router.post('/execute', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { employeeAddresses } = req.body;

        if (!Array.isArray(employeeAddresses) || employeeAddresses.length === 0) {
            return res.status(400).json({ error: 'Employee addresses array required' });
        }

        // Validate all addresses
        for (const addr of employeeAddresses) {
            if (!ethers.isAddress(addr)) {
                return res.status(400).json({ error: `Invalid address: ${addr}` });
            }
        }

        const result = await blockchainService.payAllEmployees(employeeAddresses);

        res.json({
            success: true,
            message: 'Batch payment executed successfully',
            txHash: result.txHash,
            employeeCount: employeeAddresses.length,
        });
    } catch (error: any) {
        console.error('Error executing batch payment:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
