/** 
 * AI SERVICE - OpenRouter Integration
 * This service handles all AI calls (Chat, Vision, Outfit Generation) using OpenRouter.
 * It is fully compatible with the existing UI components.
 */

import {
  buildFashionPrompt,
  buildVisionAnalysisPrompt,
  buildPersonalizedOutfitPrompt,
  buildChatSystemPrompt,
  buildRemixOutfitPrompt,
} from "./promptBuilder";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openrouter/free";

// ─── Helper: Standard Fetch to OpenRouter ───────────────────────────────────
async function openRouterRequest(messages, { stream = false, model = DEFAULT_MODEL } = {}) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_key_here") {
    throw new Error("API Key logic: Please replace 'your_openrouter_key_here' in your .env file with your actual OpenRouter API Key.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AI Fashion Stylist",
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || "OpenRouter Request Failed");
  }

  return response;
}

// ─── Analyze images using Vision capabilities ────────────────────────────────
export async function analyzeUserImage(images) {
  const imagesArray = Array.isArray(images) ? images : [images];
  
  if (!OPENROUTER_API_KEY) return getMockAnalysis(imagesArray.length > 1);

  try {
    const prompt = buildVisionAnalysisPrompt(imagesArray.length > 1);
    
    // OpenRouter/OpenAI format for multi-modal messages
    const content = [
      { type: "text", text: prompt },
      ...imagesArray.map(img => ({
        type: "image_url",
        image_url: { url: `data:${img.mimeType || 'image/jpeg'};base64,${img.base64Data}` }
      }))
    ];

    const res = await openRouterRequest([{ role: "user", content }]);
    const data = await res.json();
    const rawText = data.choices[0].message.content;
    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OpenRouter Vision Error:", err);
    return getMockAnalysis(imagesArray.length > 1);
  }
}

// ─── Session Helpers (Returning history arrays for stateless API) ─────────────
export function startQuickChat() {
  return [
    { role: "system", content: "You are an AI Fashion Stylist. Keep your answers concise, helpful, and premium." },
    { role: "assistant", content: "Hello! I am your AI Fashion Stylist. How can I help you elevate your style today?" }
  ];
}

export function createStylistChatSession(analysis, quizProfile) {
  const systemContext = buildChatSystemPrompt(analysis, quizProfile);
  return [
    { role: "system", content: systemContext },
    { role: "assistant", content: "I've thoroughly reviewed your profile and I'm ready to curate an exceptional look for you. Tell me — what's the occasion or mood we're dressing for? A dinner, a creative meeting, a weekend escape?" }
  ];
}

// ─── Streaming Chat Logic ──────────────────────────────────────────────────
export async function sendChatMessageStream(chatHistory, userMessage, onChunk) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_key_here") {
    onChunk("Please set your OpenRouter API Key in the .env file.");
    return null;
  }

  const updatedHistory = [...chatHistory, { role: "user", content: userMessage }];

  try {
    const res = await openRouterRequest(updatedHistory, { stream: true });
    
    // Check if the response is actually a stream
    if (!res.body) throw new Error("No response body received");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";
    let buffer = ""; // Buffer to hold incomplete JSON strings

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split("\n");
      // Keep the last line in the buffer as it might be incomplete
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
        
        if (trimmedLine.startsWith("data: ")) {
          try {
            const jsonStr = trimmedLine.replace("data: ", "");
            const data = JSON.parse(jsonStr);
            const text = data.choices[0]?.delta?.content || "";
            if (text) {
              fullText += text;
              onChunk(fullText);
            }
          } catch (e) {
            console.debug("Partial JSON encountered, waiting for next chunk...");
          }
        }
      }
    }
    
    if (fullText) {
      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: fullText });
    }
    
    return fullText;
  } catch (err) {
    console.error("Streaming failed, trying non-streaming fallback...", err);
    
    // FALLBACK: Non-streaming request
    try {
      const res = await openRouterRequest(updatedHistory, { stream: false });
      const data = await res.json();
      const text = data.choices[0]?.message?.content || "";
      
      if (text) {
        onChunk(text);
        chatHistory.push({ role: "user", content: userMessage });
        chatHistory.push({ role: "assistant", content: text });
        return text;
      }
    } catch (fallbackErr) {
      console.error("AI SERVICE ERROR:", fallbackErr.message);
    }
    return null;
  }
}

// ─── Outfit Generation Logic ────────────────────────────────────────────────
export async function generatePersonalizedOutfits(occasion, preferences, imageAnalysis, quizProfile) {
  if (!OPENROUTER_API_KEY) return getMockOutfits();
  try {
    const prompt = imageAnalysis
      ? buildPersonalizedOutfitPrompt(occasion, preferences, imageAnalysis, quizProfile)
      : buildFashionPrompt(occasion, preferences);
      
    const res = await openRouterRequest([{ role: "user", content: prompt }]);
    const data = await res.json();
    const cleaned = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OpenRouter Outfit Error:", err);
    return getMockOutfits();
  }
}

export async function generateOutfitRecommendations(occasion, stylePreferences) {
  if (!OPENROUTER_API_KEY) return getMockOutfits();
  try {
    const prompt = buildFashionPrompt(occasion, stylePreferences);
    const res = await openRouterRequest([{ role: "user", content: prompt }]);
    const data = await res.json();
    const cleaned = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OpenRouter Error:", err);
    return getMockOutfits();
  }
}

export async function remixOutfit(outfit, tweakInstruction, analysis, quizProfile) {
  if (!OPENROUTER_API_KEY) return getMockRemix(outfit, tweakInstruction);
  try {
    const prompt = buildRemixOutfitPrompt(outfit, tweakInstruction, analysis, quizProfile);
    const res = await openRouterRequest([{ role: "user", content: prompt }]);
    const data = await res.json();
    const cleaned = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OpenRouter Remix Error:", err);
    return getMockRemix(outfit, tweakInstruction);
  }
}

// ─── Mock Data (Identical to previous implementation) ────────────────────────
function getMockAnalysis(isMulti = false) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      bodyType: "Athletic / Straight",
      skinTone: "Medium Warm",
      skinToneCategory: "Warm",
      currentStyle: "Smart Casual",
      wardrobeVibe: isMulti ? "Vintage Eclectic with neutral foundations" : undefined,
      colorNotes: "Earth tones & amber",
      stylistInsight: "Your warm undertones pair beautifully with camel, terracotta, and deep olive.",
    }), 1800)
  );
}

function getMockChatReply() {
  return new Promise((resolve) => setTimeout(() => resolve("That sounds lovely. For this occasion, should we focus on something more tailored or relaxed?"), 900));
}

function getMockOutfits() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([
      { id: 1, title: "Midnight Velvet", desc: "Navy jacket with silk shirt.", tags: ["Formal"], why_it_works: "Clean lines.", garments: ["Jacket", "Shirt"] },
      { id: 2, title: "Urban Daze", desc: "Camel trench with denim.", tags: ["Casual"], why_it_works: "Texture play.", garments: ["Trench", "Denim"] }
    ]), 1500)
  );
}

function getMockRemix(outfit, tweak) {
  return new Promise((resolve) => setTimeout(() => resolve({ ...outfit, title: outfit.title + " (Remixed)", desc: outfit.desc + ` Modified for: ${tweak}` }), 1500));
}
