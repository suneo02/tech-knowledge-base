/// <reference types="vite/client" />
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Define entry points for each module
const entries = {
  config: resolve(__dirname, 'src/config/index.ts'),
  corp: resolve(__dirname, 'src/corp/index.ts'),
  corpConfig: resolve(__dirname, 'src/corpConfig/index.ts'),
  download: resolve(__dirname, 'src/download/index.ts'),
  env: resolve(__dirname, 'src/env/index.ts'),
  format: resolve(__dirname, 'src/format/index.ts'),
  hooks: resolve(__dirname, 'src/hooks/index.ts'),
  intl: resolve(__dirname, 'src/intl/index.ts'),
  link: resolve(__dirname, 'src/link/index.ts'),
  typeUtil: resolve(__dirname, 'src/typeUtil/index.ts'),
  misc: resolve(__dirname, 'src/misc/index.ts'),
  storage: resolve(__dirname, 'src/storage/index.ts'),
}

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      }),
      {
        ...copy({
          targets: [
            {
              src: 'src/intl/locales/*.json',
              dest: 'dist/locales',
            },
          ],
          hook: 'writeBundle',
        }),
        apply: 'build',
      },
    ],
    build: {
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      lib: {
        entry: entries,
        formats: ['es'],
      },
      rollupOptions: {
        external: ['qs', 'react', 'react-dom', 'axios', 'lodash', 'path-browserify', 'gel-api'],
        output: {
          // Ensure correct file naming pattern
          entryFileNames: `[name].mjs`,
          // Chunk common dependencies
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Group common dependencies
              if (id.includes('lodash')) return 'vendor-lodash'
              if (id.includes('axios')) return 'vendor-axios'
              return 'vendor'
            }
          },
        },
        // Enable tree-shaking
        treeshake: true,
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    json: {
      stringify: true,
    },
  })
)
