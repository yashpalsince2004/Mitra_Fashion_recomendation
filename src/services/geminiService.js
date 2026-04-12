import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildFashionPrompt,
  buildVisionAnalysisPrompt,
  buildPersonalizedOutfitPrompt,
  buildChatSystemPrompt,
  buildRemixOutfitPrompt,
} from "./promptBuilder";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// ─── Analyze an uploaded image using Gemini Vision ────────────────────────────
export async function analyzeUserImage(base64Data, mimeType) {
  if (!API_KEY) return getMockAnalysis();
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imagePart = { inlineData: { data: base64Data, mimeType } };
    const result = await model.generateContent([buildVisionAnalysisPrompt(), imagePart]);
    const cleaned = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Vision Error:", err);
    return getMockAnalysis();
  }
}

// ─── Create a persistent Gemini chat session ──────────────────────────────────
export function createStylistChatSession(analysis, quizProfile) {
  if (!API_KEY) return null; // Will use mock mode

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const systemContext = buildChatSystemPrompt(analysis, quizProfile);

  return model.startChat({
    history: [
      { role: "user", parts: [{ text: systemContext }] },
      {
        role: "model",
        parts: [
          {
            text: "I've thoroughly reviewed your profile and I'm ready to curate an exceptional look for you. Tell me — what's the occasion or mood we're dressing for? A dinner, a creative meeting, a weekend escape?",
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.9,
    },
  });
}

// ─── Send a message to an existing chat session ───────────────────────────────
export async function sendChatMessage(chatSession, userMessage) {
  if (!chatSession) return getMockChatReply(userMessage);
  try {
    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    return "My apologies — I had a moment of distraction. Could you describe your occasion again?";
  }
}

// ─── Generate outfits personalized to the vision analysis ────────────────────
export async function generatePersonalizedOutfits(occasion, preferences, imageAnalysis, quizProfile) {
  if (!API_KEY) return getMockOutfits();
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = imageAnalysis
      ? buildPersonalizedOutfitPrompt(occasion, preferences, imageAnalysis, quizProfile)
      : buildFashionPrompt(occasion, preferences);
    const result = await model.generateContent(prompt);
    const cleaned = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Outfit Error:", err);
    return getMockOutfits();
  }
}

// ─── Legacy outfit generation ─────────────────────────────────────────────────
export async function generateOutfitRecommendations(occasion, stylePreferences) {
  if (!API_KEY) return getMockOutfits();
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(buildFashionPrompt(occasion, stylePreferences));
    const cleaned = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Error:", err);
    return getMockOutfits();
  }
}

// ─── Mock data ────────────────────────────────────────────────────────────────
function getMockAnalysis() {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          bodyType: "Athletic / Straight",
          skinTone: "Medium Warm",
          skinToneCategory: "Warm",
          currentStyle: "Smart Casual",
          colorNotes: "Earth tones & amber",
          stylistInsight:
            "Your warm undertones pair beautifully with camel, terracotta, and deep olive. Structure will complement your silhouette.",
        }),
      1800
    )
  );
}

const MOCK_REPLIES = [
  "Wonderful. A few more details and I'll have the perfect looks ready. What colours do you feel most confident in?",
  "Excellent taste. And for this occasion — are we aiming for understated elegance, or something that truly commands attention?",
  "Perfect. I have everything I need to craft your bespoke looks. Click 'Generate My Looks' whenever you're ready.",
];
let mockReplyIndex = 0;

function getMockChatReply() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(MOCK_REPLIES[mockReplyIndex++ % MOCK_REPLIES.length]);
    }, 900)
  );
}

function getMockOutfits() {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            title: "Midnight Velvet",
            desc: "A deep navy double-breasted jacket paired with wide-leg trousers and a cream silk shirt.",
            tags: ["Formal", "Winter"],
            why_it_works: "The structured fit creates clean vertical lines that elongate the silhouette.",
            garments: ["Navy double-breasted jacket", "Wide-leg trousers", "Cream silk shirt"],
          },
          {
            id: 2,
            title: "Silent Architecture",
            desc: "Structured white silk blouse with an asymmetrical wrap skirt in warm taupe.",
            tags: ["Minimalist", "Civic"],
            why_it_works: "Asymmetry and tonal dressing create visual interest without competing elements.",
            garments: ["White silk blouse", "Taupe wrap skirt"],
          },
          {
            id: 3,
            title: "Urban Daze",
            desc: "Oversized camel trench over a mock-neck chocolate knit and relaxed ecru denim.",
            tags: ["Streetwear", "Casual"],
            why_it_works:
              "Layering earth tones with varied textures provides warmth while maintaining aesthetic cohesion.",
            garments: ["Camel trench coat", "Chocolate mock-neck knit", "Ecru relaxed denim"],
          },
        ]),
      1500
    )
  );
}

// ─── Remix an existing outfit ────────────────────────────────────────────────
export async function remixOutfit(outfit, tweakInstruction, analysis, quizProfile) {
  if (!API_KEY) return getMockRemix(outfit, tweakInstruction);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildRemixOutfitPrompt(outfit, tweakInstruction, analysis, quizProfile);
    const result = await model.generateContent(prompt);
    const cleaned = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Remix Error:", err);
    return getMockRemix(outfit, tweakInstruction);
  }
}

function getMockRemix(outfit, tweakInstruction) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ...outfit,
          title: outfit.title + " (Remixed)",
          desc: outfit.desc + ` Modified to be: ${tweakInstruction}.`,
          why_it_works: "The new variant respects your tweak while keeping the core identity.",
          garments: [...(outfit.garments || []), "New tweaked accessory"],
        }),
      1500
    )
  );
}
