import { describe, it, expect, vi, beforeEach } from 'vitest'
import { obterPedido, listarPedidos, atualizarStatusPedido } from '../../src/api/pedidos'
import type { Pedido, StatusPedido } from '../../src/types'

const restauranteId = 'rest-123'
const pedidoId = 'ped-1'

const pedidoMock: Pedido = {
  id: pedidoId, restaurante_id: restauranteId, mesa_id: 'mesa-1',
  status: 'RECEBIDO', total: 25.50,
  criado_em: '', atualizado_em: '',
  itens: [{ id: 'item-1', produto_id: 'prod-1', quantidade: 2, preco_unitario: 12.75, produto: { id: 'prod-1', nome: 'Prato', foto_base64: null } }],
  mesa: { id: 'mesa-1', numero: '5' },
}

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

describe('pedidos API', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('obterPedido faz GET /restaurantes/:id/pedidos/:pedidoId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: pedidoMock })
    const result = await obterPedido(restauranteId, pedidoId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/pedidos/${pedidoId}`)
    expect(result).toEqual(pedidoMock)
  })

  it('listarPedidos faz GET /restaurantes/:id/pedidos', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [pedidoMock] })
    const result = await listarPedidos(restauranteId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/pedidos`)
    expect(result).toEqual([pedidoMock])
  })

  it('atualizarStatusPedido faz PUT /restaurantes/:id/pedidos/:pedidoId/status com status no body', async () => {
    const api = (await import('../../src/api/client')).api
    const status: StatusPedido = 'EM_PREPARO'
    const pedidoAtualizado = { ...pedidoMock, status }
    vi.mocked(api.put).mockResolvedValue({ data: pedidoAtualizado })
    const result = await atualizarStatusPedido(restauranteId, pedidoId, status)
    expect(api.put).toHaveBeenCalledWith(
      `/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`,
      { status },
    )
    expect(result.status).toBe('EM_PREPARO')
  })
})
