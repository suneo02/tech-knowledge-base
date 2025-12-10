/// <reference types="vite/client" />
import { resolve } from 'path'
import { defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Define module entry points based on webpack.config.js
const entries = {
  'constants/index': resolve(__dirname, 'src/constants/index.ts'),
  'corpConfigJson/index': resolve(__dirname, 'src/corpConfigJson/index.ts'),
  'format/index': resolve(__dirname, 'src/format/index.ts'),
  'misc/index': resolve(__dirname, 'src/misc/index.ts'),
  'table/index': resolve(__dirname, 'src/table/index.ts'),
  'types/index': resolve(__dirname, 'src/types/index.ts'),
  'url/index': resolve(__dirname, 'src/url/index.ts'),
  'tree/index': resolve(__dirname, 'src/tree/index.ts'),
}

export default defineConfig(
  ({ mode }): UserConfig => ({
    logLevel: 'warn',
    plugins: [
      dts({
        outDir: 'dist/types',
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'], // Assuming similar test file pattern
      }),
    ],
    build: {
      emptyOutDir: false, // 确保每次构建前清空目录
      minify: mode === 'development' ? false : 'esbuild',
      lib: {
        entry: entries,
        formats: ['es'],
      },
      rollupOptions: {
        external: ['gel-types', 'gel-api'], // Common external dependencies
        output: {
          format: 'es',
          entryFileNames: `[name].mjs`, // Keep directory structure for submodules
          preserveModules: true,
          preserveModulesRoot: 'src',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        treeshake: mode !== 'development',
      },
      sourcemap: mode === 'development' ? 'inline' : true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  })
)
