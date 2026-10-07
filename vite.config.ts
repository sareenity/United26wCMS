import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  if (!env.VITE_SUPABASE_URL) {
    throw new Error("VITE_SUPABASE_URL is not configured")
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/cms-api": {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/cms-api/, "/functions/v1/cms-api"),
        },
      },
    },
  }
})
