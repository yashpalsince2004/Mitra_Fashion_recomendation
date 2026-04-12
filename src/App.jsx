import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { QuizPage } from "./pages/QuizPage";
import { StylistChatPage } from "./pages/StylistChatPage";
import { GalleryPage } from "./pages/GalleryPage";
import { WishlistPage } from "./pages/WishlistPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen relative flex flex-col selection:bg-accent/30 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/chat" element={<StylistChatPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
