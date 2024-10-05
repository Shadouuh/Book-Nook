import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'public/', // Ajusta esta ruta según la ubicación de tu index.html
  build: {
    outDir: '../dist', // Ajusta según dónde desees que se genere la salida
  },
})
