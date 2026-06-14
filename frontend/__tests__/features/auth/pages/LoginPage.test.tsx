import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

const mockLogin = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

import { LoginPage } from '../../../../src/features/auth/pages/LoginPage'

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('1. Caso de Teste: Deve renderizar o formulário de login com todos os elementos essenciais', () => {
    render(<LoginPage />)

    expect(screen.getByText('SmartKitchen')).toBeInTheDocument()
    expect(screen.getByText('Faça login para gerenciar seu restaurante')).toBeInTheDocument()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument()
  })

  it('2. Deve exibir mensagem de erro local se o usuário tentar enviar os campos vazios', async () => {
    render(<LoginPage />)

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i })

    fireEvent.click(botaoEntrar)

    const alertaErro = await screen.findByRole('alert')
    expect(alertaErro).toBeInTheDocument()
    expect(alertaErro.textContent).toBe('Preencha todos os campos')

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('3. Deve realizar o login com sucesso e redirecionar para a página de restaurantes', async () => {
    mockLogin.mockResolvedValueOnce(undefined)

    render(<LoginPage />)

    const inputEmail = screen.getByLabelText(/email/i)
    const inputSenha = screen.getByLabelText(/senha/i)
    const botaoEntrar = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(inputEmail, { target: { value: 'jessica@ufersa.edu.br' } })
    fireEvent.change(inputSenha, { target: { value: 'senhaSegura123' } })

    fireEvent.click(botaoEntrar)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'jessica@ufersa.edu.br',
        senha: 'senhaSegura123',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/restaurantes')
    })
  })

  it('4. Deve exibir mensagem de erro vinda do servidor se as credenciais forem inválidas', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Unauthorized'))

    render(<LoginPage />)

    const inputEmail = screen.getByLabelText(/email/i)
    const inputSenha = screen.getByLabelText(/senha/i)
    const botaoEntrar = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(inputEmail, { target: { value: 'errado@email.com' } })
    fireEvent.change(inputSenha, { target: { value: '123' } })

    fireEvent.click(botaoEntrar)

    const alertaErro = await screen.findByRole('alert')
    expect(alertaErro).toBeInTheDocument()
    expect(alertaErro.textContent).toBe('Email ou senha inválidos')

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
