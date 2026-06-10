import base from "./base.mjs";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...base,

  {
    files: ["**/*.ts"],

    plugins: {
      prettier: prettierPlugin,
    },

    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    rules: {
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
    },
  },
];