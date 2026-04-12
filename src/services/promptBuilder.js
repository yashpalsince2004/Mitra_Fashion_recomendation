export function buildFashionPrompt(occasion, stylePreferences, extractedImageFeatures = null) {
  const baseContext = `You are an elite, modern fashion stylist working in a high-end digital atelier. 
Your tone is sophisticated, brief, and highly knowledgeable.`;

  const request = `
Given the following client details:
- Occasion: ${occasion}
- Preferences: ${stylePreferences}
${extractedImageFeatures ? `- Extracted Physical/Style Features: ${extractedImageFeatures}` : ''}

Provide exactly 3 curated outfit recommendations.
Format the output as a strict JSON array of objects.
Do not wrap the JSON in Markdown code blocks. Just output the raw JSON array.
Each object MUST have these exact keys:
1. "id" (integer)
2. "title" (string, the name of the outfit)
3. "desc" (string, a poetic 1-2 sentence description)
4. "tags" (array of exactly 2 strings, representing the style or vibe, e.g. ["Formal", "Minimalist"])
5. "why_it_works" (string, 1 sentence explaining the styling logic)
`;

  return baseContext + "\n" + request;
}
