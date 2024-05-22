import globals from 'globals';
import js from '@eslint/js';


export default [
    js.configs.recommended,
    {
        rules: {
            'arrow-spacing': ['warn', { 'before': true, 'after': true }],
            'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': 'error',
            'comma-style': 'error',
            curly: ['error', 'multi-line', 'consistent'],
            'dot-location': ['error', 'property'],
            'handle-callback-err': 'off',
            indent: ['error', 4, { 'SwitchCase': 1 }],
            'keyword-spacing': 'error',
            'max-nested-callbacks': ['error', { 'max': 4 }],
            'max-statements-per-line': ['error', { 'max': 2 }],
            'max-len': ['warn', 80],
            'no-console': 'off',
            'no-empty-function': 'error',
            'no-floating-decimal': 'error',
            'no-inline-comments': 'warn',
            'no-lonely-if': 'error',
            'no-multi-spaces': 'error',
            'no-multiple-empty-lines': ['error',
                { max: 2, maxEOF: 1, maxBOF: 0 }],
            'no-shadow': ['error', { 'allow': ['err', 'resolve', 'reject'] }],
            'no-trailing-spaces': ['error'],
            'no-var': 'error',
            'object-curly-spacing': ['error', 'always'],
            'prefer-const': 'error',
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-blocks': 'error',
            'space-before-function-paren': ['error', {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            }],
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'spaced-comment': 'error',
            yoda: 'error',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.es5,
            },
        },
    },
];
