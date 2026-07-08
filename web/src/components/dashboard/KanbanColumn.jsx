import { useDroppable } from "@dnd-kit/core";
import { cn } from "../../lib/utils";

export function KanbanColumn({ id, title, count, accent, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-3xl border p-4 transition-colors duration-200",
        isOver ? "border-accent-start/50 bg-accent-start/[0.04]" : "border-border-subtle bg-fill/40"
      )}
    >
      <div className="mb-4 flex items-center justify-between px-2 pt-1">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", accent)}>{count}</span>
      </div>
      <div className="flex min-h-[100px] flex-col gap-3">{children}</div>
    </div>
  );
}
