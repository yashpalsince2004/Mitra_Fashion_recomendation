import { cn } from "../../utils/cn";

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'default',
  children,
  ...props 
}) {
  const variants = {
    primary: "bg-silk-gradient text-white shadow-lg hover:brightness-110 active:brightness-95",
    secondary: "glass text-white ghost-border hover:bg-white/10",
    tertiary: "text-accent border-b border-transparent hover:border-accent rounded-none px-0 py-1"
  };

  const sizes = {
    default: "px-6 py-3 text-sm rounded-xl font-medium",
    sm: "px-4 py-2 text-xs rounded-lg",
    lg: "px-8 py-4 text-base rounded-2xl font-semibold",
    icon: "p-3 rounded-full"
  };

  // Tertiary gets no layout padding by default beyond its variant definition
  const finalSize = variant === 'tertiary' ? '' : sizes[size];

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center transition-all duration-400 ease-out",
        variants[variant],
        finalSize,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
