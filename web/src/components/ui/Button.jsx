import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Button({ children, loading, variant = "primary", className, ...props }) {
  const base =
    "relative w-full flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent-start text-white hover:brightness-110",
    ghost: "text-text-primary bg-fill hover:bg-fill-strong",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
      disabled={loading}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </motion.button>
  );
}
