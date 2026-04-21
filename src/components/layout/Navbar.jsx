import { Link, useLocation } from "react-router-dom";
import { Sparkles, Heart, Wand2 } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";

export function Navbar() {
  const location = useLocation();
  const { wishlist } = useWishlist();
  const count = wishlist.length;

  const navLinks = [
    { to: "/quiz", label: "Style Quiz", icon: Wand2 },
    { to: "/gallery", label: "Gallery", icon: null },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 h-20 glass-drawer z-50 flex items-center justify-between px-6 lg:px-14 border-b border-black/5 dark:ghost-border">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-full bg-silk-gradient opacity-10 flex items-center justify-center border border-accent/20 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]">
          <Sparkles className="text-accent w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-semibold text-sm tracking-widest uppercase text-main">
            The Mitra
          </span>
          <span className="font-display text-[10px] tracking-[0.25em] uppercase text-muted">
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
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-main hover:bg-black/5 dark:hover:bg-surface-low border ghost-border"
                }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side: Wishlist */}
      <div className="flex items-center gap-4">

        <Link
          to="/wishlist"
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:ghost-border hover:border-black/20 dark:hover:ghost-border hover:bg-black/5 dark:hover:bg-surface-low border ghost-border transition-all text-muted hover:text-main text-sm group"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              count > 0 ? "text-accent fill-accent" : "group-hover:text-accent"
            }`}
          />
          <span className="hidden sm:block">Wishlist</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent border-2 border-surface text-main text-[10px] font-bold flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
