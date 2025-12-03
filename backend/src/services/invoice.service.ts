import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(__dirname, '../../data/invoices.json');

export interface Invoice {
    id: string;
    employeeWallet: string;
    amount: string;
    description: string;
    status: 'pending' | 'paid' | 'rejected';
    createdAt: number;
    paidAt?: number;
    txHash?: string;
}

class InvoiceService {
    private async readData(): Promise<Invoice[]> {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, return empty array
            return [];
        }
    }

    private async writeData(invoices: Invoice[]): Promise<void> {
        await fs.writeFile(DATA_FILE, JSON.stringify(invoices, null, 2));
    }

    async createInvoice(data: Omit<Invoice, 'id' | 'status' | 'createdAt'>): Promise<Invoice> {
        const invoices = await this.readData();
        const newInvoice: Invoice = {
            id: uuidv4(),
            ...data,
            status: 'pending',
            createdAt: Date.now(),
        };
        invoices.push(newInvoice);
        await this.writeData(invoices);
        return newInvoice;
    }

    async getInvoices(filter?: { wallet?: string; status?: string }): Promise<Invoice[]> {
        let invoices = await this.readData();

        if (filter?.wallet) {
            invoices = invoices.filter(inv => inv.employeeWallet.toLowerCase() === filter.wallet!.toLowerCase());
        }

        if (filter?.status) {
            invoices = invoices.filter(inv => inv.status === filter.status);
        }

        // Sort by newest first
        return invoices.sort((a, b) => b.createdAt - a.createdAt);
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        const invoices = await this.readData();
        return invoices.find(inv => inv.id === id) || null;
    }

    async updateInvoiceStatus(id: string, status: 'paid' | 'rejected', txHash?: string): Promise<Invoice | null> {
        const invoices = await this.readData();
        const index = invoices.findIndex(inv => inv.id === id);

        if (index === -1) return null;

        invoices[index].status = status;
        if (status === 'paid') {
            invoices[index].paidAt = Date.now();
            if (txHash) invoices[index].txHash = txHash;
        }

        await this.writeData(invoices);
        return invoices[index];
    }
}

export default new InvoiceService();
