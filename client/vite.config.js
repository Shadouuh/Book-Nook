import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  root: 'public/', // Define la ruta de Inicio
  build: {
    outDir: '../dist', // No se porque esta esto, pero si lo saco se rompe todo :c
  },
})
