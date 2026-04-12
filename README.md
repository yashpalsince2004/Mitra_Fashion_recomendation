# 💎 AI Fashion Recommendation System (The Digital Atelier)

An elite, modern fashion styling application powered by artificial intelligence.

## Features
- **Conversational AI Styling:** Experience a guided, step-by-step fashion consultation mimicking a professional tailor.
- **Computer Vision Extraction (Pending Real-time Integration):** Designed to analyze skin tone and body structure via Gemini Vision API.
- **Event-Based Intelligence:** Adapts to formality levels and specific seasonal or cultural events.
- **Premium Structural Design:** Built on the "Digital Atelier" design philosophy—minimalist glassmorphism, tonal depth, and Vogue-level typography over functional scaffolding.

## Tech Stack
- Frontend: **React 19 (Vite)**
- Styling: **Tailwind CSS v4** + Custom Glassmorphism Theme
- Animations: **Framer Motion**
- Brain: **Google Gemini API** (`gemini-1.5-flash` for high-speed stylistic JSON generation)

## Getting Started Locally

1. Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deploying to GitHub Pages
Since the application uses local state management and browser-based Vite handling, it is completely statically hostable at virtually zero cost.

1. Ensure the `base` in `vite.config.js` matches your GitHub repository name if not hosted on a root domain (e.g. `base: "/my-repo-name/"`).
2. Run `npm run build`.
3. Push the `dist` folder to your `gh-pages` branch, or use GitHub Actions to automate this process.

---
*Created as part of the Vibe Project.*
