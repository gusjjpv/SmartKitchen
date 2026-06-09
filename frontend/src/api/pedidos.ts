import { api } from './client'
import type { Pedido, StatusPedido } from '@/types'

export async function obterPedido(restauranteId: string, pedidoId: string) {
  const response = await api.get<Pedido>(`/restaurantes/${restauranteId}/pedidos/${pedidoId}`)
  return response.data
}

export async function listarPedidos(restauranteId: string) {
  const { data } = await api.get<Pedido[]>(`/restaurantes/${restauranteId}/pedidos`)
  return data
}

export async function atualizarStatusPedido(
  restauranteId: string,
  pedidoId: string,
  status: StatusPedido,
) {
  const { data } = await api.put<Pedido>(
    `/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`,
    { status },
  )
  return data
}
