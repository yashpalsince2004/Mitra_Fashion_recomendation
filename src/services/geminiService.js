import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildFashionPrompt } from "./promptBuilder";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateOutfitRecommendations(occasion, stylePreferences, imageBase64 = null) {
  if (!API_KEY) {
      console.warn("VITE_GEMINI_API_KEY is not set. Returning mock data.");
      return getMockOutfits();
  }
  
  try {
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
     const prompt = buildFashionPrompt(occasion, stylePreferences);
     
     // Currently we skip processing imageBase64 into Gemini Vision in this version for simplicity,
     // but the setup allows for multimodal inputs.
     
     const result = await model.generateContent(prompt);
     const response = result.response.text();
     
     // Clean potential markdown blocks
     let cleanedJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
     return JSON.parse(cleanedJson);

  } catch(err) {
     console.error("Gemini Error:", err);
     return getMockOutfits();
  }
}

function getMockOutfits() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
              { id: 1, title: 'Midnight Velvet', desc: 'A deep navy double-breasted jacket paired with wide-leg trousers.', tags: ['Formal', 'Winter'], why_it_works: 'The structured fit elevates your profile.' },
              { id: 2, title: 'Silent Architecture', desc: 'Structured white silk blouse with an asymmetrical wrap skirt.', tags: ['Minimalist', 'Civic'], why_it_works: 'Embraces asymmetry to create visual interest.' },
              { id: 3, title: 'Urban Daze', desc: 'Oversized trench over a mock-neck knit and relaxed denim.', tags: ['Streetwear', 'Casual'], why_it_works: 'The layering provides warmth while maintaining aesthetic.' }
            ]);
        }, 2000);
    });
}
