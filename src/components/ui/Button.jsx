import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'default',
  children,
  ...props 
}) {
  const variants = {
    primary: "bg-silk-gradient text-main shadow-lg hover:brightness-110 active:brightness-95",
    secondary: "glass text-main ghost-border hover:bg-black/5 dark:hover:bg-surface-low border ghost-border",
    tertiary: "text-accent border-b border-transparent hover:border-accent rounded-none px-0 py-1"
  };

  const sizes = {
    default: "px-6 py-3 text-sm rounded-xl font-medium",
    sm: "px-4 py-2 text-xs rounded-lg",
    lg: "px-8 py-4 text-base rounded-2xl font-semibold",
    icon: "p-3 rounded-full"
  };

  const finalSize = variant === 'tertiary' ? '' : sizes[size];

  return (
    <motion.button 
      whileHover={{ scale: variant === 'tertiary' ? 1.02 : 1.05 }}
      whileTap={{ scale: variant === 'tertiary' ? 0.98 : 0.95 }}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-400 ease-out",
        variants[variant],
        finalSize,
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
