import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarHorarios, obterHorarioPorDia, criarHorario, atualizarHorario, deletarHorario,
} from '../../src/api/horarios'
import type { HorarioFuncionamento } from '../../src/types'

const restauranteId = 'rest-123'
const horarioMock: HorarioFuncionamento = {
  id: 'hor-1', restaurante_id: restauranteId, dia_semana: 1,
  horario_abertura: '08:00', horario_fechamento: '18:00',
  fechado: false, criado_em: '', atualizado_em: '',
}

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('horarios API', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('listarHorarios faz GET /restaurantes/:id/horarios', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [horarioMock] })
    const result = await listarHorarios(restauranteId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/horarios`)
    expect(result).toEqual([horarioMock])
  })

  it('obterHorarioPorDia faz GET /restaurantes/:id/horarios/:diaSemana', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: horarioMock })
    const result = await obterHorarioPorDia(restauranteId, 1)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/horarios/1`)
    expect(result).toEqual(horarioMock)
  })

  it('criarHorario faz POST /restaurantes/:id/horarios com o dto completo', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { restaurante_id: restauranteId, dia_semana: 1, horario_abertura: '08:00', horario_fechamento: '18:00' }
    vi.mocked(api.post).mockResolvedValue({ data: horarioMock })
    const result = await criarHorario(dto)
    expect(api.post).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/horarios`, dto)
    expect(result).toEqual(horarioMock)
  })

  it('atualizarHorario faz PUT /restaurantes/:id/horarios/:diaSemana', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { horario_abertura: '09:00' }
    vi.mocked(api.put).mockResolvedValue({ data: { ...horarioMock, horario_abertura: '09:00' } })
    const result = await atualizarHorario(restauranteId, 1, dto)
    expect(api.put).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/horarios/1`, dto)
    expect(result.horario_abertura).toBe('09:00')
  })

  it('deletarHorario faz DELETE /restaurantes/:id/horarios/:diaSemana', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.delete).mockResolvedValue({})
    await deletarHorario(restauranteId, 1)
    expect(api.delete).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/horarios/1`)
  })
})
