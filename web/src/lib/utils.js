import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 * Ex: cn("px-2", condition && "px-4") -> resultado correto sem duplicar padding.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
