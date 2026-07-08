import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

const EASE = [0.32, 0.72, 0, 1];

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirmar", onConfirm, onCancel, danger = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-fill"
              >
                Cancelar
              </button>
              <Button
                type="button"
                onClick={onConfirm}
                className={danger ? "w-auto px-5 bg-danger hover:brightness-110" : "w-auto px-5"}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
