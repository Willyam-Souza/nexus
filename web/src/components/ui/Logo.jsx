import { cn } from "../../lib/utils";

/**
 * Marca "Nexus": um hub central ligado a três nós — a metáfora visual do nome
 * (nexus = ponto de ligação). Traço sólido monocromático, sem neon.
 */
export function Logo({ className, iconOnly = false, size = 40 }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="38" height="38" rx="11" className="fill-surface-raised" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-primary">
          <line x1="20" y1="21" x2="20" y2="12" />
          <line x1="20" y1="21" x2="13" y2="27" />
          <line x1="20" y1="21" x2="27" y2="27" />
        </g>
        <circle cx="20" cy="12" r="2" className="fill-text-primary" />
        <circle cx="13" cy="27" r="2" className="fill-text-primary" />
        <circle cx="27" cy="27" r="2" className="fill-text-primary" />
        <circle cx="20" cy="21" r="2.6" className="fill-accent-start" />
      </svg>

      {!iconOnly && (
        <span className="text-lg font-semibold tracking-tight text-text-primary">Nexus</span>
      )}
    </div>
  );
}
