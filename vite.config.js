import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento, /api vai para o kira-backend pelo próprio Vite: o navegador fala só com a
// origem do app (qualquer porta) e não há CORS. O Origin é removido para o Spring não tratar a
// chamada como de outra origem.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          // Bibliotecas que quase não mudam ficam em arquivos próprios e reaproveitam o cache do navegador
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            data: ["@tanstack/react-query"],
            forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          },
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY || "http://localhost:8081",
          changeOrigin: true,
          configure: (proxy) => proxy.on("proxyReq", (req) => req.removeHeader("origin")),
        },
        // Chat em tempo real: mesma ideia, para o WebSocket
        "/ws": {
          target: env.VITE_API_PROXY || "http://localhost:8081",
          changeOrigin: true,
          ws: true,
          configure: (proxy) => proxy.on("proxyReqWs", (req) => req.removeHeader("origin")),
        },
      },
    },
  };
});
