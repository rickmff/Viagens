import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: './' faz o build funcionar tanto na raiz de um domínio quanto numa
  // subpasta do VPS (ex.: viagens.seudominio/japao-2026/) sem reconfigurar.
  base: './',
  build: { outDir: 'dist' },
})
