import { Plus, Search } from "lucide-react";
import { cn } from "../../lib/utils";

export function TaskFilters({ search, onSearchChange, categories, activeCategoryId, onCategoryChange, onCreateCategory }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar tarefas..."
          className="w-full rounded-full border border-transparent bg-fill py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors duration-200 focus:border-accent-start"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill active={activeCategoryId === null} onClick={() => onCategoryChange(null)}>
          Todas
        </Pill>
        {categories.map((cat) => (
          <Pill
            key={cat.id}
            active={activeCategoryId === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            dotColor={cat.color}
          >
            {cat.name}
          </Pill>
        ))}
        <button
          onClick={onCreateCategory}
          className="flex items-center gap-1 rounded-full bg-fill px-3 py-1.5 text-xs font-medium text-text-muted transition-colors duration-200 hover:text-text-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Nova categoria
        </button>
      </div>
    </div>
  );
}

function Pill({ active, onClick, children, dotColor }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
        active ? "bg-accent-start text-white" : "bg-fill text-text-muted hover:text-text-primary"
      )}
    >
      {dotColor && (
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: active ? "#fff" : dotColor }} />
      )}
      {children}
    </button>
  );
}
