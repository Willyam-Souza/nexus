import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Calendar, Tag, Pencil, Trash2 } from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "../../lib/utils";

const priorityStyles = {
  HIGH: "bg-danger/10 text-danger",
  MEDIUM: "bg-warning/10 text-warning",
  LOW: "bg-success/10 text-success",
};

export function TaskCard({ task, onToggle, onEdit, onDelete, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group flex touch-none flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-shadow duration-200 hover:shadow-md",
        isOverlay && "rotate-2 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task);
          }}
          className={cn(
            "mt-0.5 flex-shrink-0 transition-colors duration-200",
            task.status === "COMPLETED" ? "text-success" : "text-text-muted/40 hover:text-success"
          )}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <p className={cn("font-medium text-text-primary", task.status === "COMPLETED" && "text-text-muted line-through")}>
            {task.title}
          </p>
          {task.description && <p className="mt-1 text-sm text-text-muted">{task.description}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {!isOverlay && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="rounded-full p-1.5 text-text-muted transition-colors duration-150 hover:bg-fill hover:text-text-primary"
                aria-label="Editar tarefa"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
                className="rounded-full p-1.5 text-text-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
                aria-label="Apagar tarefa"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", priorityStyles[task.priority] ?? priorityStyles.MEDIUM)}>
            {task.priority}
          </span>
        </div>
      </div>

      {(task.category || task.dueDate) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {task.category && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${task.category.color}1A`, color: task.category.color }}
            >
              <Tag className="h-3 w-3" /> {task.category.name}
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs",
                isPast(new Date(task.dueDate)) && task.status !== "COMPLETED" ? "text-danger" : "text-text-muted"
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "d 'de' MMM", { locale: ptBR })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
