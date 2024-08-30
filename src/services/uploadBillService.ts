import { billRepository } from '../repositories/billRepository';
import { queryGeminiAPI } from '../integrations/geminiAPI';
import { v4 as uuidv4 } from 'uuid';

class CustomError extends Error {
  code: string | undefined;
}

interface UploadData {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
}

export const uploadService = {
  async processUpload(data: UploadData) {
    const { image, customer_code, measure_datetime, measure_type } = data;

    try {
      // Check for existing readings in the current month
      const existingReading = await billRepository.findExistingReading(customer_code, measure_datetime, measure_type);
      if (existingReading) {
        const error = new CustomError('Leitura do mês já realizada');
        error.code = 'DOUBLE_REPORT';
        throw error;
      }

      // Query Gemini API for the reading value
      const measuredValue = await queryGeminiAPI(image) ?? 0;
      
      // Save reading to database
      const newReading = await billRepository.saveBill({
        customer_code,
        measure_datetime,
        measure_type,
        measure_value: measuredValue,
        image_url: "imageUrl", // Ensure to replace with actual URL if applicable
        measure_uuid: uuidv4(),
        has_confirmed: false, // or true, depending on your logic
      });

      return {
        image_url: newReading.image_url,
        measure_value: newReading.measure_value,
        measure_uuid: newReading.measure_uuid,
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new Error('Erro ao processar o upload');
    }
  },
};


