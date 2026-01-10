import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

// eslint-disable-next-line no-undef
if (typeof global.structuredClone !== 'function') {
  // eslint-disable-next-line no-undef
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    extends: ['plugin:react/jsx-runtime'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 // @ts-nocheck
    },
  },
]
