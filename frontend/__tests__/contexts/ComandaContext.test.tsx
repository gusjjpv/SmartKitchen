import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { ComandaProvider, useComanda } from '../../src/contexts/ComandaContext'

describe('ComandaContext', () => {
  const slugTeste = 'restaurante-dev'
  const mesaTeste = '4'
  const chaveStorageTeste = `comanda_${slugTeste}_${mesaTeste}`

  // Wrapper personalizado passando as propriedades obrigatórias que o seu Provider exige
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ComandaProvider slug={slugTeste} mesa={mesaTeste}>
      {children}
    </ComandaProvider>
  )

  beforeEach(() => {
    localStorage.clear() // Reseta o localStorage antes de cada teste
  })

  it('1. Deve adicionar um produto novo com quantidade 1 e calcular totais', () => {
    const { result } = renderHook(() => useComanda(), { wrapper })

    act(() => {
      result.current.adicionar({
        id: 'prod-123',
        nome: 'Suco de Laranja',
        preco: 8.50,
        foto_base64: null,
      })
    })

    // Verifica se mapeou para 'produto_id' e iniciou com Qtd 1
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].produto_id).toBe('prod-123')
    expect(result.current.itens[0].quantidade).toBe(1)
    
    // Testa seus getters automáticos de totais
    expect(result.current.totalItens).toBe(1)
    expect(result.current.total).toBe(8.50)
  })

  it('2. Deve incrementar a quantidade ao adicionar o mesmo produto', () => {
    const { result } = renderHook(() => useComanda(), { wrapper })

    act(() => {
      result.current.adicionar({ id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null })
      result.current.adicionar({ id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null })
    })

    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].quantidade).toBe(2)
    expect(result.current.totalItens).toBe(2)
    expect(result.current.total).toBe(17.00)
  })

  it('3. Deve remover um produto completamente da lista', () => {
    const { result } = renderHook(() => useComanda(), { wrapper })

    act(() => {
      result.current.adicionar({ id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null })
    })
    expect(result.current.itens).toHaveLength(1)

    act(() => {
      result.current.remover('p1')
    })

    expect(result.current.itens).toHaveLength(0)
  })

  it('4. Deve alterar a quantidade via atualizarQuantidade e remover se chegar a 0', () => {
    const { result } = renderHook(() => useComanda(), { wrapper })

    act(() => {
      result.current.adicionar({ id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null })
    })

    // Incrementa +2 (Totalizando 3)
    act(() => {
      result.current.atualizarQuantidade('p1', 2)
    })
    expect(result.current.itens[0].quantidade).toBe(3)

    // Decrementa -3 (Vai zerar a quantidade, o seu código deve filtrar e remover da lista)
    act(() => {
      result.current.atualizarQuantidade('p1', -3)
    })
    expect(result.current.itens).toHaveLength(0)
  })

  it('5. Deve esvaziar a lista de itens ao chamar limpar()', () => {
    const { result } = renderHook(() => useComanda(), { wrapper })

    act(() => {
      result.current.adicionar({ id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null })
      result.current.adicionar({ id: 'p2', nome: 'Burguer', preco: 22.00, foto_base64: null })
    })

    act(() => {
      result.current.limpar()
    })

    expect(result.current.itens).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  it('6. Deve restaurar corretamente o estado inicial a partir do localStorage dinâmico', () => {
    // Simula dados previamente salvos na chave dinâmica exata com o seu tipo ComandaStorage
    const dadosMockados = {
      cpf: '123.456.789-00',
      itens: [
        { produto_id: 'p1', nome: 'Suco', preco: 8.50, foto_base64: null, quantidade: 3 }
      ]
    }
    localStorage.setItem(chaveStorageTeste, JSON.stringify(dadosMockados))

    const { result } = renderHook(() => useComanda(), { wrapper })

    // Verifica se os dados foram hidratados com sucesso pelo seu método carregarStorage
    expect(result.current.cpf).toBe('123.456.789-00')
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].quantidade).toBe(3)
    expect(result.current.total).toBe(25.50)
  })
})