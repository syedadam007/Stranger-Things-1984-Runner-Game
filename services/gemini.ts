
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDeathMessage(score: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, chilling 1980s horror arcade death message for a "Stranger Things" themed game. 
      The player died in the Upside Down. Score: ${score}. 
      Reference things like: Hawkins, Demogorgons, The Mind Flayer, vines, the void, or "Friends don't lie."
      Keep it under 12 words. Cryptic and digital.`,
      config: {
        temperature: 1.0,
      }
    });
    return response.text?.trim() || "THE UPSIDE DOWN HAS YOU NOW.";
  } catch (error) {
    console.error("Gemini failed:", error);
    return "STAY IN THE LIGHT. FRIENDS DON'T LIE.";
  }
}
