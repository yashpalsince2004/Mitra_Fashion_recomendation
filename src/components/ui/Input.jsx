import { cn } from "../../utils/cn";

export function Input({ className, label, variant = "default", ...props }) {
  const variants = {
    // Bottom border only — original pill-less style
    default:
      "bg-transparent border-b border-black/15 dark:ghost-border px-0 py-3 text-main placeholder-muted text-base font-body outline-none transition-all duration-300 focus:border-black/50 dark:focus:ghost-border w-full",
    box:
      "w-full bg-black/5 dark:bg-surface-low border ghost-border border border-black/10 dark:ghost-border rounded-2xl px-5 py-3.5 text-main placeholder-muted text-sm font-body outline-none transition-all duration-300 focus:border-black/25 dark:focus:ghost-border focus:bg-black/5 dark:focus:bg-surface-low border ghost-border",
  };

  return (
    <div className="flex flex-col gap-2 relative group w-full">
      {label && (
        <label className="text-xs uppercase tracking-wider text-muted font-medium">
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
