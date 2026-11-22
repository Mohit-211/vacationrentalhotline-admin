import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

/**
 * The panel's settings live in .env (copy .env.example). Vite builds them into the JavaScript,
 * so a missing or malformed value stops the dev server and the build here, rather than
 * breaking the panel in people's browsers.
 */
function checkEnv(mode: string): void {
  const { VITE_API_BASE_URL: apiBaseUrl } = loadEnv(mode, process.cwd(), "VITE_");
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not set. Copy .env.example to .env and set it.");
  }
  if (!/^https?:\/\/[^/\s]+/.test(apiBaseUrl)) {
    throw new Error(
      `VITE_API_BASE_URL must be a full address such as https://vacationrentalhotline.com/api, not "${apiBaseUrl}".`,
    );
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  checkEnv(mode);
  return {
    plugins: [react()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    // The site's API accepts this panel's requests only from the origin in its ADMIN_APP_ORIGIN
    // (http://localhost:5173 when developing), so the port must not drift to another one.
    server: { port: 5173, strictPort: true },
    preview: { port: 5173, strictPort: true },
    build: {
      // Output stays in build/ (the Create React App folder) so deploy scripts keep working.
      outDir: "build",
      // The revenue chart chunk bundles the G2 charting engine (~1.5 MB). It is lazy-loaded
      // on the dashboard only, so the limit is raised just above it; anything larger still warns.
      chunkSizeWarningLimit: 1500,
    },
  };
});
