type EnvKey = "VITE_API_BASE_URL" | "VITE_ASSETS_BASE_URL";

function readEnv(key: EnvKey): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`${key} is not set. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

/** Build-time configuration; see .env.example. */
export const env = {
  apiBaseUrl: readEnv("VITE_API_BASE_URL"),
  assetsBaseUrl: readEnv("VITE_ASSETS_BASE_URL"),
} as const;
