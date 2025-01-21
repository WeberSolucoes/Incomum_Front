import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acesso remoto
    port: 80,        // Porta do servidor
  },
  optimizeDeps: {
    exclude: ['.git/**'], // Exclui a pasta .git e outros arquivos desnecessários
  },
  build: {
    rollupOptions: {
      output: {
        // Configuração para evitar inclusões desnecessárias no build final
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});

