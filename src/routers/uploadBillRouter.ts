import { Router } from 'express';

import { uploadBill } from '../controllers/uploadBillController';

const uploadBillRouter = Router();

uploadBillRouter.post('/upload', uploadBill.uploadReading);

export { uploadBillRouter };