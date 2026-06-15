import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarCategorias, obterCategoria, criarCategoria, atualizarCategoria, deletarCategoria,
  listarProdutos, obterProduto, criarProduto, atualizarProduto, deletarProduto,
} from '../../src/api/cardapio'
import type { Categoria, Produto } from '../../src/types'

const restauranteId = 'rest-123'
const categoriaId = 'cat-1'
const produtoId = 'prod-1'

const categoriaMock: Categoria = {
  id: categoriaId, restaurante_id: restauranteId, nome: 'Bebidas',
  ordem: 1, ativo: true, criado_em: '', atualizado_em: '',
}

const produtoMock: Produto = {
  id: produtoId, restaurante_id: restauranteId, categoria_id: categoriaId,
  nome: 'Suco de Laranja', descricao: 'Natural', preco: 8.50,
  foto_base64: null, disponivel: true, criado_em: '', atualizado_em: '',
  categoria: { id: categoriaId, nome: 'Bebidas' },
}

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('cardapio API - categorias', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('listarCategorias faz GET /restaurantes/:id/categorias', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [categoriaMock] })
    const result = await listarCategorias(restauranteId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/categorias`)
    expect(result).toEqual([categoriaMock])
  })

  it('obterCategoria faz GET /restaurantes/:id/categorias/:catId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: categoriaMock })
    const result = await obterCategoria(restauranteId, categoriaId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/categorias/${categoriaId}`)
    expect(result).toEqual(categoriaMock)
  })

  it('criarCategoria faz POST /restaurantes/:id/categorias', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { nome: 'Bebidas', ordem: 1 }
    vi.mocked(api.post).mockResolvedValue({ data: categoriaMock })
    const result = await criarCategoria(restauranteId, dto)
    expect(api.post).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/categorias`, dto)
    expect(result).toEqual(categoriaMock)
  })

  it('atualizarCategoria faz PUT /restaurantes/:id/categorias/:catId', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { nome: 'Bebidas Atualizado' }
    vi.mocked(api.put).mockResolvedValue({ data: { ...categoriaMock, nome: 'Bebidas Atualizado' } })
    const result = await atualizarCategoria(restauranteId, categoriaId, dto)
    expect(api.put).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/categorias/${categoriaId}`, dto)
    expect(result.nome).toBe('Bebidas Atualizado')
  })

  it('deletarCategoria faz DELETE /restaurantes/:id/categorias/:catId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.delete).mockResolvedValue({})
    await deletarCategoria(restauranteId, categoriaId)
    expect(api.delete).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/categorias/${categoriaId}`)
  })
})

describe('cardapio API - produtos', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('listarProdutos faz GET /restaurantes/:id/produtos', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [produtoMock] })
    const result = await listarProdutos(restauranteId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos`, { params: undefined })
    expect(result).toEqual([produtoMock])
  })

  it('listarProdutos com categoriaId envia params', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [produtoMock] })
    await listarProdutos(restauranteId, categoriaId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos`, {
      params: { categoria_id: categoriaId },
    })
  })

  it('obterProduto faz GET /restaurantes/:id/produtos/:prodId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: produtoMock })
    const result = await obterProduto(restauranteId, produtoId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos/${produtoId}`)
    expect(result).toEqual(produtoMock)
  })

  it('criarProduto faz POST /restaurantes/:id/produtos', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { categoria_id: categoriaId, nome: 'Suco', preco: 8.50 }
    vi.mocked(api.post).mockResolvedValue({ data: produtoMock })
    const result = await criarProduto(restauranteId, dto)
    expect(api.post).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos`, dto)
    expect(result).toEqual(produtoMock)
  })

  it('atualizarProduto faz PUT /restaurantes/:id/produtos/:prodId', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { nome: 'Suco Atualizado' }
    vi.mocked(api.put).mockResolvedValue({ data: { ...produtoMock, nome: 'Suco Atualizado' } })
    const result = await atualizarProduto(restauranteId, produtoId, dto)
    expect(api.put).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos/${produtoId}`, dto)
    expect(result.nome).toBe('Suco Atualizado')
  })

  it('deletarProduto faz DELETE /restaurantes/:id/produtos/:prodId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.delete).mockResolvedValue({})
    await deletarProduto(restauranteId, produtoId)
    expect(api.delete).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/produtos/${produtoId}`)
  })
})
