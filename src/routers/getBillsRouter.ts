import { Router } from 'express';
import { getBills } from '../controllers/getBillController';

const getBillsRouter = Router();
getBillsRouter.get('/:CustomerCode/list', getBills.getBillsByCustomerCode);

export { getBillsRouter };