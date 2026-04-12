import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

const MOCK_OUTFITS = [
  { id: 1, title: 'Midnight Velvet', desc: 'A deep navy double-breasted jacket paired with wide-leg trousers.', tags: ['Formal', 'Winter'] },
  { id: 2, title: 'Silent Architecture', desc: 'Structured white silk blouse with an asymmetrical wrap skirt.', tags: ['Minimalist', 'Civic'] },
  { id: 3, title: 'Urban Daze', desc: 'Oversized trench over a mock-neck knit and relaxed denim.', tags: ['Streetwear', 'Casual'] }
];

export function GalleryPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h2 className="font-display text-4xl text-white mb-3">Your Curation</h2>
        <p className="font-body text-white/60">Based on your input, we selected 3 bespoke looks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_OUTFITS.map((outfit, idx) => (
          <motion.div 
            key={outfit.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            <GlassCard hoverable className="h-full flex flex-col group">
              <div className="w-full bg-[#0a0f1c] aspect-[3/4] mb-6 rounded-lg overflow-hidden relative">
                 {/* Placeholder for AI mapped image */}
                 <div className="absolute inset-0 flex items-center justify-center text-white/20 font-body text-sm uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">
                    <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop`} alt="Fashion" className="object-cover w-full h-full opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all" />
                 </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex gap-2 mb-3 mt-auto">
                    {outfit.tags.map(t => (
                        <span key={t} className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                            {t}
                        </span>
                    ))}
                </div>
                <h3 className="font-display text-xl text-white mb-2">{outfit.title}</h3>
                <p className="font-body text-white/60 text-sm leading-relaxed mb-6">{outfit.desc}</p>
                <Button variant="secondary" className="w-full mt-auto">View Details</Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
