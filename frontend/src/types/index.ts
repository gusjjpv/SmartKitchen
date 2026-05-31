export interface Restaurante {
  id: string
  admin_usuario_id: string
  nome: string
  slug: string
  descricao: string | null
  logo_base64: string | null
  whatsapp: string
  email: string | null
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string | null
  cep: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
  horarios?: HorarioFuncionamento[]
}

export interface CriarRestauranteDTO {
  admin_usuario_id: string
  nome: string
  slug: string
  descricao?: string
  logo_base64?: string | null
  whatsapp: string
  email?: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado?: string
  cep?: string
  ativo?: boolean
}

export type AtualizarRestauranteDTO = Partial<CriarRestauranteDTO>

export interface HorarioFuncionamento {
  id: string
  restaurante_id: string
  dia_semana: number
  horario_abertura: string | null
  horario_fechamento: string | null
  fechado: boolean
  criado_em: string
  atualizado_em: string
}

export interface CriarHorarioDTO {
  restaurante_id: string
  dia_semana: number
  horario_abertura?: string
  horario_fechamento?: string
  fechado?: boolean
}

export type AtualizarHorarioDTO = Partial<Omit<CriarHorarioDTO, 'restaurante_id' | 'dia_semana'>>

export const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const
