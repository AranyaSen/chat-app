import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = (env.API_URL || "http://localhost:8888").replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 4000,
      proxy: {
        // The browser calls `/chat-app/auth/...`; the rewrite removes the
        // prefix so the backend still receives `/auth/...`.
        "/chat-app": {
          target: API_URL,
          changeOrigin: false,
          rewrite: (path) => path.replace(/^\/chat-app/, ""),
        },
      },
    },
  };
});
