/// <reference types="vite/client" />
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    logLevel: 'warn',
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      }),
      // Removed CSS-in-JS plugin as we want to extract CSS to separate files
      {
        ...copy({
          targets: [{ src: 'src/styles/shared', dest: 'dist/styles' }],
          hook: 'writeBundle',
        }),
        apply: 'build',
      },
    ],
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'gel-ui',
        fileName: 'index.mjs',
        formats: ['es'],
      },
      target: 'es2015',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          '@ant-design/icons',
          '@wind/icons',
          '@wind/wind-ui',
          '@wind/wind-ui-table',
          'ahooks',
          'antd',
          'classnames',
          'dayjs',
          'gel-api',
          'gel-util',
          'gel-types',
          'lodash',
          'axios',
          'qs',
          'path-browserify',
        ],
        output: {
          // Ensure CSS is generated as separate files
          assetFileNames: 'index.[ext]',
        },
        onwarn(warning, warn) {
          // 忽略 "use client" 指令相关的警告
          if (warning.message.includes('Module level directives')) {
            return
          }
          warn(warning)
        },
      },
      cssCodeSplit: false, // Disable CSS code splitting to get a single CSS file
      // 添加 CommonJS 转换配置，解决 require is not defined 问题
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  })
)
