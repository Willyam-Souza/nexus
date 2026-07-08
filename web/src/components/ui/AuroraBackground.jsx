import { useThemeStore } from "../../store/themeStore";

/**
 * Fundo com manchas de gradiente suaves, à imagem das páginas de produto da Apple.
 * A deriva usa animação CSS pura (ver index.css) em vez de Framer Motion: assim o
 * browser trata isto fora da thread principal do React, o que importa porque estes
 * blobs ficam por baixo de cartões com backdrop-blur — sem isto, cada frame forçaria
 * um re-blur completo do ecrã.
 */
export default function AuroraBackground() {
  const theme = useThemeStore((state) => state.theme);
  const blobOpacity = theme === "light" ? 0.35 : 0.22;

  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-background">
      <div
        className="animate-drift-a absolute left-1/4 top-1/4 h-[480px] w-[480px] rounded-full blur-[120px]"
        style={{ background: "var(--color-accent-start)", opacity: blobOpacity }}
      />
      <div
        className="animate-drift-b absolute right-1/4 bottom-1/4 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: theme === "light" ? "#bf5af2" : "#5e5ce6", opacity: blobOpacity * 0.8 }}
      />
    </div>
  );
}
