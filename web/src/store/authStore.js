import { create } from "zustand";

const TOKEN_KEY = "@TaskManager:token";

/**
 * Fonte única de verdade para o estado de autenticação.
 * Mantém a mesma chave de localStorage que o api.js já lia,
 * para não quebrar o interceptor existente.
 */
export const useAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  login: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, isAuthenticated: false });
  },
}));
