import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { AuthProvider } from '../../src/contexts/AuthProvider'
import { AuthContext } from '../../src/contexts/AuthContext'
import type { Usuario } from '../../src/types'

vi.mock('../../src/api/auth', () => ({
  login: vi.fn(),
  cadastro: vi.fn(),
}))

const usuarioMock: Usuario = {
  id: '1', nome: 'Jessica', email: 'jessica@ufersa.edu.br',
  contato: '5584999999999', criado_em: '2025-01-01T00:00:00Z', ultimo_login: null,
}

function renderAuthHook() {
  return renderHook(() => {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error('AuthContext nao encontrado')
    return ctx
  }, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    ),
  })
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('inicia com user null e loading false', () => {
    const { result } = renderAuthHook()

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('restaura usuario salvo no localStorage ao iniciar', () => {
    localStorage.setItem('@smartkitchen:user', JSON.stringify(usuarioMock))

    const { result } = renderAuthHook()

    expect(result.current.user).toEqual(usuarioMock)
  })

  it('login chama authApi.login e atualiza o usuario', async () => {
    const authApi = await import('../../src/api/auth')
    vi.mocked(authApi.login).mockResolvedValue(undefined)

    const { result } = renderAuthHook()

    await act(async () => {
      await result.current.login({ email: 'jessica@ufersa.edu.br', senha: '123' })
    })

    expect(authApi.login).toHaveBeenCalledWith({ email: 'jessica@ufersa.edu.br', senha: '123' })
  })

  it('cadastro chama authApi.cadastro e retorna o usuario', async () => {
    const authApi = await import('../../src/api/auth')
    vi.mocked(authApi.cadastro).mockResolvedValue(usuarioMock)

    const { result } = renderAuthHook()

    let retorno: Usuario | undefined
    await act(async () => {
      retorno = await result.current.cadastro({
        nome: 'Jessica', email: 'jessica@ufersa.edu.br', senha: '123', contato: '5584999999999',
      })
    })

    expect(authApi.cadastro).toHaveBeenCalledWith({
      nome: 'Jessica', email: 'jessica@ufersa.edu.br', senha: '123', contato: '5584999999999',
    })
    expect(retorno).toEqual(usuarioMock)
  })

  it('logout define user como null', async () => {
    localStorage.setItem('@smartkitchen:user', JSON.stringify(usuarioMock))

    const { result } = renderAuthHook()
    expect(result.current.user).toEqual(usuarioMock)

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('define loading como true durante o login', async () => {
    const authApi = await import('../../src/api/auth')
    let resolvePromise: () => void = () => {}
    vi.mocked(authApi.login).mockReturnValue(new Promise<void>((resolve) => {
      resolvePromise = resolve
    }))

    const { result } = renderAuthHook()
    expect(result.current.loading).toBe(false)

    let promise: Promise<void>
    act(() => {
      promise = result.current.login({ email: 'test@test.com', senha: '123' })
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolvePromise()
      await promise
    })

    expect(result.current.loading).toBe(false)
  })
})
