import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export function GlassCard({ className, children, hoverable = false, asMotion = false, ...props }) {
  const Component = asMotion ? motion.div : "div";

  return (
    <Component
      className={cn(
        "bg-[#131b2e] rounded-xl p-6 overflow-hidden", // surface-container-low
        hoverable && "transition-colors duration-400 hover:bg-[#2d3449]", // surface-container-highest
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
