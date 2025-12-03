import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';

const router = Router();

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.put('/:id/status', invoiceController.updateInvoiceStatus);

export default router;
