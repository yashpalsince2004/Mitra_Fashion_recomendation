# AI Fashion Stylist ✦

A premium, interactive AI-powered fashion recommendation platform designed to act as your personal "Digital Atelier." This project leverages the Google Gemini API (Vision & Text) to analyze your physical profile, understand your styling preferences, and curate bespoke "shoppable" outfit recommendations.

![AI Fashion Stylist Overview](/src/assets/preview-placeholder.png) *(Preview)*

## 🌟 Key Features

### 1. Style Profile & Quiz Engine
A beautiful 4-step glassmorphism quiz that captures the user's styling intent before they even hit the chat.
* **Occasion Setup:** (Everyday, Evening, Formal, Avant-Garde).
* **Vibe Check:** (Minimalist, Streetwear, Elegant).
* **Color Palette:** (Neutrals, Earth Tones, Bold, Monochromes).
* **Budget Tier:** (Accessible, Mid-Tier, Luxury).

### 2. Gemini Vision Analysis (`ImageUploader` + `AnalysisPanel`)
Drag and drop a photo to let the AI analyze your core profile to generate a tailored style foundation.
* **Extraction:** Detects Body Type, Skin Tone undertones, and current style vibes.
* **Insight:** Provides a personalized "Stylist Insight" determining what silhouettes and colors complement the user best.

### 3. Persistent AI Chat Session (`StylistChatPage`)
A real-time, stateful conversation powered by `gemini-1.5-flash`.
* **Context-Aware:** The AI enters the chat pre-loaded with the user's Vision Analysis and Quiz Profile.
* **Elegant Experience:** Styled like a luxury concierge, the AI asks targeted questions to refine the desired look before generating the final outfit board.

### 4. Interactive & Shoppable Gallery (`GalleryPage`)
The main curation gallery where the AI's recommendations truly come to life.
* **Bespoke Generation:** The AI creates 3 completely custom outfits formatted precisely as a JSON object containing tags, evocative descriptions, and deep "Why it works for you" personalized reasoning.
* **Shoppable Links:** The AI intelligently separates the outfit into a `garments` array. Each garment automatically links to an active Google Shopping search (e.g., *Navy double-breasted jacket*), bridging the gap between digital curation and physical purchasing.
* **"Remix This Look":** Don't love a specific part of an outfit? Users can click "Remix", tell the AI how to tweak it (e.g., "Make it more casual"), and the AI will surgically drop a new, updated outfit card right into the active gallery.

### 5. Persistent Wishlist (`useWishlist`)
* Users can "heart" outfits from the gallery or the detail modal.
* Powered by a clean custom hook utilizing `localStorage` to keep saved outfits across sessions.

---

## 🚀 Recent Evolution (Phase 2 & 3)

The platform has recently been upgraded to a high-performance "Editorial Experience":

### ✨ Streaming "Live" Responses
The stylist now "thinks" and "speaks" in real-time using **Gemini Streaming**. Message bubbles grow dynamically as the AI types, providing a character-by-character conversational experience that feels alive.

### 🧥 "The Wardrobe" (Multi-Image Vision)
Users can now upload up to **5 images simultaneously**. The AI analyzes the collective aesthetic of the user's wardrobe, providing styling foundations based on a comprehensive visual context rather than a single photo.

### 🥂 Refined Light Mode ("The Champagne Theme")
A luxury editorial light theme inspired by high-fashion catalogs. Includes a global **Theme Toggle** (Sun/Moon) with a high-contrast palette of creamy whites, deep espresso text, and glassmorphism accents.

### 📸 Shareable "Style Cards" (Export PNG)
 Curated looks can now be exported as high-resolution images. Utilizing `html2canvas`, the platform renders a clean, UI-free "Style Card" perfect for social sharing or physical shopping reference.

### 🏷️ Shoppable Affiliate Mapping
Internal garment mapping now links directly to targeted shopping queries, allowing users to move from "looking" to "owning" with one click.

## 🛠️ Technology Stack

* **Frontend:** React, React Router 
* **Styling:** Vanilla CSS & Tailwind CSS (Glassmorphism, Gradients, Micro-animations)
* **Animations:** Framer Motion (page transitions, modal springs, staggered card reveals)
* **Icons:** Lucide React
* **AI Engine:** Google Gemini API (`@google/generative-ai` SDK)
* **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites

You need a Google Gemini API Key. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashpalsince2004/Ai_Fashion_recomendation.git
   cd Ai_Fashion_recomendation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   VITE_GEMINI_API_KEY="your_api_key_here"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture & Flow

1. `LandingPage.jsx`: The grand entrance. Routes users primarily to the style quiz.
2. `QuizPage.jsx`: Collects user preferences and pushes them to React Router state.
3. `StylistChatPage.jsx`: Handles the Image Vision upload and the persistent text-conversation session. Consolidates all data.
4. `GalleryPage.jsx`: The interactive showroom. Holds the React state for the custom outfits array. Houses the `OutfitDetailModal`.
5. `promptBuilder.js`: The central "brain" of the app. Houses the meticulously crafted prompts that force Gemini to output consistent, structured JSON objects.

## 🔒 Security Note
This app utilizes client-side API calls to Gemini for the sake of an architectural prototype. For production deployment, the `genAI` API requests should be securely proxied through a lightweight backend (like Node.js/Express, or edge functions via Vercel/Supabase) to protect the `VITE_GEMINI_API_KEY`.

---
*Built as a state-of-the-art exploration into agentic styling platforms.*
