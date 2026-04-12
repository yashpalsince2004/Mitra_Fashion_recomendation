import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const STEPS = [
  {
    id: "occasion",
    question: "What's your primary occasion?",
    subtitle: "We'll tune your entire wardrobe around this.",
    options: [
      { value: "Work / Office", emoji: "💼", desc: "Professional & polished" },
      { value: "Date Night", emoji: "🌹", desc: "Romantic & refined" },
      { value: "Everyday / Casual", emoji: "☀️", desc: "Effortless daily wear" },
      { value: "Special Event", emoji: "✨", desc: "Weddings, galas & beyond" },
      { value: "Street / Social", emoji: "🏙️", desc: "Culture & nightlife" },
      { value: "Travel", emoji: "✈️", desc: "Chic on the move" },
    ],
  },
  {
    id: "styleVibe",
    question: "What's your style vibe?",
    subtitle: "Choose the aesthetic that feels most like you.",
    options: [
      { value: "Minimalist", emoji: "◻️", desc: "Clean lines & quiet luxury" },
      { value: "Streetwear", emoji: "🧢", desc: "Bold, urban & expressive" },
      { value: "Bohemian", emoji: "🌸", desc: "Flowy, free & textured" },
      { value: "Classic / Preppy", emoji: "🎓", desc: "Timeless & structured" },
      { value: "Edgy / Dark", emoji: "🖤", desc: "Dramatic, moody & daring" },
      { value: "Maximalist", emoji: "💫", desc: "More is more" },
    ],
  },
  {
    id: "colorPalette",
    question: "Your colour world?",
    subtitle: "The palette that makes you feel most yourself.",
    options: [
      { value: "Neutrals", emoji: "🤍", desc: "Beige, ivory, grey, white" },
      { value: "Bold & Vibrant", emoji: "🎨", desc: "Bright, saturated hues" },
      { value: "Earth Tones", emoji: "🍂", desc: "Camel, rust, forest, clay" },
      { value: "Pastels", emoji: "🌷", desc: "Soft, dreamy washes" },
      { value: "Monochrome", emoji: "⬛", desc: "All-black or tonal looks" },
      { value: "Jewel Tones", emoji: "💎", desc: "Sapphire, emerald, ruby" },
    ],
  },
  {
    id: "budget",
    question: "Your investment level?",
    subtitle: "We'll recommend pieces that match your range.",
    options: [
      { value: "Budget-Friendly", emoji: "🛍️", desc: "High style, smart spend" },
      { value: "Mid-Range", emoji: "🏷️", desc: "Quality everyday pieces" },
      { value: "Designer", emoji: "👑", desc: "Investment wardrobe" },
      { value: "Mixed", emoji: "⚖️", desc: "Splurge on hero pieces" },
    ],
  },
];

export function QuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const isLast = currentStep === totalSteps - 1;
  const progress = ((currentStep) / totalSteps) * 100;

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      // Navigate to chat with quiz profile
      setTimeout(() => {
        navigate("/chat", { state: { quizProfile: newAnswers } });
      }, 350);
    } else {
      setDirection(1);
      setTimeout(() => setCurrentStep((s) => s + 1), 200);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/");
      return;
    }
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 pb-16">
      {/* Background orb */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1a233a] rounded-full blur-[140px] pointer-events-none opacity-60" />
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-white/35 hover:text-white/70 text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {currentStep === 0 ? "Home" : "Back"}
            </button>
            <span className="text-white/30 text-xs tracking-widest uppercase font-medium">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress + 25}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mb-8">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">
                Style Profile · Step {currentStep + 1}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
                {step.question}
              </h2>
              <p className="font-body text-white/45 text-base">{step.subtitle}</p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {step.options.map((opt) => {
                const isSelected = answers[step.id] === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative text-left p-5 rounded-2xl border transition-all duration-200 group
                      ${isSelected
                        ? "bg-accent/15 border-accent/50 shadow-lg shadow-accent/10"
                        : "bg-white/3 border-white/10 hover:bg-white/6 hover:border-white/25"
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    <span className="text-2xl mb-3 block">{opt.emoji}</span>
                    <p className={`font-semibold text-sm mb-1 ${isSelected ? "text-white" : "text-white/80"}`}>
                      {opt.value}
                    </p>
                    <p className="text-white/35 text-xs leading-snug">{opt.desc}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Skip option */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/chat")}
                className="text-white/25 hover:text-white/45 text-xs tracking-widest uppercase transition-colors flex items-center gap-1.5"
              >
                Skip quiz <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
