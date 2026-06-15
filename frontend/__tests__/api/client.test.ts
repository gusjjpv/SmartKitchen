import { describe, it, expect } from 'vitest'
import { api } from '../../src/api/client'

describe('api client', () => {
  it('deve ter baseURL /api', () => {
    expect(api.defaults.baseURL).toBe('/api')
  })

  it('deve ter Content-Type application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })
})
