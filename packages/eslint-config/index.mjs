import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export const base = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
];

export const nodeConfig = [
    ...base,
    {
        languageOptions: {
            sourceType: 'commonjs',
        },
    },
];

export const typedNodeConfig = [
    ...base,
    ...tseslint.configs.recommendedTypeChecked,
];