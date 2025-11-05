import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      include: ['src/**/*.ts'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'types',
      fileName: 'index.mjs',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        // 保留模块结构
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    minify: false, // 类型包不需要压缩
    sourcemap: true,
  },
})
