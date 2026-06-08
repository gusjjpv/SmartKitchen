import { createContext, useContext, useMemo, useCallback, useEffect, useState, type ReactNode } from 'react'
import { api } from '@/api/client'
import type { ComandaItem } from '@/types'

interface ComandaStorage {
  cpf: string | null
  itens: ComandaItem[]
}

interface ComandaContextValue {
  cpf: string | null
  itens: ComandaItem[]
  setCpf: (cpf: string | null) => void
  adicionar: (produto: { id: string; nome: string; preco: number; foto_base64: string | null }) => void
  remover: (produto_id: string) => void
  atualizarQuantidade: (produto_id: string, delta: number) => void
  limpar: () => void
  confirmarPedido: (restauranteId: string, mesaId: string) => Promise<unknown>
  ocuparMesa: (restauranteId: string, mesaId: string) => Promise<void>
  total: number
  totalItens: number
}

const ComandaContext = createContext<ComandaContextValue | null>(null)

interface ComandaProviderProps {
  slug: string
  mesa: string | null
  children: ReactNode
}

function carregarStorage(slug: string, mesa: string): ComandaStorage {
  try {
    const raw = localStorage.getItem(`comanda_${slug}_${mesa}`)
    if (raw) return JSON.parse(raw) as ComandaStorage
  } catch {}
  return { cpf: null, itens: [] }
}

function salvarStorage(slug: string, mesa: string, dados: ComandaStorage) {
  try {
    localStorage.setItem(`comanda_${slug}_${mesa}`, JSON.stringify(dados))
  } catch {}
}

export function ComandaProvider({ slug, mesa, children }: ComandaProviderProps) {
  const [dados, setDados] = useState<ComandaStorage>(() => {
    if (!mesa) return { cpf: null, itens: [] }
    return carregarStorage(slug, mesa)
  })

  useEffect(() => {
    if (!mesa) {
      setDados({ cpf: null, itens: [] })
    }
  }, [slug, mesa])

  useEffect(() => {
    if (!mesa) return
    salvarStorage(slug, mesa, dados)
  }, [slug, mesa, dados])

  const setCpf = useCallback((cpf: string | null) => {
    setDados((prev) => ({ ...prev, cpf }))
  }, [])

  const ocuparMesa = useCallback(
    async (restauranteId: string, mesaId: string) => {
      await api.put(`/restaurantes/${restauranteId}/mesas/${mesaId}`, {
        ocupada: true,
        cpf_cliente: dados.cpf,
      })
    },
    [dados.cpf],
  )

  const adicionar = useCallback(
    (produto: { id: string; nome: string; preco: number; foto_base64: string | null }) => {
      setDados((prev) => {
        const existente = prev.itens.find((i) => i.produto_id === produto.id)
        if (existente) {
          return {
            ...prev,
            itens: prev.itens.map((i) =>
              i.produto_id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i,
            ),
          }
        }
        return {
          ...prev,
          itens: [
            ...prev.itens,
            {
              produto_id: produto.id,
              nome: produto.nome,
              preco: produto.preco,
              foto_base64: produto.foto_base64,
              quantidade: 1,
            },
          ],
        }
      })
    },
    [],
  )

  const remover = useCallback((produto_id: string) => {
    setDados((prev) => ({ ...prev, itens: prev.itens.filter((i) => i.produto_id !== produto_id) }))
  }, [])

  const atualizarQuantidade = useCallback((produto_id: string, delta: number) => {
    setDados((prev) => ({
      ...prev,
      itens: prev.itens
        .map((i) =>
          i.produto_id === produto_id ? { ...i, quantidade: i.quantidade + delta } : i,
        )
        .filter((i) => i.quantidade > 0),
    }))
  }, [])

  const limpar = useCallback(() => {
    setDados((prev) => ({ ...prev, itens: [] }))
  }, [])

  const confirmarPedido = useCallback(
    async (restauranteId: string, mesaId: string) => {
      const response = await api.post(`/restaurantes/${restauranteId}/mesas/${mesaId}/pedidos`, {
        itens: dados.itens.map((i) => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
          preco_unitario: i.preco,
        })),
      })
      if (response.status === 201) {
        limpar()
      }
      return response.data
    },
    [dados.itens, limpar],
  )

  const value = useMemo(
    () => ({
      get cpf() { return dados.cpf },
      get itens() { return dados.itens },
      setCpf,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
      confirmarPedido,
      ocuparMesa,
      get total() {
        return dados.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0)
      },
      get totalItens() {
        return dados.itens.reduce((acc, i) => acc + i.quantidade, 0)
      },
    }),
    [dados, setCpf, adicionar, remover, atualizarQuantidade, limpar, confirmarPedido, ocuparMesa],
  )

  return <ComandaContext.Provider value={value}>{children}</ComandaContext.Provider>
}

export function useComanda() {
  const ctx = useContext(ComandaContext)
  if (!ctx) throw new Error('useComanda must be used within ComandaProvider')
  return ctx
}
