import { cn } from "../../utils/cn";

export function Input({ className, label, variant = "default", ...props }) {
  const variants = {
    // Bottom border only — original pill-less style
    default:
      "bg-transparent border-b border-black/15 dark:border-white/15 px-0 py-3 text-main placeholder-muted text-base font-body outline-none transition-all duration-300 focus:border-black/50 dark:focus:border-white/50 w-full",
    box:
      "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3.5 text-main placeholder-muted text-sm font-body outline-none transition-all duration-300 focus:border-black/25 dark:focus:border-white/25 focus:bg-black/5 dark:focus:bg-white/8",
  };

  return (
    <div className="flex flex-col gap-2 relative group w-full">
      {label && (
        <label className="text-xs uppercase tracking-wider text-white/50 font-medium">
          {label}
        </label>
      )}
      <input
        className={cn(variants[variant], className)}
        {...props}
      />
    </div>
  );
}
