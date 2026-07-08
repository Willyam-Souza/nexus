import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CategoryChart({ tasks, categories }) {
  if (tasks.length === 0) return null;

  const data = categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    total: tasks.filter((t) => t.category?.id === cat.id).length,
  }));

  const withoutCategory = tasks.filter((t) => !t.category).length;
  if (withoutCategory > 0) {
    data.push({ name: "Sem categoria", color: "#71717a", total: withoutCategory });
  }

  return (
    <div className="mb-8 rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Tarefas por categoria</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: 14,
              fontSize: 12,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
            cursor={{ fill: "var(--color-fill)" }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
