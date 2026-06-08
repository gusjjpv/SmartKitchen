import type { Restaurante, CriarRestauranteDTO, AtualizarRestauranteDTO } from '@/types'
import { api } from './client'

export async function listarRestaurantes(params?: { cidade?: string; ativo?: boolean; admin_usuario_id?: string }) {
  const { data } = await api.get<Restaurante[]>('/restaurantes', { params })
  return data
}

export async function obterRestaurantePorId(id: string) {
  const { data } = await api.get<Restaurante>(`/restaurantes/${id}`)
  return data
}

export async function criarRestaurante(dto: CriarRestauranteDTO) {
  const { data } = await api.post<Restaurante>('/restaurantes', dto)
  return data
}

export async function atualizarRestaurante(id: string, dto: AtualizarRestauranteDTO) {
  const { data } = await api.put<Restaurante>(`/restaurantes/${id}`, dto)
  return data
}

export async function deletarRestaurante(id: string) {
  await api.delete(`/restaurantes/${id}`)
}
