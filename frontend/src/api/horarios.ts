import type { HorarioFuncionamento, CriarHorarioDTO, AtualizarHorarioDTO } from '@/types'
import { api } from './client'

export async function listarHorarios(restauranteId: string) {
  const { data } = await api.get<HorarioFuncionamento[]>(`/restaurantes/${restauranteId}/horarios`)
  return data
}

export async function obterHorarioPorDia(restauranteId: string, diaSemana: number) {
  const { data } = await api.get<HorarioFuncionamento>(`/restaurantes/${restauranteId}/horarios/${diaSemana}`)
  return data
}

export async function criarHorario(dto: CriarHorarioDTO) {
  const { data } = await api.post<HorarioFuncionamento>(
    `/restaurantes/${dto.restaurante_id}/horarios`,
    dto,
  )
  return data
}

export async function atualizarHorario(
  restauranteId: string,
  diaSemana: number,
  dto: AtualizarHorarioDTO,
) {
  const { data } = await api.put<HorarioFuncionamento>(
    `/restaurantes/${restauranteId}/horarios/${diaSemana}`,
    dto,
  )
  return data
}

export async function deletarHorario(restauranteId: string, diaSemana: number) {
  await api.delete(`/restaurantes/${restauranteId}/horarios/${diaSemana}`)
}
