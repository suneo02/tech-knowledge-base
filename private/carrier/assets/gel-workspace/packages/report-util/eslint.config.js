import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**', '*.min.js', 'src/resource/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      semi: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'double'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='filter']",
          message: 'Array.filter方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='reduce']",
          message: 'Array.reduce方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='find']",
          message: 'Array.find方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='findIndex']",
          message:
            'Array.findIndex方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='some']",
          message: 'Array.some方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='every']",
          message: 'Array.every方法会在部分浏览器中不兼容，请使用for循环代替',
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='filter']",
          message: 'Array.filter方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='reduce']",
          message: 'Array.reduce方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='find']",
          message: 'Array.find方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='findIndex']",
          message:
            'Array.findIndex方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='some']",
          message: 'Array.some方法会在部分浏览器中不兼容，请使用for循环代替',
        },
        {
          selector: "CallExpression[callee.property.name='every']",
          message: 'Array.every方法会在部分浏览器中不兼容，请使用for循环代替',
        },
      ],
    },
  },
  prettierConfig,
]
