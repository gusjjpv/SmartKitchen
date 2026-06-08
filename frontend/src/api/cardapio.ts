import { api } from './client'
import type { Categoria, CriarCategoriaDTO, AtualizarCategoriaDTO, Produto, CriarProdutoDTO, AtualizarProdutoDTO } from '@/types'

export async function listarCategorias(restauranteId: string) {
  const { data } = await api.get<Categoria[]>(`/restaurantes/${restauranteId}/categorias`)
  return data
}

export async function obterCategoria(restauranteId: string, id: string) {
  const { data } = await api.get<Categoria>(`/restaurantes/${restauranteId}/categorias/${id}`)
  return data
}

export async function criarCategoria(restauranteId: string, dto: CriarCategoriaDTO) {
  const { data } = await api.post<Categoria>(`/restaurantes/${restauranteId}/categorias`, dto)
  return data
}

export async function atualizarCategoria(restauranteId: string, id: string, dto: AtualizarCategoriaDTO) {
  const { data } = await api.put<Categoria>(`/restaurantes/${restauranteId}/categorias/${id}`, dto)
  return data
}

export async function deletarCategoria(restauranteId: string, id: string) {
  await api.delete(`/restaurantes/${restauranteId}/categorias/${id}`)
}

export async function listarProdutos(restauranteId: string, categoriaId?: string) {
  const params = categoriaId ? { categoria_id: categoriaId } : undefined
  const { data } = await api.get<Produto[]>(`/restaurantes/${restauranteId}/produtos`, { params })
  return data
}

export async function obterProduto(restauranteId: string, id: string) {
  const { data } = await api.get<Produto>(`/restaurantes/${restauranteId}/produtos/${id}`)
  return data
}

export async function criarProduto(restauranteId: string, dto: CriarProdutoDTO) {
  const { data } = await api.post<Produto>(`/restaurantes/${restauranteId}/produtos`, dto)
  return data
}

export async function atualizarProduto(restauranteId: string, id: string, dto: AtualizarProdutoDTO) {
  const { data } = await api.put<Produto>(`/restaurantes/${restauranteId}/produtos/${id}`, dto)
  return data
}

export async function deletarProduto(restauranteId: string, id: string) {
  await api.delete(`/restaurantes/${restauranteId}/produtos/${id}`)
}
