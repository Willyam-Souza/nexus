import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const EASE = [0.32, 0.72, 0, 1]

// Paleta inspirada nas etiquetas de cor do macOS Finder/Lembretes
const COLOR_SWATCHES = [
  '#FF3B30', '#FF9F0A', '#FFD60A', '#30D158',
  '#0071E3', '#5E5CE6', '#BF5AF2', '#8E8E93',
]

export function CategoryFormModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_SWATCHES[4])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setColor(COLOR_SWATCHES[4])
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSubmitting(true)
      await onSubmit({ name, color })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-[2rem] border border-border-subtle bg-surface p-7 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Nova Categoria</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-text-muted transition-colors duration-200 hover:bg-fill hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Trabalho"
              />

              <div>
                <label className="mb-2 block text-sm text-text-muted">Cor</label>
                <div className="flex flex-wrap gap-2.5">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => setColor(swatch)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
                      style={{ backgroundColor: swatch }}
                    >
                      {color === swatch && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-fill"
                >
                  Cancelar
                </button>
                <Button type="submit" loading={submitting} className="w-auto px-5">
                  Criar Categoria
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
