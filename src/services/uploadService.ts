import { uploadRepository } from '../repositories/uploadRepository';
import { queryGeminiAPI } from '../integrations/geminiAPI';
import { v4 as uuidv4 } from 'uuid';

class CustomError extends Error {
  code: string | undefined;
}

export const uploadService = {
  async processUpload(data: { image: string, customer_code: string, measure_datetime: Date, measure_type: string }) {
    const { image, customer_code, measure_datetime, measure_type } = data;

    // Check for existing readings in the current month
    const existingReading = await uploadRepository.findExistingReading(customer_code, measure_datetime, measure_type);
    if (existingReading) {
      const error = new CustomError('Leitura do mês já realizada');
      error.code = 'DOUBLE_REPORT';
      throw error;
    }

    // Query Gemini API for the reading value
    const { imageUrl, measureValue } = await queryGeminiAPI(image);

    // Save reading to database
    const newReading = await uploadRepository.saveReading({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value: measureValue,
      image_url: imageUrl,
      measure_uuid: uuidv4(),
    });

    return {
      image_url: newReading.image_url,
      measure_value: newReading.measure_value,
      measure_uuid: newReading.measure_uuid,
    };
  },
};

