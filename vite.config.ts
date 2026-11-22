import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  build: {
    // Output stays in build/ (the Create React App folder) so deploy scripts keep working.
    outDir: "build",
    // The revenue chart chunk bundles the G2 charting engine (~1.5 MB). It is lazy-loaded
    // on the dashboard only, so the limit is raised just above it; anything larger still warns.
    chunkSizeWarningLimit: 1500,
  },
});
