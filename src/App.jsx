import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { QuizPage } from "./pages/QuizPage";
import { GalleryPage } from "./pages/GalleryPage";
import { WishlistPage } from "./pages/WishlistPage";
import { FloatingChatbot } from "./components/ui/FloatingChatbot";
import { CustomCursor } from "./components/ui/CustomCursor";
import bkgImage from "./assets/bkg.png";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen relative flex flex-col selection:bg-accent/30 selection:text-main"
        style={{
          backgroundImage: `url(${bkgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">
          <AnimatedRoutes />
        </main>
        <FloatingChatbot />
        <CustomCursor />
      </div>
    </Router>
  );
}

export default App;
