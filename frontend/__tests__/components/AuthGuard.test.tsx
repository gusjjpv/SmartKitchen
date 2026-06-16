import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}))

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/cardapio/restaurante-show' }),
  Navigate: ({ to, state, replace }: any) => (
    <div
      data-testid="mock-navigate"
      data-to={to}
      data-replace={replace ? 'true' : 'false'}
      data-state={JSON.stringify(state)}
    />
  ),
}))

import { AuthGuard } from '../../src/components/AuthGuard'

describe('AuthGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('1. Deve exibir a tela de carregamento quando o estado loading for verdadeiro', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument()
  })

  it('2. Caso de Teste 5: Deve redirecionar para /login se o usuário não estiver logado', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    const navigateElement = screen.getByTestId('mock-navigate')
    expect(navigateElement).toBeInTheDocument()

    expect(navigateElement.getAttribute('data-to')).toBe('/login')
    expect(navigateElement.getAttribute('data-replace')).toBe('true')

    const stateObj = JSON.parse(navigateElement.getAttribute('data-state') || '{}')
    expect(stateObj.from.pathname).toBe('/cardapio/restaurante-show')

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('3. Deve renderizar o AppLayout e os filhos se o usuário estiver autenticado com sucesso', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'admin-99', name: 'Jessica Castro', email: 'jessica@ufersa.edu.br' },
      loading: false,
    })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    expect(screen.getByTestId('app-layout')).toBeInTheDocument()
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.getByText('Painel do Restaurante')).toBeInTheDocument()

    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
