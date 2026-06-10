// packages/eslint-config/nestjs.mjs

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default function createNestConfig(tsconfigRootDir) {
    return defineConfig([
        {
            ignores: [
                '**/node_modules/**',
                '**/dist/**',
                '**/coverage/**',
                '**/prisma/**',
                '**/test/**',
            ],
        },

        js.configs.recommended,

        ...tseslint.configs.recommendedTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,

        prettier,

        {
            files: ['**/*.ts'],

            plugins: {
                prettier: prettierPlugin,
            },

            languageOptions: {
                globals: {
                    ...globals.node,
                    ...globals.jest,
                },

                parserOptions: {
                    project: ['./tsconfig.json'],
                    tsconfigRootDir,
                },
            },

            rules: {
                'prettier/prettier': ['warn', { endOfLine: 'auto' }],

                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-floating-promises': 'warn',
            },
        },
    ]);
}