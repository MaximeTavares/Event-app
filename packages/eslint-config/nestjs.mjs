import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default function createNestConfig(tsconfigRootDir) {
	return defineConfig([
		{
			ignores: [
				"**/node_modules/**",
				"**/dist/**",
				"**/coverage/**",
				"**/prisma/**",
				"**/test/**",
			],
		},

		js.configs.recommended,

		{
			files: ["**/*.ts"],

			languageOptions: {
				parserOptions: {
					tsconfigRootDir: import.meta.dirname,
					projectService: true,
				},

				globals: {
					...globals.node,
					...globals.jest,
				},
			},

			plugins: {
				prettier: prettierPlugin,
			},

			extends: [
				...tseslint.configs.recommendedTypeChecked,
				...tseslint.configs.stylisticTypeChecked,
				prettier,
			],

			rules: {
				"prettier/prettier": ["warn", { endOfLine: "auto" }],
				"@typescript-eslint/no-explicit-any": "warn",
				"@typescript-eslint/no-floating-promises": "warn",
			},
		},
		{
			files: ["**/*.spec.ts"],
			rules: {
				"@typescript-eslint/no-floating-promises": "off",
			},
		},
	]);
}
