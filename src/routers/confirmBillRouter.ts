import { Router } from 'express';

import { confirmBill } from '../controllers/confirmBillController';

const confirmBillRouter = Router();
confirmBillRouter.patch('/confirm', confirmBill.confirmReading);

export { confirmBillRouter };