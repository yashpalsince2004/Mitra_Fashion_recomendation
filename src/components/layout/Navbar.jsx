import { Link, useLocation } from "react-router-dom";
import { Sparkles, Heart, Wand2 } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";

export function Navbar() {
  const location = useLocation();
  const { wishlist } = useWishlist();
  const count = wishlist.length;

  const navLinks = [
    { to: "/quiz", label: "Style Quiz", icon: Wand2 },
    { to: "/chat", label: "Atelier", icon: null },
    { to: "/gallery", label: "Gallery", icon: null },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 h-20 glass-drawer z-50 flex items-center justify-between px-6 lg:px-14 border-b border-white/5">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
          <Sparkles className="text-white w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-semibold text-sm tracking-widest uppercase text-white">
            The Digital
          </span>
          <span className="font-display text-[10px] tracking-[0.25em] uppercase text-white/40">
            Atelier
          </span>
        </div>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? "bg-white/8 text-white border border-white/10"
                  : "text-white/45 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: Wishlist */}
      <Link
        to="/wishlist"
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-white/50 hover:text-white text-sm group"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            count > 0 ? "text-accent fill-accent" : "group-hover:text-white/80"
          }`}
        />
        <span className="hidden sm:block">Wishlist</span>
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent border-2 border-[#0b1326] text-white text-[10px] font-bold flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </nav>
  );
}
