import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { PlusCircle, CheckCircle2, Clock, ListTodo, TrendingUp, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { cn } from '../lib/utils'
import { Sidebar } from '../components/layout/Sidebar'
import { TaskFilters } from '../components/dashboard/TaskFilters'
import { CategoryChart } from '../components/dashboard/CategoryChart'
import { KanbanColumn } from '../components/dashboard/KanbanColumn'
import { TaskCard } from '../components/dashboard/TaskCard'
import { TaskFormModal } from '../components/dashboard/TaskFormModal'
import { CategoryFormModal } from '../components/dashboard/CategoryFormModal'
import Button from '../components/ui/Button'
import { PageTransition } from '../components/ui/PageTransition'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

const EASE = [0.32, 0.72, 0, 1]

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
}

export function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [taskPendingDelete, setTaskPendingDelete] = useState(null)

  const [search, setSearch] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Guarda contra o duplo-disparo do StrictMode em dev: sem isto, o efeito corre
  // duas vezes de seguida e a segunda chamada, por vezes, esbarra num 403
  // transitório no backend — dava um toast de erro mesmo com os dados já carregados.
  const didFetchRef = useRef(false)
  useEffect(() => {
    if (didFetchRef.current) return
    didFetchRef.current = true
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksResponse, categoriesResponse] = await Promise.all([
        api.get('/tasks'),
        api.get('/categories'),
      ])
      setTasks(tasksResponse.data)
      setCategories(categoriesResponse.data)
    } catch (error) {
      toast.error('Não foi possível carregar as suas tarefas.')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleSubmitTask = async (payload) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload)
        toast.success('Tarefa atualizada com sucesso!')
      } else {
        await api.post('/tasks', payload)
        toast.success('Tarefa criada com sucesso!')
      }
      fetchData()
    } catch (error) {
      toast.error(editingTask ? 'Erro ao atualizar a tarefa.' : 'Erro ao criar a tarefa.')
      throw error
    }
  }

  const handleToggleTaskStatus = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'

    // Atualização otimista: a UI responde na hora, sem esperar a rede
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))

    try {
      await api.patch(`/tasks/${task.id}`, { status: newStatus })
    } catch (error) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)))
      toast.error('Não foi possível atualizar a tarefa.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!taskPendingDelete) return
    const task = taskPendingDelete
    setTaskPendingDelete(null)

    setTasks((prev) => prev.filter((t) => t.id !== task.id))

    try {
      await api.delete(`/tasks/${task.id}`)
      toast.success('Tarefa apagada.')
    } catch (error) {
      setTasks((prev) => [...prev, task])
      toast.error('Não foi possível apagar a tarefa.')
    }
  }

  const handleCreateCategory = async ({ name, color }) => {
    try {
      await api.post('/categories', { name, color })
      toast.success('Categoria criada com sucesso!')
      fetchData()
    } catch (error) {
      toast.error('Erro ao criar a categoria.')
      throw error
    }
  }

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const task = tasks.find((t) => t.id === active.id)
    if (!task || task.status === over.id) return

    handleToggleTaskStatus(task)
  }

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length
  const productivity = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  const stats = [
    { label: 'Total de tarefas', value: tasks.length, icon: ListTodo, tone: 'text-accent-start' },
    { label: 'Pendentes', value: pendingCount, icon: Clock, tone: 'text-warning' },
    { label: 'Concluídas', value: completedCount, icon: CheckCircle2, tone: 'text-success' },
    { label: 'Produtividade', value: `${productivity}%`, icon: TrendingUp, tone: 'text-accent-start' },
  ]

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategoryId || task.category?.id === activeCategoryId
    return matchesSearch && matchesCategory
  })

  return (
    <PageTransition className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 lg:p-10">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary">O Meu Dia</h1>
            <p className="mt-2 text-[15px] text-text-muted">Organize as suas prioridades para hoje.</p>
          </div>
          <Button onClick={openCreateModal} className="w-auto px-5">
            <PlusCircle className="h-4 w-4" /> Nova Tarefa
          </Button>
        </header>

        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className={cn('mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fill', stat.tone)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <CategoryChart tasks={tasks} categories={categories} />

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
          onCreateCategory={() => setIsCategoryModalOpen(true)}
        />

        {loading ? (
          <div className="py-20 text-center text-text-muted">A carregar tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border-subtle py-20 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-text-muted" />
            <p className="font-medium text-text-primary">Tudo limpo por aqui!</p>
            <p className="mt-1 text-sm text-text-muted">Crie a sua primeira tarefa no botão acima.</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border-subtle py-20 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-text-muted" />
            <p className="font-medium text-text-primary">Nenhuma tarefa encontrada.</p>
            <p className="mt-1 text-sm text-text-muted">Tente ajustar a pesquisa ou o filtro de categoria.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <KanbanColumn
                id="PENDING"
                title="Pendente"
                count={filteredTasks.filter((t) => t.status === 'PENDING').length}
                accent="bg-warning/10 text-warning"
              >
                <motion.div variants={listVariants} initial="hidden" animate="visible" className="contents">
                  <AnimatePresence>
                    {filteredTasks
                      .filter((t) => t.status === 'PENDING')
                      .map((task) => (
                        <motion.div key={task.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                          <TaskCard
                            task={task}
                            onToggle={handleToggleTaskStatus}
                            onEdit={openEditModal}
                            onDelete={setTaskPendingDelete}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              </KanbanColumn>

              <KanbanColumn
                id="COMPLETED"
                title="Concluída"
                count={filteredTasks.filter((t) => t.status === 'COMPLETED').length}
                accent="bg-success/10 text-success"
              >
                <motion.div variants={listVariants} initial="hidden" animate="visible" className="contents">
                  <AnimatePresence>
                    {filteredTasks
                      .filter((t) => t.status === 'COMPLETED')
                      .map((task) => (
                        <motion.div key={task.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                          <TaskCard
                            task={task}
                            onToggle={handleToggleTaskStatus}
                            onEdit={openEditModal}
                            onDelete={setTaskPendingDelete}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              </KanbanColumn>
            </div>

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} onToggle={() => {}} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <TaskFormModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTask}
        task={editingTask}
        categories={categories}
      />

      <CategoryFormModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <ConfirmDialog
        open={!!taskPendingDelete}
        title="Apagar tarefa?"
        description={taskPendingDelete ? `"${taskPendingDelete.title}" será apagada permanentemente.` : ''}
        confirmLabel="Apagar"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskPendingDelete(null)}
      />
    </PageTransition>
  )
}
