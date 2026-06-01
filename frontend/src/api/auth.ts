import { api } from './client'
import type { Usuario, LoginDTO, CadastroDTO } from '@/types'

export async function login(dto: LoginDTO) {
  const { data } = await api.post<Usuario>('/login', dto)
  return data
}

export async function cadastro(dto: CadastroDTO) {
  const { data } = await api.post<Usuario>('/cadastro', dto)
  return data
}

export async function listarUsers() {
  const { data } = await api.get<Usuario[]>('/users')
  return data
}
