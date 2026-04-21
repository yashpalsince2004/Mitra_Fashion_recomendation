import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { buildSearchQueryFromProfile } from "../utils/searchQueryBuilder";

const STEPS = [
  {
    id: "gender",
    question: "How do you identify?",
    subtitle: "This helps us tailor silhouettes and fits to you.",
    options: [
      { value: "Male", emoji: "👔", desc: "Masculine styles & fits" },
      { value: "Female", emoji: "👗", desc: "Feminine styles & fits" },
    ],
  },
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
    id: "season",
    question: "What season are we dressing for?",
    subtitle: "We'll pick fabrics and layers that make sense.",
    options: [
      { value: "Summer", emoji: "☀️", desc: "Light, breathable & airy" },
      { value: "Winter", emoji: "❄️", desc: "Warm, layered & cozy" },
      { value: "Rainy", emoji: "🌧️", desc: "Waterproof & practical" },
      { value: "Spring", emoji: "🌸", desc: "Fresh, transitional layers" },
      { value: "Autumn", emoji: "🍂", desc: "Rich textures & warm hues" },
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
      // Build search query from the completed quiz profile
      const searchQuery = buildSearchQueryFromProfile(newAnswers);
      console.log("🔍 Generated Search Query:", searchQuery);

      // Navigate to gallery with quiz profile + search query
      setTimeout(() => {
        navigate("/gallery", {
          state: {
            quizProfile: newAnswers,
            searchQuery,
          },
        });
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[140px] pointer-events-none opacity-60" />
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-muted hover:text-main text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {currentStep === 0 ? "Home" : "Back"}
            </button>
            <span className="text-muted text-xs tracking-widest uppercase font-medium">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <div className="h-0.5 bg-black/5 dark:bg-surface-low border ghost-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-silk-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress + (100 / totalSteps)}%` }}
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
              <p className="text-muted text-xs uppercase tracking-widest font-semibold mb-3">
                Style Profile · Step {currentStep + 1}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-main mb-4 tracking-tight drop-shadow-sm">
                {step.question}
              </h2>
              <p className="font-body text-main text-lg md:text-xl font-medium opacity-90">{step.subtitle}</p>
            </div>

            {/* Options grid */}
            <div className={`grid gap-5 ${step.options.length <= 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
              {step.options.map((opt) => {
                const isSelected = answers[step.id] === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative text-left p-6 md:p-8 rounded-[2rem] border transition-all duration-300 group glass shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                      ${isSelected
                        ? "bg-accent/25 border-accent/50 shadow-[0_12px_40px_rgba(var(--accent-rgb),0.3)]"
                        : "border-black/5 dark:ghost-border hover:bg-surface-high hover:border-accent/40 hover:shadow-[0_15px_40px_rgb(0,0,0,0.16)]"
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-main" />
                      </motion.div>
                    )}
                    <span className="text-4xl md:text-5xl mb-5 block drop-shadow-md">{opt.emoji}</span>
                    <p className={`font-bold text-lg md:text-xl mb-2 tracking-tight ${isSelected ? "text-accent" : "text-main"}`}>
                      {opt.value}
                    </p>
                    <p className="text-main font-medium opacity-80 text-sm md:text-base leading-relaxed">{opt.desc}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Skip option */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/gallery")}
                className="text-muted hover:text-main text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1.5 font-bold"
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
