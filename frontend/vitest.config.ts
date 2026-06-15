import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    // Ajustado para apontar para a raiz do frontend, como mostra a estrutura do seu projeto
    setupFiles: ['./test-setup.ts'], 
  },
})