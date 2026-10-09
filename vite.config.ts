import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitePlugin } from './build/sitePlugin'
import { securityHeaders } from './build/securityHeaders'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitePlugin()],
  // `npm run preview` canlıdaki güvenlik başlıklarıyla çalışsın (CSP testi için)
  preview: {
    headers: securityHeaders,
  },
})
