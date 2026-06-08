import { api } from './client'

export interface CardapioPublicResponse {
  id: string
  nome: string
  slug: string
  logo_base64: string | null
  descricao: string | null
  whatsapp: string
  categorias: {
    id: string
    nome: string
    ordem: number
    produtos: {
      id: string
      nome: string
      descricao: string | null
      preco: number
      foto_base64: string | null
      disponivel: boolean
    }[]
  }[]
  horarios: {
    dia_semana: number
    horario_abertura: string | null
    horario_fechamento: string | null
    fechado: boolean
  }[]
  mesas: { id: string; numero: string }[]
}

export async function fetchCardapioPublico(slug: string) {
  const { data } = await api.get<CardapioPublicResponse>(`/restaurantes/slug/${slug}/cardapio`)
  return data
}
