import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Select from '../ui/Select'

const EASE = [0.32, 0.72, 0, 1]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
]

function toDateInputValue(isoString) {
  if (!isoString) return ''
  return isoString.slice(0, 10)
}

const emptyForm = { title: '', description: '', priority: 'MEDIUM', categoryId: '', dueDate: '' }

export function TaskFormModal({ open, onClose, onSubmit, task, categories }) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!task

  useEffect(() => {
    if (!open) return
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        categoryId: task.category?.id || '',
        dueDate: toDateInputValue(task.dueDate),
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, task])

  const categoryOptions = [
    { value: '', label: 'Sem categoria' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name, swatch: cat.color })),
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    try {
      setSubmitting(true)
      await onSubmit({
        title: form.title,
        description: form.description,
        priority: form.priority,
        categoryId: form.categoryId || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      })
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
            className="relative w-full max-w-md rounded-[2rem] border border-border-subtle bg-surface p-7 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-text-muted transition-colors duration-200 hover:bg-fill hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Título"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Ex: Preparar apresentação"
              />

              <div className="w-full">
                <label className="mb-2 block text-sm text-text-muted">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Detalhes da tarefa (opcional)"
                  className="w-full rounded-2xl bg-fill px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors duration-200 focus:ring-2 focus:ring-accent-start/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Prioridade"
                  value={form.priority}
                  onChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}
                  options={PRIORITY_OPTIONS}
                />
                <Select
                  label="Categoria"
                  value={form.categoryId}
                  onChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
                  options={categoryOptions}
                  placeholder="Sem categoria"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-text-muted">Data de entrega</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-2xl bg-fill px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 focus:ring-2 focus:ring-accent-start/40"
                />
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
                  {isEditing ? 'Guardar Alterações' : 'Criar Tarefa'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
