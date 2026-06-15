import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarMesas, obterMesa, criarMesa, atualizarMesa, deletarMesa, regenerarQrCodeMesa,
} from '../../src/api/mesas'
import type { Mesa } from '../../src/types'

const restauranteId = 'rest-123'
const mesaMock: Mesa = {
  id: 'mesa-1', restaurante_id: restauranteId, numero: '5',
  ocupada: false, cpf_cliente: null, qr_code_url: null,
  criado_em: '', atualizado_em: '',
}

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('mesas API', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('listarMesas faz GET /restaurantes/:id/mesas', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: [mesaMock] })
    const result = await listarMesas(restauranteId)
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas`)
    expect(result).toEqual([mesaMock])
  })

  it('obterMesa faz GET /restaurantes/:id/mesas/:mesaId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: mesaMock })
    const result = await obterMesa(restauranteId, 'mesa-1')
    expect(api.get).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas/mesa-1`)
    expect(result).toEqual(mesaMock)
  })

  it('criarMesa faz POST /restaurantes/:id/mesas', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { numero: '5' }
    vi.mocked(api.post).mockResolvedValue({ data: mesaMock })
    const result = await criarMesa(restauranteId, dto)
    expect(api.post).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas`, dto)
    expect(result).toEqual(mesaMock)
  })

  it('atualizarMesa faz PUT /restaurantes/:id/mesas/:mesaId', async () => {
    const api = (await import('../../src/api/client')).api
    const dto = { ocupada: true, cpf_cliente: '123.456.789-00' }
    vi.mocked(api.put).mockResolvedValue({ data: { ...mesaMock, ocupada: true, cpf_cliente: '123.456.789-00' } })
    const result = await atualizarMesa(restauranteId, 'mesa-1', dto)
    expect(api.put).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas/mesa-1`, dto)
    expect(result.ocupada).toBe(true)
    expect(result.cpf_cliente).toBe('123.456.789-00')
  })

  it('deletarMesa faz DELETE /restaurantes/:id/mesas/:mesaId', async () => {
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.delete).mockResolvedValue({})
    await deletarMesa(restauranteId, 'mesa-1')
    expect(api.delete).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas/mesa-1`)
  })

  it('regenerarQrCodeMesa faz POST /restaurantes/:id/mesas/:mesaId/qrcode', async () => {
    const api = (await import('../../src/api/client')).api
    const mesaComQr = { ...mesaMock, qr_code_url: 'https://example.com/qr' }
    vi.mocked(api.post).mockResolvedValue({ data: mesaComQr })
    const result = await regenerarQrCodeMesa(restauranteId, 'mesa-1')
    expect(api.post).toHaveBeenCalledWith(`/restaurantes/${restauranteId}/mesas/mesa-1/qrcode`)
    expect(result.qr_code_url).toBe('https://example.com/qr')
  })
})
