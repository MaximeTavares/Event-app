import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.pnpm/**",
      "**/coverage/**",
      "**/eslint.config.*",
      "**/prisma/**",
      "**/test/**",
    ],
  },

  js.configs.recommended,

  prettier,

  {
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
];