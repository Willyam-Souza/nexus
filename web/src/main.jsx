import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

// Extensões de browser (Grammarly, tradutores, gerenciadores de senha) mexem no DOM
// dos campos de formulário por fora do controlo do React. Quando o React tenta depois
// reconciliar essa área, o browser lança um NotFoundError em removeChild/insertBefore
// que é inofensivo para o estado da aplicação — mas sem isto ele derrubava o ecrã todo.
window.addEventListener('error', (event) => {
  const message = event.message || ''
  if (message.includes('removeChild') || message.includes('insertBefore')) {
    event.preventDefault()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)