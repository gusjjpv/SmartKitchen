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

export interface Usuario {
  id: string
  nome: string
  email: string
  contato: string
  criado_em: string
  ultimo_login: string | null
}

export interface LoginDTO {
  email: string
  senha: string
}

export interface CadastroDTO {
  nome: string
  email: string
  senha: string
  contato: string
}

export interface Categoria {
  id: string
  restaurante_id: string
  nome: string
  ordem: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
  _count?: { produtos: number }
}

export interface CriarCategoriaDTO {
  nome: string
  ordem?: number
  ativo?: boolean
}

export type AtualizarCategoriaDTO = Partial<CriarCategoriaDTO>

export interface Produto {
  id: string
  restaurante_id: string
  categoria_id: string
  nome: string
  descricao: string | null
  preco: number
  foto_base64: string | null
  disponivel: boolean
  criado_em: string
  atualizado_em: string
  categoria: { id: string; nome: string }
}

export interface CriarProdutoDTO {
  categoria_id: string
  nome: string
  descricao?: string
  preco: number
  foto_base64?: string
  disponivel?: boolean
}

export type AtualizarProdutoDTO = Partial<CriarProdutoDTO>

export interface Mesa {
  id: string
  restaurante_id: string
  numero: string
  ocupada: boolean
  qr_code_url: string | null
  criado_em: string
  atualizado_em: string
  _count?: { pedidos: number }
}

export interface CriarMesaDTO {
  numero: string
}

export type AtualizarMesaDTO = Partial<CriarMesaDTO> & { ocupada?: boolean }
