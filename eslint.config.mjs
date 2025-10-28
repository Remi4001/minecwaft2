import globals from 'globals';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
    js.configs.recommended,
    jsdoc.configs['flat/recommended'],
    {
        rules: {
            'array-callback-return': ['error', { checkForEach: true }],
            'arrow-body-style': 'error',
            curly: ['error', 'multi-line', 'consistent'],
            'dot-notation': 'error',
            eqeqeq: 'error',
            'logical-assignment-operators': [
                'error',
                'always',
                { enforceForIfStatements: true },
            ],
            'max-nested-callbacks': ['error', { max: 4 }],
            'no-console': 'off',
            'no-duplicate-imports': 'error',
            'no-empty-function': 'error',
            'no-implicit-coercion': 'error',
            'no-inline-comments': 'warn',
            'no-lonely-if': 'error',
            'no-magic-numbers': ['warn', { ignoreArrayIndexes: true }],
            'no-nested-ternary': 'error',
            'no-promise-executor-return': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
            'no-template-curly-in-string': 'warn',
            'no-unmodified-loop-condition': 'warn',
            'no-unneeded-ternary': 'error',
            'no-unreachable-loop': 'warn',
            'no-use-before-define': ['error', { functions: false }],
            'no-useless-assignment': 'error',
            'no-var': 'error',
            'object-shorthand': 'warn',
            'prefer-const': 'error',
            'require-atomic-updates': 'error',
            'sort-imports': 'error',
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
