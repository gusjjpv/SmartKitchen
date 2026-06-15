import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { MesaProvider, useMesa } from '../../src/contexts/MesaContext'

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}))

import { useSearchParams } from 'react-router-dom'

describe('MesaContext', () => {
  it('retorna o numero da mesa quando o parametro mesa esta na URL', () => {
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams('mesa=5'), vi.fn()])

    const { result } = renderHook(() => useMesa(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MesaProvider>{children}</MesaProvider>
      ),
    })

    expect(result.current.mesa).toBe('5')
  })

  it('retorna null quando nao ha parametro mesa na URL', () => {
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(''), vi.fn()])

    const { result } = renderHook(() => useMesa(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MesaProvider>{children}</MesaProvider>
      ),
    })

    expect(result.current.mesa).toBeNull()
  })

  it('retorna null quando ha outro parametro mas nao mesa', () => {
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams('foo=bar'), vi.fn()])

    const { result } = renderHook(() => useMesa(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MesaProvider>{children}</MesaProvider>
      ),
    })

    expect(result.current.mesa).toBeNull()
  })
})
