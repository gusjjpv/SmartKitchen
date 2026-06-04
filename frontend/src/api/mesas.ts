import { api } from './client'
import type { Mesa, CriarMesaDTO, AtualizarMesaDTO } from '@/types'

export async function listarMesas(restauranteId: string) {
  const { data } = await api.get<Mesa[]>(`/restaurantes/${restauranteId}/mesas`)
  return data
}

export async function obterMesa(restauranteId: string, id: string) {
  const { data } = await api.get<Mesa>(`/restaurantes/${restauranteId}/mesas/${id}`)
  return data
}

export async function criarMesa(restauranteId: string, dto: CriarMesaDTO) {
  const { data } = await api.post<Mesa>(`/restaurantes/${restauranteId}/mesas`, dto)
  return data
}

export async function atualizarMesa(restauranteId: string, id: string, dto: AtualizarMesaDTO) {
  const { data } = await api.put<Mesa>(`/restaurantes/${restauranteId}/mesas/${id}`, dto)
  return data
}

export async function deletarMesa(restauranteId: string, id: string) {
  await api.delete(`/restaurantes/${restauranteId}/mesas/${id}`)
}
