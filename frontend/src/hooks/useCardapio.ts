import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as cardapioApi from '@/api/cardapio'
import type { CriarCategoriaDTO, AtualizarCategoriaDTO, CriarProdutoDTO, AtualizarProdutoDTO } from '@/types'

const CATEGORIA_KEY = 'categorias'
const PRODUTO_KEY = 'produtos'

export function useListarCategorias(restauranteId: string | null) {
  return useQuery({
    queryKey: [CATEGORIA_KEY, restauranteId],
    queryFn: () => cardapioApi.listarCategorias(restauranteId!),
    enabled: !!restauranteId,
  })
}

export function useCriarCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, dto }: { restauranteId: string; dto: CriarCategoriaDTO }) =>
      cardapioApi.criarCategoria(restauranteId, dto),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [CATEGORIA_KEY, variables.restauranteId] })
    },
  })
}

export function useAtualizarCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id, dto }: { restauranteId: string; id: string; dto: AtualizarCategoriaDTO }) =>
      cardapioApi.atualizarCategoria(restauranteId, id, dto),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [CATEGORIA_KEY, variables.restauranteId] })
    },
  })
}

export function useDeletarCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id }: { restauranteId: string; id: string }) =>
      cardapioApi.deletarCategoria(restauranteId, id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [CATEGORIA_KEY, variables.restauranteId] })
    },
  })
}

export function useListarProdutos(restauranteId: string | null, categoriaId?: string | null) {
  return useQuery({
    queryKey: [PRODUTO_KEY, restauranteId, categoriaId],
    queryFn: () => cardapioApi.listarProdutos(restauranteId!, categoriaId ?? undefined),
    enabled: !!restauranteId,
  })
}

export function useCriarProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, dto }: { restauranteId: string; dto: CriarProdutoDTO }) =>
      cardapioApi.criarProduto(restauranteId, dto),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [PRODUTO_KEY, variables.restauranteId] })
    },
  })
}

export function useAtualizarProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id, dto }: { restauranteId: string; id: string; dto: AtualizarProdutoDTO }) =>
      cardapioApi.atualizarProduto(restauranteId, id, dto),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [PRODUTO_KEY, variables.restauranteId] })
    },
  })
}

export function useDeletarProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restauranteId, id }: { restauranteId: string; id: string }) =>
      cardapioApi.deletarProduto(restauranteId, id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [PRODUTO_KEY, variables.restauranteId] })
    },
  })
}
