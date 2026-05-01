import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: ['@usertive/react-fluid-animation', 'prop-types', 'raf', 'react-sizeme', 'color'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
