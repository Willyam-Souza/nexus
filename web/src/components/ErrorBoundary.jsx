import { Component } from 'react'

/**
 * Rede de segurança: sem isto, qualquer erro não tratado durante a renderização
 * (incluindo interferência inofensiva de extensões do browser no DOM, como o
 * Grammarly) derruba a aplicação inteira e deixa só o fundo preto do body à mostra.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Erro não tratado capturado pela ErrorBoundary:', error)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
          <p className="text-lg font-semibold text-text-primary">Ocorreu um erro inesperado.</p>
          <p className="text-sm text-text-muted">Tente recarregar a página.</p>
          <button
            onClick={this.handleReload}
            className="rounded-full bg-accent-start px-5 py-2.5 text-sm font-semibold text-white"
          >
            Recarregar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
