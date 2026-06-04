import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listarRestaurantes,
  obterRestaurantePorId,
  criarRestaurante,
  atualizarRestaurante,
} from '@/api/restaurante'
import type { CriarRestauranteDTO, AtualizarRestauranteDTO } from '@/types'

const RESTAURANTE_KEY = 'restaurante'

export function useListarRestaurantes(params?: { cidade?: string; ativo?: boolean; admin_usuario_id?: string }) {
  return useQuery({
    queryKey: [RESTAURANTE_KEY, 'list', params],
    queryFn: () => listarRestaurantes(params),
  })
}

export function useRestaurantePorId(id: string | undefined) {
  return useQuery({
    queryKey: [RESTAURANTE_KEY, id],
    queryFn: () => obterRestaurantePorId(id!),
    enabled: !!id,
  })
}

export function useCriarRestaurante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CriarRestauranteDTO) => criarRestaurante(dto),
    onSuccess: (data) => {
      queryClient.setQueryData([RESTAURANTE_KEY, data.id], data)
      queryClient.invalidateQueries({ queryKey: [RESTAURANTE_KEY, 'list'] })
    },
  })
}

export function useAtualizarRestaurante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AtualizarRestauranteDTO }) =>
      atualizarRestaurante(id, dto),
    onSuccess: (data) => {
      queryClient.setQueryData([RESTAURANTE_KEY, data.id], data)
      queryClient.invalidateQueries({ queryKey: [RESTAURANTE_KEY, 'list'] })
    },
  })
}
