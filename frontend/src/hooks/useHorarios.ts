import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listarHorarios,
  criarHorario,
  atualizarHorario,
} from '@/api/horarios'
import type { CriarHorarioDTO, AtualizarHorarioDTO } from '@/types'

const HORARIOS_KEY = 'horarios'

export function useListarHorarios(restauranteId: string | undefined) {
  return useQuery({
    queryKey: [HORARIOS_KEY, restauranteId],
    queryFn: () => listarHorarios(restauranteId!),
    enabled: !!restauranteId,
  })
}

export function useCriarHorario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CriarHorarioDTO) => criarHorario(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [HORARIOS_KEY, variables.restaurante_id] })
    },
  })
}

export function useAtualizarHorario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      restauranteId,
      diaSemana,
      dto,
    }: {
      restauranteId: string
      diaSemana: number
      dto: AtualizarHorarioDTO
    }) => atualizarHorario(restauranteId, diaSemana, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [HORARIOS_KEY, variables.restauranteId] })
    },
  })
}
