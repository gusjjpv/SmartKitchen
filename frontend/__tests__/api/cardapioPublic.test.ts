import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchCardapioPublico } from '../../src/api/cardapioPublic'
import type { CardapioPublicResponse } from '../../src/api/cardapioPublic'

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('cardapioPublic API', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetchCardapioPublico faz GET /restaurantes/slug/:slug/cardapio e retorna dados completos', async () => {
    const api = (await import('../../src/api/client')).api
    const responseMock: CardapioPublicResponse = {
      id: 'rest-1', nome: 'Restaurante Teste', slug: 'rest-teste',
      logo_base64: null, descricao: 'Descricao', whatsapp: '5584999999999',
      categorias: [{
        id: 'cat-1', nome: 'Bebidas', ordem: 1,
        produtos: [{ id: 'prod-1', nome: 'Suco', descricao: null, preco: 8.50, foto_base64: null, disponivel: true }],
      }],
      horarios: [{ dia_semana: 1, horario_abertura: '08:00', horario_fechamento: '18:00', fechado: false }],
      mesas: [{ id: 'mesa-1', numero: '1' }],
    }
    vi.mocked(api.get).mockResolvedValue({ data: responseMock })

    const result = await fetchCardapioPublico('rest-teste')

    expect(api.get).toHaveBeenCalledWith('/restaurantes/slug/rest-teste/cardapio')
    expect(result).toEqual(responseMock)
    expect(result.categorias).toHaveLength(1)
    expect(result.categorias[0].produtos).toHaveLength(1)
    expect(result.mesas).toHaveLength(1)
  })
})
