
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction } from "../types";

const API_KEY = process.env.API_KEY;

export const getFinancialAdvice = async (
  userMessage: string, 
  history: { role: 'user' | 'model', text: string }[],
  currentData: { balance: number, recentTransactions: Transaction[] }
) => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const txSummary = currentData.recentTransactions
    .slice(0, 5)
    .map(t => `${t.description}: ${t.amount} (${t.category})`)
    .join(', ');

  const systemInstruction = `
    You are Nova, an expert financial advisor for NovaBank customers. 
    Current User Info:
    - Balance: $${currentData.balance.toFixed(2)}
    - Recent Transactions: ${txSummary}

    Goal: Provide helpful, professional, and concise financial advice.
    Help with budgeting, saving, and explaining trends based on their ACTUAL data above.
    Be encouraging but maintain a professional banking tone.
    Do NOT ask for account numbers, passwords, or PINs.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
