import { Request, Response } from 'express';
import { uploadService } from '../services/uploadBillService';

export const uploadBill = {
  async uploadReading(req: Request, res: Response) {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body;

      // Validate request data
      if (!image || !customer_code || !measure_datetime || !['WATER', 'GAS'].includes(measure_type)) {
        return res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisição são inválidos",
        });
      }

      const result = await uploadService.processUpload({ image, customer_code, measure_datetime, measure_type });

      res.status(200).json(result);
    } catch (error) {
      // Type guard to check if error has a 'code' property
      if (error instanceof Error && 'code' in error) {
        const typedError = error as { code: string };

        if (typedError.code === 'DOUBLE_REPORT') {
          return res.status(409).json({
            error_code: "DOUBLE_REPORT",
            error_description: "Leitura do mês já realizada",
          });
        }
      }
    }
  },
};
