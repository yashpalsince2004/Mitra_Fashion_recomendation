/**
 * Search Query Builder
 * 
 * Converts structured user quiz inputs into a clean, fashion-oriented
 * natural language search query suitable for image retrieval.
 * 
 * Input fields:
 *   - gender: Male / Female
 *   - occasion: Formal, Casual, Party, Wedding, etc.
 *   - season: Summer, Winter, Rainy
 *   - style: Minimal, Trendy, Streetwear, Ethnic, etc.
 *   - color (optional): color preference string
 */

// ─── Gender mapping ──────────────────────────────────────────────────────────
const GENDER_MAP = {
  "Male": "men",
  "Female": "women",
};

// ─── Occasion mapping → search-friendly tokens ───────────────────────────────
const OCCASION_MAP = {
  "Work / Office":      "formal office",
  "Date Night":         "date night elegant",
  "Everyday / Casual":  "casual everyday",
  "Special Event":      "special event glamorous",
  "Street / Social":    "social outing urban",
  "Travel":             "travel smart",
  "Formal":             "formal",
  "Casual":             "casual",
  "Party":              "party festive",
  "Wedding":            "wedding ethnic traditional",
};

// ─── Style mapping → search-friendly tokens ──────────────────────────────────
const STYLE_MAP = {
  "Minimalist":         "minimal clean lines",
  "Streetwear":         "streetwear urban bold",
  "Bohemian":           "bohemian flowy textured",
  "Classic / Preppy":   "classic preppy timeless",
  "Edgy / Dark":        "edgy dark dramatic",
  "Maximalist":         "maximalist bold statement",
  "Minimal":            "minimal clean",
  "Trendy":             "trendy stylish modern",
  "Ethnic":             "ethnic traditional cultural",
};

// ─── Season mapping → fabric/material hints ──────────────────────────────────
const SEASON_MAP = {
  "Summer":   "summer light breathable",
  "Winter":   "winter warm layered",
  "Rainy":    "rainy waterproof layered",
  "Monsoon":  "monsoon waterproof",
  "Spring":   "spring fresh light",
  "Autumn":   "autumn earthy warm",
};

// ─── Color palette mapping → color hints ─────────────────────────────────────
const COLOR_MAP = {
  "Neutrals":         "neutral beige ivory grey",
  "Bold & Vibrant":   "vibrant bright saturated",
  "Earth Tones":      "earth tones camel rust olive",
  "Pastels":          "pastel soft dreamy",
  "Monochrome":       "monochrome black tonal",
  "Jewel Tones":      "jewel tones sapphire emerald ruby",
};

/**
 * Build a fashion search query from structured quiz inputs.
 *
 * @param {Object} params
 * @param {string} params.gender     - "Male" | "Female"
 * @param {string} params.occasion   - Occasion value from quiz
 * @param {string} params.season     - Season value from quiz
 * @param {string} params.styleVibe  - Style preference from quiz
 * @param {string} [params.colorPalette] - Optional color palette from quiz
 * @param {string} [params.color]    - Optional free-text color preference
 * @returns {string} A clean search query string
 *
 * @example
 * buildSearchQuery({ gender: "Male", occasion: "Formal", season: "Summer", styleVibe: "Minimal" })
 * // → "men formal summer outfit light minimal clean style"
 *
 * buildSearchQuery({ gender: "Female", occasion: "Party", season: "Winter", styleVibe: "Trendy" })
 * // → "women party festive winter outfit warm trendy stylish modern style"
 */
export function buildSearchQuery({ gender, occasion, season, styleVibe, colorPalette, color }) {
  const tokens = [];

  // 1. Gender
  const genderToken = GENDER_MAP[gender] || gender?.toLowerCase() || "";
  if (genderToken) tokens.push(genderToken);

  // 2. Occasion
  const occasionTokens = OCCASION_MAP[occasion] || occasion?.toLowerCase() || "";
  if (occasionTokens) tokens.push(occasionTokens);

  // 3. Season
  const seasonTokens = SEASON_MAP[season] || season?.toLowerCase() || "";
  if (seasonTokens) tokens.push(seasonTokens);

  // Core noun
  tokens.push("outfit");

  // 4. Style
  const styleTokens = STYLE_MAP[styleVibe] || styleVibe?.toLowerCase() || "";
  if (styleTokens) tokens.push(styleTokens);

  // 5. Color (from palette or free-text)
  if (colorPalette) {
    const colorTokens = COLOR_MAP[colorPalette] || colorPalette.toLowerCase();
    tokens.push(colorTokens);
  }
  if (color) {
    tokens.push(color.toLowerCase());
  }

  // Closing keyword
  tokens.push("style");

  // Clean up: remove duplicate words, extra spaces
  const allWords = tokens.join(" ").split(/\s+/);
  const seen = new Set();
  const deduplicated = allWords.filter((word) => {
    if (seen.has(word)) return false;
    seen.add(word);
    return true;
  });

  return deduplicated.join(" ");
}

/**
 * Build a search query directly from a quiz profile object
 * (as produced by the QuizPage component).
 *
 * @param {Object} quizProfile - The quiz profile from QuizPage
 * @returns {string} A clean search query string
 */
export function buildSearchQueryFromProfile(quizProfile) {
  if (!quizProfile) return "";

  return buildSearchQuery({
    gender: quizProfile.gender,
    occasion: quizProfile.occasion,
    season: quizProfile.season,
    styleVibe: quizProfile.styleVibe,
    colorPalette: quizProfile.colorPalette,
    color: quizProfile.color,
  });
}
