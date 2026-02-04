import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const findBestLearningResources = async (query: string): Promise<SearchResult> => {
  const ai = getClient();
  
  // Using gemini-3-flash-preview for speed and efficiency with tools
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants to learn: "${query}". 
      
      Your Goal: Act as a world-class educational curator. You must identify the best websites, compare them, and rate them on a 10-star scale.

      Instructions:
      1. Search for the absolute best 3-5 specific pages or websites to learn this topic.
      2. For EACH recommendation, provide the following structured details in this exact order:
         
         ### [Website Name]
         **Rating:** [Generate visual stars, e.g. ★★★★★★★★☆☆] ([Number]/10)
         **What you will learn here:** [Be extremely specific. e.g., "This site will tell you how to do this type of food, but it specifically covers the sauce preparation in detail..."]
         **Why it's better:** [The "Verdict". Why pick this over others? e.g. "Best for beginners", "Most authoritative", "Best video content".]
         
      3. After the list, provide a brief summary of which one to start with based on the user's likely skill level.
      
      Tone: Expert, helpful, and explanatory.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No details provided.";
    
    // Extract grounding chunks if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      sources: chunks,
    };
  } catch (error) {
    console.error("Error fetching from Gemini:", error);
    throw error;
  }
};