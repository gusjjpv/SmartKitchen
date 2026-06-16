import { z } from 'zod'

export function validarDigitosCPF(cpf: string): boolean {
  const nums = cpf.replace(/\D/g, '')
  if (nums.length !== 11) return false
  if (/^(\d)\1{10}$/.test(nums)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += Number(nums[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== Number(nums[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += Number(nums[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== Number(nums[10])) return false

  return true
}

export function formatarCpf(valor: string) {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const cpfSchema = z
  .string()
  .min(11, 'CPF incompleto')
  .refine((v) => validarDigitosCPF(v), 'CPF inválido')

export const emailSchema = z.string().email('E-mail inválido')

export function formatarTelefone(valor: string) {
  const digits = valor.replace(/\D/g, '')

  if (!digits.startsWith('55') || digits.length <= 2) {
    if (digits.length === 0) return ''
    return `+55${digits.slice(0, Math.min(digits.length, 11))}`
  }

  const ddd = digits.slice(2, 4)
  const numero = digits.slice(4, 13)

  if (numero.length <= 4) {
    return `+55 (${ddd}) ${numero}`
  }
  return `+55 (${ddd}) ${numero.slice(0, 5)}-${numero.slice(5, 9)}`
}

export function validarTelefone(valor: string): boolean {
  const digits = valor.replace(/\D/g, '')
  return /^55\d{10,11}$/.test(digits)
}

export const telefoneSchema = z
  .string()
  .min(8, 'Telefone incompleto')
  .refine((v) => validarTelefone(v), 'Telefone inválido')

export const nomeSchema = z
  .string()
  .min(3, 'Nome deve ter ao menos 3 caracteres')
  .regex(/^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+)+/, 'Digite nome e sobrenome')
