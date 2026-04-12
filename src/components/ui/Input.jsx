import { cn } from "../../utils/cn";

export function Input({ className, label, ...props }) {
  return (
    <div className="flex flex-col gap-2 relative group w-full">
      {label && <label className="text-xs uppercase tracking-wider text-neutral/70 font-medium">{label}</label>}
      <input
        className={cn(
          "bg-transparent border-b border-white/15 px-0 py-3 text-white placeholder-white/30 text-base font-body outline-none transition-all duration-400 focus:border-white/50 focus:bg-white/5",
          className
        )}
        {...props}
      />
    </div>
  );
}
