import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  preview: { port: 3000 },
  // Keep CRA's output folder so existing deploy scripts keep working.
  build: { outDir: "build" },
});
