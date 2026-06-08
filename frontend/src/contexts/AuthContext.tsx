import { createContext } from 'react'
import type { Usuario } from '@/types'

export interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (dto: { email: string; senha: string }) => Promise<void>
  cadastro: (dto: { nome: string; email: string; senha: string; contato: string }) => Promise<Usuario>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
