import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowLeft, Wand2, Sparkles } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { useWishlist } from "../hooks/useWishlist";

const OUTFIT_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop",
];

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-accent fill-accent" />
              <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Saved Looks
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white">My Wishlist</h2>
            <p className="font-body text-white/45 mt-2">
              {wishlist.length > 0
                ? `${wishlist.length} look${wishlist.length > 1 ? "s" : ""} curated and saved.`
                : "Your wishlist is empty."}
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 text-white/30 hover:text-red-400 text-sm border border-white/10 hover:border-red-400/30 px-4 py-2.5 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {wishlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/4 border border-white/10 flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="font-display text-2xl text-white/50 mb-3">Nothing saved yet</h3>
          <p className="font-body text-white/30 text-sm max-w-xs leading-relaxed mb-8">
            Generate outfit recommendations and tap the heart icon to save looks you love.
          </p>
          <Button onClick={() => navigate("/quiz")} className="gap-2">
            <Wand2 className="w-4 h-4" />
            Start Styling
          </Button>
        </motion.div>
      )}

      {/* Wishlist grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlist.map((outfit, idx) => (
            <motion.div
              key={outfit.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
            >
              <GlassCard hoverable className="h-full flex flex-col group relative">
                {/* Remove heart */}
                <button
                  onClick={() => toggleWishlist(outfit)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-400/40 transition-all"
                >
                  <Heart className="w-4 h-4 text-accent fill-accent" />
                </button>

                {/* Image */}
                <div className="w-full aspect-[3/4] mb-4 rounded-xl overflow-hidden relative">
                  <img
                    src={OUTFIT_IMAGES[idx % OUTFIT_IMAGES.length]}
                    alt={outfit.title}
                    className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {outfit.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] uppercase font-bold tracking-widest text-white/80 bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-display text-lg text-white mb-1.5">{outfit.title}</h3>
                  <p className="font-body text-white/50 text-sm leading-relaxed flex-1">
                    {outfit.desc}
                  </p>

                  {outfit.why_it_works && (
                    <div className="mt-3 pt-3 border-t border-white/8 flex items-start gap-2">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-white/35 text-xs leading-relaxed italic">
                        {outfit.why_it_works}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
