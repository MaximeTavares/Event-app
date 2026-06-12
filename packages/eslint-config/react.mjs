import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default function createReactConfig(tsconfigRootDir) {
	return defineConfig([
		{
			ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],
		},

		js.configs.recommended,

		{
			files: ["**/*.{ts,tsx}"],

			languageOptions: {
				parserOptions: {
					tsconfigRootDir: import.meta.dirname,
					projectService: true,
				},

				globals: globals.browser,
			},

			plugins: {
				prettier: prettierPlugin,
				"react-hooks": reactHooks,
				"react-refresh": reactRefresh,
			},

			extends: [...tseslint.configs.recommendedTypeChecked, prettier],

			rules: {
				"prettier/prettier": "warn",

				"react-hooks/rules-of-hooks": "error",
				"react-hooks/exhaustive-deps": "warn",
				"react-refresh/only-export-components": "warn",

				"@typescript-eslint/no-unsafe-assignment": "warn",
				"@typescript-eslint/no-unsafe-member-access": "warn",
				"@typescript-eslint/no-unsafe-call": "warn",

				"@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
			},
		},
	]);
}
