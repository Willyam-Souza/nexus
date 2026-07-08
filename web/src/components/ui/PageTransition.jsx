import { motion } from "framer-motion";

/**
 * Fade+scale só na ENTRADA da página (sem exit coreografado com AnimatePresence).
 * Tentámos animar a saída em conjunto com o React Router e isso deixava a navegação
 * presa a meio em alguns casos — mais vale uma transição simples e confiável.
 * Anima só transform (scale) e opacity para ficar composta na GPU.
 */
const variants = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } },
};

export function PageTransition({ children, className }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" className={className}>
      {children}
    </motion.div>
  );
}
