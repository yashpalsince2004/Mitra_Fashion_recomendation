import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ExternalLink, X, Loader2, ImageOff } from "lucide-react";
import { fadeUp, staggerContainer, cardHover, modalAnimation } from "../../utils/animations";

/**
 * InspirationGrid — Displays fashion images from Unsplash in a masonry-style grid
 * with hover effects, lightbox modal, and proper Unsplash attribution.
 *
 * @param {{ images: Array, isLoading: boolean, query: string }} props
 */
export function InspirationGrid({ images = [], isLoading = false, query = "" }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const lightboxImage = lightboxIdx !== null ? images[lightboxIdx] : null;

  const handleImageLoad = (idx) => {
    setLoadedImages((prev) => new Set([...prev, idx]));
  };

  // ── Empty / Loading states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full">
        <SectionHeader query={query} count={0} loading />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-surface-low border ghost-border animate-pulse border ghost-border"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!images.length) return null;

  // ── Main grid ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <SectionHeader query={query} count={images.length} />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            variants={{ ...fadeUp, ...cardHover }}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border ghost-border hover:border-accent/30 transition-all duration-300"
          >
            {/* Loading skeleton */}
            {!loadedImages.has(idx) && (
              <div
                className="absolute inset-0 bg-surface-low border ghost-border animate-pulse flex items-center justify-center"
                style={{ backgroundColor: img.color || "rgba(255,255,255,0.05)" }}
              >
                <Loader2 className="w-5 h-5 text-muted animate-spin" />
              </div>
            )}

            {/* Image */}
            <img
              src={img.imageUrl}
              alt={img.altDescription || "Fashion inspiration"}
              className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 ${
                loadedImages.has(idx) ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(idx)}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Attribution overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-muted shrink-0" />
                <a
                  href={img.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted text-[10px] font-medium tracking-wide hover:text-main truncate transition-colors"
                >
                  {img.photographer}
                </a>
              </div>
            </div>

            {/* Zoom hint */}
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border ghost-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-3 h-3 text-muted" />
            </div>
          </motion.div>
        ))}
      </motion.div>


      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            image={lightboxImage}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((i) => (i > 0 ? i - 1 : images.length - 1))}
            onNext={() => setLightboxIdx((i) => (i < images.length - 1 ? i + 1 : 0))}
            current={lightboxIdx + 1}
            total={images.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ query, count, loading }) {
  return (
    <div className="flex items-end justify-between mb-5 border-b ghost-border pb-4">
      <div>
        <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
          {loading ? "Searching..." : "Style Inspiration"}
        </p>
        <h3 className="font-display text-lg md:text-xl text-main">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Finding looks for you…
            </span>
          ) : (
            `${count} looks found`
          )}
        </h3>
      </div>
      {query && !loading && (
        <span className="text-muted text-[10px] tracking-wider uppercase hidden md:block max-w-[200px] truncate">
          {query}
        </span>
      )}
    </div>
  );
}

// ─── Lightbox Modal ──────────────────────────────────────────────────────────
function Lightbox({ image, onClose, onPrev, onNext, current, total }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border ghost-border"
        style={{ background: "var(--surface-low)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-surface-low border ghost-border border ghost-border backdrop-blur flex items-center justify-center hover:bg-surface-low border ghost-border transition-colors"
        >
          <X className="w-5 h-5 text-main" />
        </button>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden border ghost-border flex-1 min-h-0">
          <img
            src={image.regularUrl || image.imageUrl}
            alt={image.altDescription || "Fashion inspiration"}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-muted" />
            <a
              href={image.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted text-xs font-medium hover:text-main transition-colors"
            >
              {image.photographer}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="text-muted hover:text-main text-xs px-3 py-1.5 rounded-full border ghost-border hover:ghost-border transition-all"
            >
              ← Prev
            </button>
            <span className="text-muted text-[10px] tracking-widest">
              {current} / {total}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="text-muted hover:text-main text-xs px-3 py-1.5 rounded-full border ghost-border hover:ghost-border transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
