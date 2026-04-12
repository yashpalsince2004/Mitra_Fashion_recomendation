import { useLocation, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { AnalysisPanel } from "../components/ui/AnalysisPanel";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Sparkles, ArrowLeft, RefreshCw, Heart, Share2, Tag, Loader2, ExternalLink, Download } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { exportToImage } from "../utils/exportImage";
import { remixOutfit } from "../services/geminiService";

const MOCK_OUTFITS = [
  {
    id: 1,
    title: "Midnight Velvet",
    desc: "A deep navy double-breasted jacket paired with wide-leg trousers and a cream silk shirt.",
    tags: ["Formal", "Winter"],
    why_it_works: "The structured fit creates clean vertical lines that elongate the silhouette.",
    garments: ["Navy double-breasted jacket", "Wide-leg trousers", "Cream silk shirt"],
  },
  {
    id: 2,
    title: "Silent Architecture",
    desc: "Structured white silk blouse with an asymmetrical wrap skirt in warm taupe.",
    tags: ["Minimalist", "Civic"],
    why_it_works: "Asymmetry and tonal dressing create visual interest without competing elements.",
    garments: ["White silk blouse", "Taupe wrap skirt"],
  },
  {
    id: 3,
    title: "Urban Daze",
    desc: "Oversized camel trench over a mock-neck chocolate knit and relaxed ecru denim.",
    tags: ["Streetwear", "Casual"],
    why_it_works: "Layering earth tones with varied textures provides warmth while maintaining cohesion.",
    garments: ["Camel trench coat", "Chocolate mock-neck knit", "Ecru relaxed denim"],
  },
];

const OUTFIT_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80&fit=crop",
];

// ─── Outfit Detail Modal ──────────────────────────────────────────────────────
function OutfitDetailModal({ outfit, imageUrl, isWishlisted, onToggleWishlist, onRemix, onClose }) {
  const [shared, setShared] = useState(false);
  const [remixing, setRemixing] = useState(false);
  const [tweakText, setTweakText] = useState("");
  const [exporting, setExporting] = useState(false);

  const QUICK_TWEAKS = ["More casual", "Warmer", "Different colors", "More edgy"];

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Check out this look: "${outfit.title}" — ${outfit.desc}`
    );
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleRemix = async (tweak) => {
    setRemixing(true);
    await onRemix(outfit, tweak);
    setRemixing(false);
    setTweakText("");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToImage("outfit-modal-card", `Atelier_Look_${outfit.title}`);
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(false);
  };

  const piecesData = outfit.garments || outfit.desc.split(/[,.]/).filter(Boolean).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        id="outfit-modal-card"
        className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--surface-low)" }}
      >
        {(remixing || exporting) && (
           <div className="absolute inset-0 z-50 bg-[#131b2e]/80 backdrop-blur-sm flex flex-col items-center justify-center no-export">
             <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
             <p className="text-white/80 font-medium">
               {remixing ? "Tailoring your look..." : "Generating Style Card..."}
             </p>
           </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/10 backdrop-blur flex items-center justify-center hover:bg-white/10 transition-colors no-export"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="md:flex h-full">
          {/* Image panel */}
          <div className="md:w-5/12 h-56 md:h-auto relative overflow-hidden shrink-0">
            <img src={imageUrl} alt={outfit.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(19,27,46,0.6)] hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,27,46,0.8)] to-transparent md:hidden" />
          </div>

          {/* Details panel */}
          <div className="md:w-7/12 p-7 flex flex-col justify-between">
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {outfit.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-accent/80 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t}
                  </span>
                ))}
              </div>

              <h2 className="font-display text-2xl md:text-3xl text-white mb-3">{outfit.title}</h2>
              <p className="font-body text-white/65 text-sm leading-relaxed mb-5">{outfit.desc}</p>

              {/* Why it works */}
              {outfit.why_it_works && (
                <div className="bg-gradient-to-br from-amber-500/8 to-transparent border border-amber-500/15 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-amber-400/70 text-[10px] uppercase tracking-widest font-bold">
                      Why it works for you
                    </p>
                  </div>
                  <p className="text-main text-sm leading-relaxed italic">
                    &ldquo;{outfit.why_it_works}&rdquo;
                  </p>
                </div>
              )}

              {/* Shoppable Pieces */}
              <div className="bg-surface-container-low border border-black/5 dark:border-white/8 rounded-2xl p-4 mb-5">
                <p className="text-muted text-[10px] uppercase tracking-widest font-semibold mb-3">
                  Shop Key Pieces
                </p>
                <div className="flex flex-col gap-2">
                  {piecesData.map((piece, i) => (
                    <a
                      key={i}
                      href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(piece.trim())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between text-muted text-xs hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10"
                    >
                      <div className="flex items-center gap-2 text-main">
                         <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                         {piece.trim()}
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted group-hover:text-accent transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Tweak / Remix */}
              <div className="pt-5 border-t border-white/10 no-export">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-3">
                    Remix This Look
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_TWEAKS.map(t => (
                        <button 
                            key={t} 
                            onClick={() => handleRemix(t)} 
                            disabled={remixing} 
                            className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/60 text-[11px] hover:bg-white/10 hover:text-white transition-colors"
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        value={tweakText} 
                        onChange={e => setTweakText(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && tweakText.trim() && handleRemix(tweakText)}
                        placeholder="Type a custom tweak..."
                        className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-main placeholder-muted text-xs outline-none focus:border-accent/30"
                    />
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => handleRemix(tweakText)} 
                        disabled={remixing || !tweakText.trim()}
                        className="px-3"
                    >
                        Remix
                    </Button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 no-export">
              <Button
                onClick={() => onToggleWishlist(outfit)}
                className={`flex-1 gap-2 text-xs py-3 rounded-xl ${isWishlisted ? "bg-accent/20 border-accent/40 text-accent hover:bg-accent/30" : ""}`}
                variant={isWishlisted ? "secondary" : "primary"}
              >
                <Heart className={`w-[14px] h-[14px] ${isWishlisted ? "fill-accent text-accent" : ""}`} />
                {isWishlisted ? "Saved" : "Wishlist"}
              </Button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-xs transition-all"
              >
                <Share2 className="w-[14px] h-[14px]" />
                {shared ? "Copied!" : "Share"}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-xs transition-all"
              >
                <Download className="w-[14px] h-[14px]" />
                Export
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Gallery Page ─────────────────────────────────────────────────────────────
export function GalleryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  const { outfits: stateOutfits, userImage, analysis, quizProfile, occasion } = location.state || {};
  
  const [outfits, setOutfits] = useState(stateOutfits?.length ? stateOutfits : MOCK_OUTFITS);
  const [selectedIdx, setSelectedIdx] = useState(null);
  
  const selectedOutfit = selectedIdx !== null ? outfits[selectedIdx] : null;

  const handleRemix = async (originalOutfit, tweakInstruction) => {
      const remixed = await remixOutfit(originalOutfit, tweakInstruction, analysis, quizProfile);
      setOutfits(prev => prev.map(o => o.id === originalOutfit.id ? remixed : o));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 text-muted hover:text-main text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Atelier
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/10 pb-8">
          <div>
            <span className="text-muted text-xs uppercase tracking-widest font-semibold">
              {occasion ? `For: ${occasion.slice(0, 60)}` : "Your Curation"}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-main mt-2">Bespoke Looks</h2>
            <p className="font-body text-muted mt-2">
              {stateOutfits
                ? `${outfits.length} outfits crafted specifically for your profile.`
                : "3 curated looks — tap any card to explore details."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/wishlist")}
              className="flex items-center gap-2 text-muted hover:text-main text-sm border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 px-4 py-2.5 rounded-xl transition-all relative"
            >
              <Heart className="w-3.5 h-3.5" />
              Wishlist
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Session
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar: user photo + analysis */}
        {(userImage || analysis) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="xl:col-span-1 flex flex-col gap-5"
          >
            {userImage && (
              <div className="rounded-2xl overflow-hidden border border-white/10 relative">
                <img
                  src={userImage}
                  alt="Your photo"
                  className="w-full object-cover object-top max-h-80 xl:max-h-[440px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white/40 text-xs font-medium tracking-wide">
                  Your Photo
                </span>
              </div>
            )}
            {analysis && <AnalysisPanel analysis={analysis} />}
            {quizProfile && (
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-white/35 text-[10px] uppercase tracking-widest font-semibold mb-3">
                  Quiz Profile
                </p>
                <div className="space-y-2">
                  {Object.entries(quizProfile).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-white/35 capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-white/75 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Outfit cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
            userImage || analysis ? "xl:col-span-3" : "xl:col-span-4"
          }`}
        >
          {outfits.map((outfit, idx) => {
            const wishlisted = isWishlisted(outfit.id);
            return (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.55, ease: "easeOut" }}
              >
                <GlassCard hoverable className="h-full flex flex-col group relative">
                  {/* Wishlist heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(outfit); }}
                    className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur border flex items-center justify-center transition-all duration-200
                      ${wishlisted
                        ? "bg-accent/20 border-accent/40 hover:bg-accent/30"
                        : "bg-surface/40 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${wishlisted ? "text-accent fill-accent scale-110" : "text-muted"}`}
                    />
                  </button>

                  {/* Image */}
                  <div
                    className="w-full aspect-[3/4] mb-5 rounded-xl overflow-hidden relative cursor-pointer"
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <img
                      src={OUTFIT_IMAGES[idx % OUTFIT_IMAGES.length]}
                      alt={outfit.title}
                      className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                      {outfit.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] uppercase font-bold tracking-widest text-white/80 bg-black/55 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-display text-xl text-main mb-2">{outfit.title}</h3>
                    <p className="font-body text-muted text-sm leading-relaxed flex-1">{outfit.desc}</p>

                    {outfit.why_it_works && (
                      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/8 flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-muted text-xs leading-relaxed italic">
                          {outfit.why_it_works}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="secondary"
                      className="w-full mt-5"
                      onClick={() => setSelectedIdx(idx)}
                    >
                      View Details
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <OutfitDetailModal
            outfit={selectedOutfit}
            imageUrl={OUTFIT_IMAGES[selectedIdx % OUTFIT_IMAGES.length]}
            isWishlisted={isWishlisted(selectedOutfit.id)}
            onToggleWishlist={toggleWishlist}
            onRemix={handleRemix}
            onClose={() => setSelectedIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
