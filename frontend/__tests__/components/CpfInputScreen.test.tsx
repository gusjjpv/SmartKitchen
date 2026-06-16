import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'

vi.mock('../../src/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))

import { CpfInputScreen } from '../../src/components/CpfInputScreen'

describe('CpfInputScreen Component', () => {
  it('1. Deve renderizar os elementos iniciais da tela corretamente', () => {
    const mockOnConfirm = vi.fn().mockResolvedValue(undefined)
    render(<CpfInputScreen onConfirm={mockOnConfirm} />)

    expect(screen.getByText('Identifique-se')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
  })

  it('2. Caso de Teste 2: Deve manter o botão "Confirmar" desabilitado se o CPF tiver menos de 11 dígitos', () => {
    const mockOnConfirm = vi.fn().mockResolvedValue(undefined)
    render(<CpfInputScreen onConfirm={mockOnConfirm} />)

    const input = screen.getByPlaceholderText('000.000.000-00')
    const botao = screen.getByRole('button', { name: 'Confirmar' })

    fireEvent.change(input, { target: { value: '1234567890' } })

    expect(botao).toBeDisabled()
  })

  it('3. Caso de Teste 1: Deve formatar o CPF com pontos/hífen e aceitar apenas números', () => {
    const mockOnConfirm = vi.fn().mockResolvedValue(undefined)
    render(<CpfInputScreen onConfirm={mockOnConfirm} />)

    const input = screen.getByPlaceholderText('000.000.000-00') as HTMLInputElement

    fireEvent.change(input, { target: { value: '123abc456def78901' } })

    expect(input.value).toBe('123.456.789-01')
  })

  it('4. Deve habilitar o botão e chamar onConfirm enviando apenas os números limpos', async () => {
    const mockOnConfirm = vi.fn().mockResolvedValue(undefined)
    render(<CpfInputScreen onConfirm={mockOnConfirm} />)

    const input = screen.getByPlaceholderText('000.000.000-00')
    const botao = screen.getByRole('button', { name: 'Confirmar' })

    fireEvent.change(input, { target: { value: '12345678901' } })
    expect(botao).not.toBeDisabled()

    fireEvent.click(botao)

    expect(mockOnConfirm).toHaveBeenCalledWith('12345678901')
  })

  it('5. Deve exibir o estado de loading e desabilitar o botão durante a requisição', async () => {
    let resolverPromessa!: () => void
    const promessa = new Promise<void>((resolve) => {
      resolverPromessa = resolve
    })
    const mockOnConfirm = vi.fn().mockReturnValue(promessa)

    render(<CpfInputScreen onConfirm={mockOnConfirm} />)

    const input = screen.getByPlaceholderText('000.000.000-00')
    fireEvent.change(input, { target: { value: '12345678901' } })

    const botao = screen.getByRole('button')
    fireEvent.click(botao)

    expect(screen.getByText('Entrando...')).toBeInTheDocument()
    expect(botao).toBeDisabled()

    await act(async () => {
      resolverPromessa()
    })
  })
})
