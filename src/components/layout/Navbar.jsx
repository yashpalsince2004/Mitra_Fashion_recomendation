import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-24 glass-drawer z-50 flex items-center justify-between px-8 lg:px-16 border-b border-white/5">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-medium text-base tracking-widest uppercase">The Digital</span>
          <span className="font-display text-xs tracking-[0.2em] uppercase text-white/50">Atelier</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        {/* We can add profile or session info here later */}
      </div>
    </nav>
  );
}
