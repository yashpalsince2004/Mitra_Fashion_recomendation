# Mitra Atelier ✦

A premium, interactive AI-powered fashion recommendation platform designed to act as your personal "Digital Atelier." The platform leverages sophisticated design architecture, dynamic image retrieval via Unsplash, and an elegant conversational Floating Chatbot to curate bespoke styling recommendations.

![Mitra Atelier Overview](/src/assets/bkg.png) *(The Liquid Glass Aesthetic)*

## 🌟 Key Features

### 1. Liquid Glass Aesthetic & Premium Motion Design
A beautiful, high-fidelity UI prioritizing depth, typography, and fluidity.
* **Liquid Glass Cards:** Heavy glassmorphism with 3D drop-shadow mapping (`shadow-2xl`) layered over a curated atmospheric background.
* **Framer Motion Engine:** Seamless route cross-fading, staggered cascading gallery loading, and spring-based micro-interactions across every button.
* **Advanced Custom Cursor:** A highly optimized native DOM tracking cursor that fluidly adapts to context (Scissors over imagery, Pointers over buttons) featuring magnetic adherence and ambient trailing particles.

### 2. Style Profile & Quiz Engine
A stunning 4-step glassmorphism assessment that captures the user's styling intent cleanly and luxuriously.
* **Gargantuan Touch Targets:** Built for accessibility and flair, featuring scaled typography and animated CSS shadows.
* **Auditory Feedback:** An onboard zero-dependency **WebAudio Synthesizer** triggers a subtle "snip" frequency when locking in selections or interacting with the gallery.

### 3. Dynamic Unsplash Image Retrieval (`UnsplashService`)
The main curation gallery where high-end fashion recommendations truly come to life.
* **Intelligent Query Rotation:** Automatically cycles through advanced editorial search prompts ("high fashion editorial outfit model", "minimalist fashion neutral tones") to guarantee maximum visual diversity.
* **Zero-Opacity Resolution:** Images render 100% crystal clear instantly within their mapped GlassCards.

### 4. Floating Stylist Chatbot (`FloatingChatbot.jsx`)
A persistent, stateful sliding conversational pane.
* **Context-Aware:** Drop down the chatbot anywhere in the app to ask for instant styling adjustments, trend advice, or profile refinement without leaving the current screen.
* **Elegant UX:** Glass-framed dialogue bubbles floating natively over the background.

### 5. Persistent Wishlist (`useWishlist`)
* Users can "heart" outfits from the gallery directly into their personal collection.
* Powered by a clean custom hook utilizing `localStorage` to preserve saved curations across sessions natively secured inside a massive glass frame.

---

## 🛠️ Technology Stack

* **Frontend:** React, React Router 
* **Styling:** Vanilla CSS & Tailwind CSS (Glass Variables, Gradients, Structural Drop Shadows)
* **Animations:** Framer Motion (Page transitions, AnimatePresence wait routing, Staggered staggers)
* **Icons:** Lucide React
* **Image Delivery:** Unsplash API
* **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites

You need an Unsplash Developer API Key to run the dynamic image service. Get one from [Unsplash Developer](https://unsplash.com/developers).

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
   VITE_UNSPLASH_ACCESS_KEY="your_api_key_here"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture & Flow

1. `LandingPage.jsx`: The grand entrance featuring scroll-based `whileInView` observers and striking glass pills.
2. `QuizPage.jsx`: Collects user preferences with expansive, responsive touch targets.
3. `GalleryPage.jsx`: The interactive showroom leveraging the Unsplash API matrix to serve fashion inspiration.
4. `WishlistPage.jsx`: A mapped grid routing saved aesthetics directly into local storage.
5. `CustomCursor.jsx`: The standalone interaction engine overlaying raw RAF cursor trailing logic natively over the DOM.

---
*Mitra Atelier — Built as a state-of-the-art exploration into agentic styling platforms and premium web design.*
