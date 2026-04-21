import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export function GlassCard({ className, children, hoverable = false, asMotion = false, ...props }) {
  const Component = asMotion ? motion.div : "div";

  return (
    <Component
      className={cn(
        "bg-surface-container-low rounded-xl p-6 overflow-hidden border border-black/5 dark:ghost-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        hoverable && "transition-all duration-400 hover:bg-surface-container-high hover:shadow-[0_15px_40px_rgb(0,0,0,0.16)] hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
