import base from "../../eslint.config.mjs";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...base,

  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "prettier/prettier": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "warn",
    },
  },
];