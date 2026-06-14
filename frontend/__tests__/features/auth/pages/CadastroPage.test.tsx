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

const mockCadastro = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    cadastro: mockCadastro,
  }),
}))

import { CadastroPage } from '../../../../src/features/auth/pages/CadastroPage'

describe('CadastroPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('1. Deve renderizar a tela de cadastro com todos os campos e elementos iniciais', () => {
    render(<CadastroPage />)

    expect(screen.getByText('Criar Conta')).toBeInTheDocument()
    expect(screen.getByText('Cadastre-se para gerenciar seu restaurante')).toBeInTheDocument()

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
    expect(screen.getByText('Faça login')).toBeInTheDocument()
  })

  it('2. Deve barrar o envio e exibir mensagem se algum campo obrigatório estiver vazio', async () => {
    render(<CadastroPage />)

    const botaoCadastrar = screen.getByRole('button', { name: /cadastrar/i })
    fireEvent.click(botaoCadastrar)

    const alertaErro = await screen.findByRole('alert')
    expect(alertaErro).toBeInTheDocument()
    expect(alertaErro.textContent).toBe('Preencha todos os campos')

    expect(mockCadastro).not.toHaveBeenCalled()
  })

  it('3. Deve exibir erro se as senhas digitadas forem diferentes', async () => {
    render(<CadastroPage />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Jessica Castro' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jessica@ufersa.edu.br' } })
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'senha123' } })
    fireEvent.change(screen.getByLabelText(/confirmar/i), { target: { value: 'senhaDiferente456' } })
    fireEvent.change(screen.getByLabelText(/whatsapp/i), { target: { value: '5584999999999' } })

    const botaoCadastrar = screen.getByRole('button', { name: /cadastrar/i })
    fireEvent.click(botaoCadastrar)

    const alertaErro = await screen.findByRole('alert')
    expect(alertaErro).toBeInTheDocument()
    expect(alertaErro.textContent).toBe('Senhas não conferem')

    expect(mockCadastro).not.toHaveBeenCalled()
  })

  it('4. Deve chamar a função de cadastro corretamente e redirecionar após sucesso', async () => {
    mockCadastro.mockResolvedValueOnce({ id: '1', nome: 'Jessica Castro' })

    render(<CadastroPage />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: '  Jessica Castro  ' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jessica@ufersa.edu.br' } })
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'senhaForte123' } })
    fireEvent.change(screen.getByLabelText(/confirmar/i), { target: { value: 'senhaForte123' } })
    fireEvent.change(screen.getByLabelText(/whatsapp/i), { target: { value: '5584999999999' } })

    const botaoCadastrar = screen.getByRole('button', { name: /cadastrar/i })
    fireEvent.click(botaoCadastrar)

    await waitFor(() => {
      expect(mockCadastro).toHaveBeenCalledWith({
        nome: 'Jessica Castro',
        email: 'jersica@ufersa.edu.br'.replace('jers', 'jess'),
        senha: 'senhaForte123',
        contato: '5584999999999',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/restaurantes')
    })
  })

  it('5. Deve exibir mensagem de erro vinda da API se a requisição falhar', async () => {
    mockCadastro.mockRejectedValueOnce(new Error('Email já cadastrado'))

    render(<CadastroPage />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Jessica Castro' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jessica@ufersa.edu.br' } })
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'senhaForte123' } })
    fireEvent.change(screen.getByLabelText(/confirmar/i), { target: { value: 'senhaForte123' } })
    fireEvent.change(screen.getByLabelText(/whatsapp/i), { target: { value: '5584999999999' } })

    const botaoCadastrar = screen.getByRole('button', { name: /cadastrar/i })
    fireEvent.click(botaoCadastrar)

    const alertaErro = await screen.findByRole('alert')
    expect(alertaErro).toBeInTheDocument()
    expect(alertaErro.textContent).toBe('Erro ao cadastrar. Verifique os dados e tente novamente.')

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
