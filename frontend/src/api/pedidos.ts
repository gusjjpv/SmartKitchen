import { api } from './client'
import type { Pedido } from '@/types'

export async function obterPedido(restauranteId: string, pedidoId: string) {
  const response = await api.get<Pedido>(`/restaurantes/${restauranteId}/pedidos/${pedidoId}`)
  return response.data
}
