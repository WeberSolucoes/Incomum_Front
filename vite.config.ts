import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acesso remoto
    port: 80,        // Porta do servidor
  },
  build: {
    rollupOptions: {
      output: {
        // Configuração para dividir dependências grandes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  // Evita análise de dependências desnecessárias
  optimizeDeps: {
    exclude: ['some-module'], // Remova ou substitua por dependências específicas se necessário
  },
});


