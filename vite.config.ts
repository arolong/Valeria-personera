import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        discurso:    resolve(__dirname, 'discurso.html'),
        propuestas:  resolve(__dirname, 'propuestas.html'),
        objetivos:   resolve(__dirname, 'objetivos.html'),
        sugerencias: resolve(__dirname, 'sugerencias.html'),
      },
    },
  },
})
