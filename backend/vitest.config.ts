import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Indica que estamos testando código Node.js, não navegador
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'], // Procura testes dentro da pasta src do back
  },
});