import { motion } from "framer-motion";
import { Scan, Palette, Zap } from "lucide-react";

const SWATCH_COLORS = {
  "Warm": ["#C4956A", "#E8C99A", "#F5E6D3", "#8B5E3C"],
  "Cool": ["#7B9EC7", "#A8C4E0", "#D4E5F5", "#4A6FA5"],
  "Neutral": ["#9E9E9E", "#C5C5C5", "#E0E0E0", "#6B6B6B"],
  "Olive": ["#8F9B6E", "#B5C18E", "#D4DDB5", "#5D6B3A"],
  "Deep": ["#5C3D2E", "#8B5E3C", "#C4845A", "#2A1810"],
};

export function AnalysisPanel({ analysis }) {
  if (!analysis) return null;

  const swatches = SWATCH_COLORS[analysis.skinToneCategory] || SWATCH_COLORS["Neutral"];

  const items = [
    { icon: Scan, label: "Body Type", value: analysis.bodyType },
    { icon: Zap, label: "Style Vibe", value: analysis.currentStyle },
    { icon: Palette, label: "Skin Tone", value: analysis.skinTone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-black/5 dark:ghost-border bg-surface-container-low overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/5 dark:ghost-border flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-main text-sm font-semibold tracking-wide uppercase">AI Analysis Complete</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 divide-x divide-black/5 dark:divide-white/5">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="px-4 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className="w-3 h-3 text-muted" />
              <span className="text-muted text-[10px] uppercase tracking-widest font-medium">{label}</span>
            </div>
            <p className="text-main text-sm font-semibold leading-snug">{value}</p>
          </div>
        ))}
      </div>

      {/* Color palette row */}
      <div className="px-5 py-4 border-t border-black/5 dark:ghost-border">
        <p className="text-muted text-[10px] uppercase tracking-widest font-medium mb-3">Suggested Palette</p>
        <div className="flex gap-2.5 items-center">
          {swatches.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              className="w-8 h-8 rounded-full border-2 border-black/10 dark:ghost-border shadow-lg cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <p className="text-muted text-xs ml-2 leading-snug">
            {analysis.colorNotes}
          </p>
        </div>
      </div>

      {/* Insight quote */}
      {analysis.stylistInsight && (
        <div className="px-5 py-4 border-t border-black/5 dark:ghost-border bg-accent/5">
          <p className="text-muted text-xs leading-relaxed italic">
            &ldquo;{analysis.stylistInsight}&rdquo;
          </p>
        </div>
      )}
    </motion.div>
  );
}
