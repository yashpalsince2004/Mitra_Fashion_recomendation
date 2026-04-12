import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Wand2, Heart } from "lucide-react";

const FEATURES = [
  { icon: Wand2, label: "AI Vision Analysis", desc: "Upload your photo for a personalised profile" },
  { icon: Sparkles, label: "Style Quiz", desc: "4-step quiz to define your aesthetic" },
  { icon: Heart, label: "Wishlist", desc: "Save and revisit your favourite looks" },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 pb-20 min-h-[calc(100vh-80px)]">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1a233a] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[560px] h-[560px] bg-accent/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#1a233a] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl text-center z-10 flex flex-col items-center"
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 border border-white/10 px-5 py-1.5 rounded-full text-white/60 mb-8 inline-block tracking-[0.2em] text-xs font-semibold uppercase"
        >
          AI-Powered Styling
        </motion.span>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-medium text-white leading-tight mb-6">
          Your Personal{" "}
          <br className="hidden md:block" />
          <span className="text-gradient font-bold drop-shadow-sm">Digital Tailor.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/55 font-body max-w-xl mx-auto mb-12 leading-relaxed">
          Upload your silhouette. Complete your style quiz. Let our intelligence curate
          editorial looks that are built around <em>you</em>.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button
            size="lg"
            onClick={() => navigate("/quiz")}
            className="gap-3 px-8 py-4 text-base"
          >
            Begin Your Style Quiz <ArrowRight className="w-5 h-5" />
          </Button>
          <button
            onClick={() => navigate("/chat")}
            className="text-white/40 hover:text-white/70 text-sm underline underline-offset-4 transition-colors"
          >
            Skip quiz, go straight to atelier
          </button>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-white/4 border border-white/8 px-4 py-2.5 rounded-2xl group hover:border-white/20 transition-all cursor-default"
            >
              <Icon className="w-4 h-4 text-accent/70" />
              <div className="text-left">
                <p className="text-white/75 text-xs font-semibold">{label}</p>
                <p className="text-white/35 text-[10px] leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
