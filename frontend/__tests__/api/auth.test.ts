import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, cadastro, listarUsers } from '../../src/api/auth'
import type { Usuario } from '../../src/types'

vi.mock('../../src/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login faz POST /login com email e senha e retorna Usuario', async () => {
    const usuarioMock: Usuario = {
      id: '1', nome: 'Jessica', email: 'jessica@ufersa.edu.br',
      contato: '5584999999999', criado_em: '2025-01-01T00:00:00Z', ultimo_login: null,
    }
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.post).mockResolvedValue({ data: usuarioMock })

    const result = await login({ email: 'jessica@ufersa.edu.br', senha: 'senhaSegura123' })

    expect(api.post).toHaveBeenCalledWith('/login', {
      email: 'jessica@ufersa.edu.br',
      senha: 'senhaSegura123',
    })
    expect(result).toEqual(usuarioMock)
  })

  it('cadastro faz POST /cadastro com dados do usuario e retorna Usuario', async () => {
    const usuarioMock: Usuario = {
      id: '2', nome: 'João', email: 'joao@test.com',
      contato: '5584888888888', criado_em: '2025-01-01T00:00:00Z', ultimo_login: null,
    }
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.post).mockResolvedValue({ data: usuarioMock })

    const result = await cadastro({
      nome: 'João', email: 'joao@test.com', senha: '123456', contato: '5584888888888',
    })

    expect(api.post).toHaveBeenCalledWith('/cadastro', {
      nome: 'João', email: 'joao@test.com', senha: '123456', contato: '5584888888888',
    })
    expect(result).toEqual(usuarioMock)
  })

  it('listarUsers faz GET /users e retorna Usuario[]', async () => {
    const usuariosMock: Usuario[] = [{
      id: '1', nome: 'Jessica', email: 'jessica@ufersa.edu.br',
      contato: '5584999999999', criado_em: '2025-01-01T00:00:00Z', ultimo_login: null,
    }]
    const api = (await import('../../src/api/client')).api
    vi.mocked(api.get).mockResolvedValue({ data: usuariosMock })

    const result = await listarUsers()

    expect(api.get).toHaveBeenCalledWith('/users')
    expect(result).toEqual(usuariosMock)
  })
})
