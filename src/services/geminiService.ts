import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan, MealAnalysis } from "../types";

// Declaração para evitar erro TS2580 (Cannot find name 'process')
declare const process: any;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o NutriAppBR AI, um nutricionista brasileiro experiente, amigável e motivador.
Responda sempre em Português do Brasil.
Seja empático, use emojis e motive o usuário.
Use terminologia nutricional correta mas acessível.
Se o usuário for vegano, JAMAIS sugira carne, ovos, leite ou mel.
`;

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `
    Crie um plano alimentar diário personalizado para esta pessoa:
    Idade: ${profile.age} anos
    Peso: ${profile.weight}kg
    Altura: ${profile.height}cm
    Sexo: ${profile.gender}
    Nível de Atividade: ${profile.activityLevel}
    Objetivo: ${profile.goal}
    Vegano: ${profile.isVegan ? 'Sim' : 'Não'}
    Calorias Alvo: ${Math.round(profile.dailyCaloriesTarget)} kcal

    O plano deve ter Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde e Jantar.
    Inclua 3 dicas motivacionais e práticas no final.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakfast: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            }
          },
          morningSnack: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            }
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            }
          },
          afternoonSnack: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            }
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("Falha ao gerar dieta");
  return JSON.parse(response.text) as DietPlan;
};

export const analyzeFoodImage = async (base64Image: string, isVegan: boolean): Promise<MealAnalysis> => {
  // Remove header if present
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        },
        {
          text: `Analise esta refeição. Identifique os alimentos, estime calorias totais e macronutrientes aproximados. 
          Dê uma nota de saúde de 0 a 10 (10 sendo extremamente saudável/equilibrado).
          Forneça um feedback curto e amigável (máximo 2 frases).
          ${isVegan ? 'Atenção: Verifique se a refeição parece vegana.' : ''}`
        }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING, description: "Nome curto do prato principal ou alimentos" },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER, description: "gramas" },
          carbs: { type: Type.NUMBER, description: "gramas" },
          fats: { type: Type.NUMBER, description: "gramas" },
          healthScore: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("Falha ao analisar imagem");
  
  const result = JSON.parse(response.text);
  
  return {
    ...result,
    timestamp: Date.now()
  };
};