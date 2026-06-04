import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listarMesas,
  criarMesa,
  atualizarMesa,
  deletarMesa,
} from '@/api/mesas'
import type { CriarMesaDTO, AtualizarMesaDTO } from '@/types'

const MESA_KEY = 'mesa'

export function useListarMesas(restauranteId: string | undefined) {
  return useQuery({
    queryKey: [MESA_KEY, 'list', restauranteId],
    queryFn: () => listarMesas(restauranteId!),
    enabled: !!restauranteId,
  })
}

export function useCriarMesa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, dto }: { restauranteId: string; dto: CriarMesaDTO }) =>
      criarMesa(restauranteId, dto),
    onSuccess: (_, { restauranteId }) => {
      queryClient.invalidateQueries({ queryKey: [MESA_KEY, 'list', restauranteId] })
    },
  })
}

export function useAtualizarMesa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id, dto }: { restauranteId: string; id: string; dto: AtualizarMesaDTO }) =>
      atualizarMesa(restauranteId, id, dto),
    onSuccess: (_, { restauranteId }) => {
      queryClient.invalidateQueries({ queryKey: [MESA_KEY, 'list', restauranteId] })
    },
  })
}

export function useDeletarMesa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id }: { restauranteId: string; id: string }) =>
      deletarMesa(restauranteId, id),
    onSuccess: (_, { restauranteId }) => {
      queryClient.invalidateQueries({ queryKey: [MESA_KEY, 'list', restauranteId] })
    },
  })
}
