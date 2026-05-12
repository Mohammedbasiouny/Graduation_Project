import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      port: Number(env.VITE_PORT) || 3030,
      open: env.VITE_OPEN === "true",
      host: env.VITE_HOST || "localhost",
      strictPort: env.VITE_STRICT_PORT === "true",
    },
  };
});