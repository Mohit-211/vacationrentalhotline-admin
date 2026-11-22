import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["build", "dist", "coverage"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // The design lives in src/styles: colours and sizes in theme.ts, classes in global.css.
      // Components use those and never style themselves.
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name=/^(style|styles|bodyStyle|headStyle)$/]",
          message:
            "No inline styles: use a class from src/styles/global.css (add one there if needed).",
        },
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/], Literal[value=/^(rgb|hsl)a?\\(/]",
          message:
            "No hard-coded colours: use a token from src/styles/theme.ts or a global.css class.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "*.css",
                "*.scss",
                "*.sass",
                "*.less",
                "!@/styles/global.css",
                "!antd/dist/reset.css",
              ],
              message: "All styles live in src/styles/global.css; do not add other stylesheets.",
            },
          ],
        },
      ],
    },
  },
  // The one place colours are defined.
  {
    files: ["src/styles/theme.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  // Turns off stylistic rules that would fight Prettier; keep it last.
  prettier,
]);
