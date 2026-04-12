import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 pb-20">
      {/* Decorative blurred background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#1a233a] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#E11D48]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl text-center z-10 flex flex-col items-center"
      >
        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/70 mb-8 inline-block tracking-[0.2em] text-xs font-semibold uppercase">
          AI-Powered Styling
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-medium text-white leading-tight mb-6">
          Your Personal <br className="hidden md:block"/>
          <span className="text-gradient font-bold drop-shadow-sm">Digital Tailor.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral/70 font-body max-w-xl mx-auto mb-12 leading-relaxed">
          Upload your silhouette. Define your moment. Let our intelligence curate your perfect editorial look.
        </p>
        
        <Button 
          size="lg" 
          onClick={() => navigate('/chat')}
          className="gap-3 z-20"
        >
          Start Styling <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
