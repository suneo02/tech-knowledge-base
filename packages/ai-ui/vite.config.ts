/// <reference types="vite/client" />
import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      }),
      svgr({ svgrOptions: { icon: true } }),
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
        name: 'ai-ui',
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
          '@ant-design/x',
          'axios',
          '@wind/icons',
          '@wind/wind-ui',
          '@wind/wind-ui-table',
          '@wind/wind-ui-form',
          '@wind/chart-builder',
          'ahooks',
          'antd',
          'classnames',
          'dayjs',
          'gel-api',
          /^gel-util(\/.*)?$/, // 支持 gel-util 的子路径导出
          'lodash',
          'path-browserify',
          'markdown-it',
          'markdown-it-highlightjs',
          'highlight.js',
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
