import { Request, Response } from 'express';
import invoiceService from '../services/invoice.service';

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const { employeeWallet, amount, description } = req.body;

        if (!employeeWallet || !amount || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const invoice = await invoiceService.createInvoice({
            employeeWallet,
            amount,
            description
        });

        res.status(201).json({ success: true, invoice });
    } catch (error: any) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const { wallet, status } = req.query;
        const invoices = await invoiceService.getInvoices({
            wallet: wallet as string,
            status: status as string
        });
        res.json({ success: true, invoices });
    } catch (error: any) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, txHash } = req.body;

        if (!['paid', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const invoice = await invoiceService.updateInvoiceStatus(id, status, txHash);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json({ success: true, invoice });
    } catch (error: any) {
        console.error('Update invoice error:', error);
        res.status(500).json({ error: error.message });
    }
};
