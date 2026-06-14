import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api-proxy": {
        target: "https://ggawbtjxewjmtbmvjpiw.supabase.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, "/functions/v1/cms-api"),
      },
    },
  },
})
