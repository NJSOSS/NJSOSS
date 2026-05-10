import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // './' base so assets load correctly from Electron's file:// protocol
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
