/// <reference types="vite/client" />
import { resolve } from 'path'
import { defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

// 定义各个模块的入口点
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  'corp/index': resolve(__dirname, 'src/corp/index.ts'),
  'validation/index': resolve(__dirname, 'src/validation/index.ts'),
}

export default defineConfig(
  ({ mode }): UserConfig => ({
    logLevel: 'warn',
    plugins: [
      dts({
        outDir: 'dist/types',
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      }),
    ],
    build: {
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩
      lib: {
        entry: entries,
        formats: ['es'],
      },
      rollupOptions: {
        external: ['gel-types', 'gel-api'],
        output: {
          format: 'es',
          exports: 'named',
          // 使用 .mjs 作为 ESM 格式的扩展名
          entryFileNames: '[name].mjs',
          // 保留模块结构以支持 tree-shaking
          preserveModules: true,
          preserveModulesRoot: 'src',
          // 资源文件放在单独目录
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // 启用 tree-shaking
        treeshake: true,
      },
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  })
)
