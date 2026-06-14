import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

// 1. Mocks das ferramentas de navegação e rotas
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ slug: 'restaurante-show' }),
}))

// 2. Mock do sistema de alertas (Sonner toast)
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    error: (msg: string) => mockToastError(msg),
  },
}))

// 3. Funções controláveis para simular nossos Contexts customizados
const mockUseMesa = vi.fn()
const mockUseComanda = vi.fn()

vi.mock('@/contexts/MesaContext', () => ({
  useMesa: () => mockUseMesa(),
}))

vi.mock('@/contexts/ComandaContext', () => ({
  useComanda: () => mockUseComanda(),
}))

import { ComandaPanel } from '../../src/components/ComandaPanel'

describe('ComandaPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('1. Caso de Teste 3: Sem itens na comanda, o botão "Confirmar Pedido" não deve aparecer', () => {
    // Configura o mock da mesa ativa, mas sem nenhum item adicionado
    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [],
      confirmarPedido: vi.fn(),
      remover: vi.fn(),
      atualizarQuantidade: vi.fn(),
      limpar: vi.fn(),
      total: 0,
      totalItens: 0,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)

    // Pela regra do componente, se não há itens e está fechado, ele retorna null (não renderiza o botão)
    expect(screen.queryByRole('button', { name: /Confirmar Pedido/i })).not.toBeInTheDocument()
  })

  it('2. Caso de Teste 4: Com itens na comanda, o painel deve exibir o botão "Confirmar Pedido" habilitado', () => {
    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [
        { produto_id: 'p1', nome: 'Suco de Laranja', preco: 8.5, quantidade: 1, foto_base64: '' },
      ],
      confirmarPedido: vi.fn(),
      remover: vi.fn(),
      atualizarQuantidade: vi.fn(),
      limpar: vi.fn(),
      total: 8.5,
      totalItens: 1,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)

    // Deve renderizar o botão flutuante para abrir a comanda
    const botaoVerComanda = screen.getByText('Ver comanda')
    expect(botaoVerComanda).toBeInTheDocument()

    // Abre a comanda clicando no botão flutuante
    fireEvent.click(botaoVerComanda)

    // O botão de finalizar deve estar visível e habilitado na tela
    const botaoConfirmar = screen.getByRole('button', { name: /Confirmar Pedido/i })
    expect(botaoConfirmar).toBeInTheDocument()
    expect(botaoConfirmar).not.toBeDisabled()
  })

  it('3. Deve chamar atualizarQuantidade com os parâmetros corretos ao alterar as quantidades de um item', () => {
    const mockAtualizarQuantidade = vi.fn()
    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [
        { produto_id: 'prod-99', nome: 'Pizza de Calabresa', preco: 45.0, quantidade: 2, foto_base64: '' },
      ],
      confirmarPedido: vi.fn(),
      remover: vi.fn(),
      atualizarQuantidade: mockAtualizarQuantidade,
      limpar: vi.fn(),
      total: 90.0,
      totalItens: 2,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)
    fireEvent.click(screen.getByText('Ver comanda'))

    // Clica no botão de somar (+)
    const botaoMais = screen.getByRole('button', { name: /Aumentar quantidade/i })
    fireEvent.click(botaoMais)
    expect(mockAtualizarQuantidade).toHaveBeenCalledWith('prod-99', 1)

    // Clica no botão de subtrair (-)
    const botaoMenos = screen.getByRole('button', { name: /Diminuir quantidade/i })
    fireEvent.click(botaoMenos)
    expect(mockAtualizarQuantidade).toHaveBeenCalledWith('prod-99', -1)
  })

  it('4. Deve acionar a remoção completa do item ao clicar no botão de exclusão', () => {
    const mockRemover = vi.fn()
    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [
        { produto_id: 'prod-99', nome: 'Pizza de Calabresa', preco: 45.0, quantidade: 1, foto_base64: '' },
      ],
      confirmarPedido: vi.fn(),
      remover: mockRemover,
      atualizarQuantidade: vi.fn(),
      limpar: vi.fn(),
      total: 45.0,
      totalItens: 1,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)
    fireEvent.click(screen.getByText('Ver comanda'))

    // Busca o botão de lixeira específico do item pelo atributo de acessibilidade
    const botaoExcluirItem = screen.getByRole('button', { name: /Remover Pizza de Calabresa/i })
    fireEvent.click(botaoExcluirItem)

    expect(mockRemover).toHaveBeenCalledWith('prod-99')
  })

  it('5. Deve exibir estado de carregamento, salvar no localStorage e redirecionar após o sucesso do pedido', async () => {
    const mockConfirmarPedido = vi.fn().mockResolvedValue({ id: 'pedido-abc-123' })
    const spyLocalStorage = vi.spyOn(Storage.prototype, 'setItem')

    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [
        { produto_id: 'prod-99', nome: 'Pizza de Calabresa', preco: 45.0, quantidade: 1, foto_base64: '' },
      ],
      confirmarPedido: mockConfirmarPedido,
      remover: vi.fn(),
      atualizarQuantidade: vi.fn(),
      limpar: vi.fn(),
      total: 45.0,
      totalItens: 1,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)
    fireEvent.click(screen.getByText('Ver comanda'))

    const botaoConfirmar = screen.getByRole('button', { name: /Confirmar Pedido/i })
    fireEvent.click(botaoConfirmar)

    // O botão deve mudar o texto para "Enviando..." instantaneamente
    expect(screen.getByText('Enviando...')).toBeInTheDocument()

    // Aguarda a resolução assíncrona do fluxo de envio
    await waitFor(() => {
      expect(mockConfirmarPedido).toHaveBeenCalledWith('rest-123', 'mesa-4')
      
      // Valida o salvamento do último pedido nas chaves do localStorage do cliente
      expect(spyLocalStorage).toHaveBeenCalledWith(
        'ultimo_pedido_restaurante-show_4',
        JSON.stringify({ id: 'pedido-abc-123', restaurante_id: 'rest-123' })
      )

      // Valida o redirecionamento para a página de confirmação pública
      expect(mockNavigate).toHaveBeenCalledWith(
        '/cardapio/restaurante-show/pedido-confirmado?mesa=4&pedido_id=pedido-abc-123&restaurante_id=rest-123'
      )
    })
  })

  it('6. Deve exibir um alerta toast caso a API de confirmação de pedido retorne alguma falha', async () => {
    // Simula uma falha ou queda de rede na requisição
    const mockConfirmarPedido = vi.fn().mockRejectedValue(new Error('Erro de Conexão'))

    mockUseMesa.mockReturnValue({ mesa: '4' })
    mockUseComanda.mockReturnValue({
      itens: [
        { produto_id: 'prod-99', nome: 'Pizza', preco: 45.0, quantidade: 1, foto_base64: '' },
      ],
      confirmarPedido: mockConfirmarPedido,
      remover: vi.fn(),
      atualizarQuantidade: vi.fn(),
      limpar: vi.fn(),
      total: 45.0,
      totalItens: 1,
    })

    render(<ComandaPanel restauranteId="rest-123" mesaId="mesa-4" />)
    fireEvent.click(screen.getByText('Ver comanda'))

    const botaoConfirmar = screen.getByRole('button', { name: /Confirmar Pedido/i })
    fireEvent.click(botaoConfirmar)

    await waitFor(() => {
      // Valida que o erro foi capturado pelo bloco catch e exibiu a mensagem amigável no toast do Sonner
      expect(mockToastError).toHaveBeenCalledWith(
        'Erro ao enviar pedido. Verifique sua conexão e tente novamente.'
      )
    })
  })
})