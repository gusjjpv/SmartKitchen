import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarPedidos, atualizarStatusPedido } from '@/api/pedidos'
import type { StatusPedido } from '@/types'

export function useListarPedidos(restauranteId: string) {
  return useQuery({
    queryKey: ['pedidos', restauranteId],
    queryFn: () => listarPedidos(restauranteId),
    refetchInterval: 15_000,
  })
}

export function useAtualizarStatusPedido(restauranteId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      pedidoId,
      status,
    }: {
      pedidoId: string
      status: StatusPedido
    }) => atualizarStatusPedido(restauranteId, pedidoId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', restauranteId] })
    },
  })
}
