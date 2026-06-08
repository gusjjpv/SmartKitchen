import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { Usuario } from '@/types'
import * as authApi from '@/api/auth'

const USER_KEY = '@smartkitchen:user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  const login = useCallback(async (dto: { email: string; senha: string }) => {
    setLoading(true)
    try {
      const usuario = await authApi.login(dto)
      setUser(usuario)
    } finally {
      setLoading(false)
    }
  }, [])

  const cadastro = useCallback(async (dto: { nome: string; email: string; senha: string; contato: string }) => {
    const usuario = await authApi.cadastro(dto)
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, cadastro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
