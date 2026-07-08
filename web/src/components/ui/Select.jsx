import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const EASE = [0.32, 0.72, 0, 1];

/**
 * Dropdown totalmente controlado por nós (trigger + painel), em vez do <select>
 * nativo. O <select> nativo delega o desenho das opções ao sistema operativo,
 * que ignora a maior parte do nosso CSS — foi isso que deixava o texto de
 * "Baixa"/"Média"/"Alta" invisível (texto claro do dark mode sobre o fundo
 * claro que o Windows usa para o popup nativo). Aqui controlamos os dois lados.
 */
export default function Select({ label, value, onChange, options, placeholder = "Selecionar" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm text-text-muted">{label}</label>}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl bg-fill px-4 py-3 text-left text-sm text-text-primary outline-none transition-colors duration-200 focus:ring-2 focus:ring-accent-start/40"
        >
          <span className={cn(!selected && "text-text-muted/60")}>{selected ? selected.label : placeholder}</span>
          <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform duration-200", open && "rotate-180")} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15, ease: EASE }}
              style={{ transformOrigin: "top" }}
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised p-1.5 shadow-xl"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150",
                    opt.value === value ? "text-accent-start font-medium" : "text-text-primary hover:bg-fill"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.swatch && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: opt.swatch }} />}
                    {opt.label}
                  </span>
                  {opt.value === value && <Check className="h-4 w-4" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
