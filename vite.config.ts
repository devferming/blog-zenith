import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// sql.js se carga como WebAssembly en el navegador: no hay servidor ni base de datos externa.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sql.js'],
  },
});
