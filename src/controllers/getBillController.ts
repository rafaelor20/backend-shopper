import { Request, Response } from 'express';
import { billRepository } from '../repositories/billRepository';

export const getBills = {
    async getBillsByCustomerCode(req: Request, res: Response) {
        const { customer_code } = req.params;

        // Check for existing readings in the current month
        const bills = await billRepository.getBillsByCustomerCode(customer_code);
        if (!bills) {
            return res.status(404).json({ message: 'Nenhuma fatura encontrada' });
        }

        return res.status(200).json(bills);
    }
};