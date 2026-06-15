import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarRestaurantes, obterRestaurantePorId, criarRestaurante, atualizarRestaurante, deletarRestaurante,
} from '../../src/api/restaurante'
import type { Restaurante } from '../../src/types'

const restauranteMock: Restaurante = {
  id: 'rest-1', admin_usuario_id: 'user-1', nome: 'Restaurante Teste', slug: 'rest-teste',
  descricao: 'Descricao', logo_base64: null, whatsapp: '5584999999999',
  email: 'contato@teste.com', rua: 'Rua A', numero: '123', bairro: 'Centro',
  cidade: 'Cidade', estado: 'Estado', cep: '00000-000',
  ativo: true, criado_em: '', atualizado_em: '',
}

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('restaurante API', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('listarRestaurantes faz GET /restaurantes', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [restauranteMock] })
    const result = await listarRestaurantes()
    expect(api.get).toHaveBeenCalledWith('/restaurantes', { params: undefined })
    expect(result).toEqual([restauranteMock])
  })

  it('listarRestaurantes com filtros envia params', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [restauranteMock] })
    await listarRestaurantes({ cidade: 'Cidade', ativo: true, admin_usuario_id: 'user-1' })
    expect(api.get).toHaveBeenCalledWith('/restaurantes', {
      params: { cidade: 'Cidade', ativo: true, admin_usuario_id: 'user-1' },
    })
  })

  it('obterRestaurantePorId faz GET /restaurantes/:id', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: restauranteMock })
    const result = await obterRestaurantePorId('rest-1')
    expect(api.get).toHaveBeenCalledWith('/restaurantes/rest-1')
    expect(result).toEqual(restauranteMock)
  })

  it('criarRestaurante faz POST /restaurantes', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { admin_usuario_id: 'user-1', nome: 'Restaurante Teste', slug: 'rest-teste', whatsapp: '5584999999999', rua: 'Rua A', numero: '123', bairro: 'Centro', cidade: 'Cidade' }
    vi.mocked(api.post).mockResolvedValue({ data: restauranteMock })
    const result = await criarRestaurante(dto)
    expect(api.post).toHaveBeenCalledWith('/restaurantes', dto)
    expect(result).toEqual(restauranteMock)
  })

  it('atualizarRestaurante faz PUT /restaurantes/:id', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { nome: 'Nome Atualizado' }
    vi.mocked(api.put).mockResolvedValue({ data: { ...restauranteMock, nome: 'Nome Atualizado' } })
    const result = await atualizarRestaurante('rest-1', dto)
    expect(api.put).toHaveBeenCalledWith('/restaurantes/rest-1', dto)
    expect(result.nome).toBe('Nome Atualizado')
  })

  it('deletarRestaurante faz DELETE /restaurantes/:id', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.delete).mockResolvedValue({})
    await deletarRestaurante('rest-1')
    expect(api.delete).toHaveBeenCalledWith('/restaurantes/rest-1')
  })
})
