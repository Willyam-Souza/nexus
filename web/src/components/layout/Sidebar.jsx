import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { cn } from "../../lib/utils";

export function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-border-subtle bg-surface/70 backdrop-blur-xl">
      <div className="p-6">
        <Logo size={36} />
      </div>

      <nav className="flex-1 px-4">
        <a
          href="#"
          className="flex items-center gap-3 rounded-2xl bg-accent-start/10 px-4 py-3 text-sm font-semibold text-accent-start"
        >
          <LayoutDashboard className="h-4 w-4" />
          O Meu Dia
        </a>
      </nav>

      <div className="space-y-3 border-t border-border-subtle p-4">
        <div className="flex items-center gap-1 rounded-full bg-fill p-1">
          <ThemeOption
            active={theme === "light"}
            onClick={() => theme !== "light" && toggleTheme()}
            icon={Sun}
            label="Claro"
          />
          <ThemeOption
            active={theme === "dark"}
            onClick={() => theme !== "dark" && toggleTheme()}
            icon={Moon}
            label="Escuro"
          />
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}

function ThemeOption({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-colors duration-200",
        active ? "bg-surface-raised text-text-primary shadow-sm" : "text-text-muted"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
