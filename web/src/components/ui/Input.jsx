import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Input({ label, icon: Icon, error, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      <label className="block text-sm text-text-muted mb-2">
        {label}
      </label>

      <div
        className={cn(
          "flex items-center rounded-2xl border bg-fill transition-colors duration-200",
          error ? "border-danger/60" : "border-transparent focus-within:border-accent-start"
        )}
      >
        {Icon && <Icon className="w-4 h-4 text-text-muted ml-4 flex-shrink-0" />}
        <input
          {...props}
          type={inputType}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          className="w-full min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/60 outline-none"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="mr-4 flex-shrink-0 text-text-muted transition-colors hover:text-text-primary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
