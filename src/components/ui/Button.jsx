export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-inter font-medium transition-all duration-200 cursor-pointer disabled:opacity-50";
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-surface-high text-primary hover:bg-surface dark:bg-surface-low dark:hover:bg-surface-high",
    ghost: "text-on-surface-variant hover:bg-surface-low",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}