import { Router } from 'express';

import { confirmBill } from '../controllers/confirmBillController';

const confirmBillRouter = Router();
confirmBillRouter.patch('/', confirmBill.confirmReading);

export { confirmBillRouter };