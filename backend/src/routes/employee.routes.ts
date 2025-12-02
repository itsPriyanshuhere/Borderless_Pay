import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import blockchainService from '../services/blockchain.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Add employee
router.post('/', async (req: Request, res: Response) => {
    try {
        const { wallet, salary } = req.body;

        // Validation
        if (!wallet || !salary) {
            return res.status(400).json({ error: 'Missing required fields: wallet, salary' });
        }

        const result = await blockchainService.addEmployee(wallet, salary);

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

// Get all employees
router.get('/', async (req: Request, res: Response) => {
    try {
        const employees = await blockchainService.getAllEmployees();
        res.json({ success: true, employees });
    } catch (error: any) {
        console.error('Error fetching employees list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get employee details
router.get('/:address', async (req: Request, res: Response) => {
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
router.delete('/:address', async (req: Request, res: Response) => {
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
