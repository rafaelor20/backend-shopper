import { Router } from 'express';

import { uploadBill } from '../controllers/uploadBill';

const uploadBillRouter = Router();

uploadBillRouter.post('/upload', uploadBill.uploadReading);

export { uploadBillRouter };