import { GoogleGenerativeAI } from "@google/generative-ai";

function extractValue(text: string) {
  //return integer in measuredValue = 'integer'
  const regex = /measuredValue = '(\d+)'/;
  const match = RegExp(regex).exec(text);
  if (match) {
    return Number(match[1]);
  }
  return undefined;
}

export const queryGeminiAPI = async (image: string) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Read the water or energy consumed and return in the format measuredValue = 'integer': ${image}`;

    const generatedContent = await model.generateContent(prompt);
    
    const measuredValue = extractValue(generatedContent.response.text());
    // Assuming the Gemini API returns these fields

    return measuredValue;

  } catch (error) {
    throw new Error('Erro ao consultar a API do Gemini');
  }
};
