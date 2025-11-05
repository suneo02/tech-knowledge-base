/// <reference types="vite/client" />
import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      }),
    ],
    build: {
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'gel-api',
        fileName: 'index.mjs',
        formats: ['es'],
      },
      rollupOptions: {
        external: ['qs', 'react', 'react-dom', 'axios', 'antd', 'gel-types', 'gel-util', 'lodash', 'path-browserify'],
        output: {},
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  })
)
