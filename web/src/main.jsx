import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

// Extensões de browser (Grammarly, tradutores, gerenciadores de senha) reparentam/movem
// nós dentro dos campos de formulário por fora do controlo do React. O erro acontece
// dentro do próprio commit interno do React, antes de virar um "erro global" — por isso
// window.addEventListener('error') não adianta aqui.
//
// Corrige deixando o browser tentar normalmente e só engolindo o NotFoundError exato
// quando ele acontece — nunca pré-adivinhando se a operação vai falhar. Uma versão
// anterior fazia essa adivinhação (checando child.parentNode antes de chamar) e isso
// quebrava navegações legítimas do React Router, cancelando inserções reais no DOM.
// (Workaround conhecido para este conflito específico — ver facebook/react#11538)
const originalRemoveChild = Node.prototype.removeChild
Node.prototype.removeChild = function (child) {
  try {
    return originalRemoveChild.call(this, child)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return child
    }
    throw error
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)