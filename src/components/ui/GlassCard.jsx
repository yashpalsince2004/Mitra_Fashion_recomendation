import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export function GlassCard({ className, children, hoverable = false, asMotion = false, ...props }) {
  const Component = asMotion ? motion.div : "div";

  return (
    <Component
      className={cn(
        "bg-surface-container-low rounded-xl p-6 overflow-hidden border border-black/5 dark:border-white/5",
        hoverable && "transition-colors duration-400 hover:bg-surface-container-high",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
