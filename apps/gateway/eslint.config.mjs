import base from "../../eslint.config.mjs";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...base,

  {
    files: ["src/**/*.ts"],

    plugins: {
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
];