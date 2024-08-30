import { Request, Response } from 'express';
import { confirmBillService } from '../services/confirmBillService';

export const confirmBill = {
  async confirmReading(req: Request, res: Response) {
    try {
      const { customer_code, measure_datetime, measure_type } = req.body;

      // Validate request data
      if (!customer_code || !measure_datetime || !['WATER', 'GAS'].includes(measure_type)) {
        return res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisição são inválidos",
        });
      }

      const result = await confirmBillService.confirmBill({ customer_code, measure_datetime, measure_type });

      res.status(200).json(result);
    } catch (error) {
      // Type guard to check if error has a 'code' property
      if (error instanceof Error && 'code' in error) {
        const typedError = error as { code: string };

        if (typedError.code === 'NO_REPORT') {
          return res.status(404).json({
            error_code: "NO_REPORT",
            error_description: "Leitura do mês não encontrada",
          });
        }
      }
      return error;
    }
  },
};  