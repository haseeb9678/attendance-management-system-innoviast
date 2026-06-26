import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@attendance/shared-zod": path.resolve(__dirname, "../../packages/shared-zod/dist/index.js"),
      "@attendance/shared-types": path.resolve(__dirname, "../../packages/shared-types/dist/index.js"),
    },
  },
});
