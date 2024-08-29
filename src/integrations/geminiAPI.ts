import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const queryGeminiAPI = async (image: string) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a reading from this image: ${image}`;

    const generatedContent = await model.generateContent(prompt);
    
    // Assuming the Gemini API returns these fields
    return {
      response: generatedContent.response,
    };
  } catch (error) {
    throw new Error('Erro ao consultar a API do Gemini');
  }
};
