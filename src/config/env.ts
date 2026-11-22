type EnvKey = "VITE_API_BASE_URL";

function readEnv(key: EnvKey): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`${key} is not set. See .env.example.`);
  }
  return value;
}

/** Build-time configuration; see .env.example. */
export const env = {
  /** The site's API, e.g. https://vacationrentalhotline.com/api. Request paths start with "/". */
  apiBaseUrl: readEnv("VITE_API_BASE_URL").replace(/\/+$/, ""),
} as const;
