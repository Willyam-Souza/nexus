import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Em produção (Vercel), defina VITE_API_URL apontando para o backend hospedado.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
})

// Interceptor: injeta o Bearer Token em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@TaskManager:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: se o token expirou/é inválido, limpa a sessão e manda para o login
// de qualquer página, sem cada componente precisar tratar 401 manualmente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)