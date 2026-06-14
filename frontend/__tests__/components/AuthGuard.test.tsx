import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// 1. Mock do hook customizado de autenticação
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// 2. Mock do AppLayout para isolar o escopo do teste
vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}))

// 3. Mock das ferramentas de rota para capturar as propriedades de redirecionamento
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
    // Configura o estado simulando que a sessão está sendo verificada na API
    mockUseAuth.mockReturnValue({ user: null, loading: true })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    // Valida se o esqueleto visual e os atributos de acessibilidade estão na tela
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    
    // O conteúdo protegido e o layout não podem vazar enquanto carrega
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument()
  })

  it('2. Caso de Teste 5: Deve redirecionar para /login se o usuário não estiver logado', () => {
    // Configura o estado como carregado, porém sem nenhum usuário autenticado
    mockUseAuth.mockReturnValue({ user: null, loading: false })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    // Captura o componente de navegação interceptado
    const navigateElement = screen.getByTestId('mock-navigate')
    expect(navigateElement).toBeInTheDocument()
    
    // Verifica se os parâmetros de segurança do react-router-dom foram obedecidos
    expect(navigateElement.getAttribute('data-to')).toBe('/login')
    expect(navigateElement.getAttribute('data-replace')).toBe('true')
    
    // Garante que a rota de origem foi salva para que o usuário volte para ela após se logar
    const stateObj = JSON.parse(navigateElement.getAttribute('data-state') || '{}')
    expect(stateObj.from.pathname).toBe('/cardapio/restaurante-show')

    // Certifica-se de que a tela restrita permaneceu bloqueada
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('3. Deve renderizar o AppLayout e os filhos se o usuário estiver autenticado com sucesso', () => {
    // Simula uma sessão ativa do lojista/administrador
    mockUseAuth.mockReturnValue({ 
      user: { id: 'admin-99', name: 'Jessica Castro', email: 'jessica@ufersa.edu.br' }, 
      loading: false 
    })

    render(
      <AuthGuard>
        <div data-testid="protected-content">Painel do Restaurante</div>
      </AuthGuard>
    )

    // Deve renderizar o invólucro estrutural (AppLayout) contendo a tela interna
    expect(screen.getByTestId('app-layout')).toBeInTheDocument()
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.getByText('Painel do Restaurante')).toBeInTheDocument()

    // Corrigido: Agora sim removemos o intruso '.slice(0)'
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})