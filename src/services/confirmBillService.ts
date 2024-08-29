import { billRepository } from '../repositories/billRepository';

class CustomError extends Error {
    code: string | undefined;
  }

export const confirmBillService = {
    async confirmBill(data: { customer_code: string, measure_datetime: Date, measure_type: string }) {
        const { customer_code, measure_datetime, measure_type } = data;

        // Check for existing readings in the current month
        const existingReading = await billRepository.findExistingReading(customer_code, measure_datetime, measure_type);
        if (!existingReading) {
            const error = new CustomError('Leitura do mês não encontrada');
            error.code = 'NO_REPORT';
            throw error;
        }

        return {
            image_url: existingReading.image_url,
            measure_value: existingReading.measure_value,
            measure_uuid: existingReading.measure_uuid,
        };
    }
};