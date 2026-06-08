import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.pnpm/**",
			"**/eslint.config.*",
            "**/prisma/*",
            "**/test/*"
		],
	},

	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,

	prettier,

	{
		languageOptions: {
			ecmaVersion: 2022,
		},
	},
);
