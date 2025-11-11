/// <reference types="vite/client" />
import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    logLevel: 'warn',
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
      emptyOutDir: false, // 确保每次构建前清空目录
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'report-preview-ui',
        fileName: 'index.mjs',
        formats: ['es'],
      },
      target: 'es2015',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        external: [
          'axios',
          'react',
          'react-dom',
          '@wind/icons',
          '@wind/wind-ui',
          'ahooks',
          'classnames',
          'dayjs',
          'lodash',
          'path-browserify',
          'gel-api',
          /^gel-util(\/.*)?$/, // 支持 gel-util 的子路径导出
          'gel-ui',
          'detail-page-config',
          'report-util',
        ],
        output: {
          format: 'es',
          entryFileNames: `[name].mjs`, // Keep directory structure for submodules
          preserveModules: true,
          preserveModulesRoot: 'src',
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) {
              return 'assets/[name].[ext]'
            }

            if (/\.css$/i.test(assetInfo.name)) {
              return 'index.css'
            } else {
              return `assets/[name].[ext]`
            }
          },
        },
        onwarn(warning, warn) {
          // 忽略 "use client" 指令相关的警告
          if (warning.message.includes('Module level directives')) {
            return
          }
          warn(warning)
        },
        treeshake: mode !== 'development',
      },
      cssCodeSplit: false, // Disable CSS code splitting to get a single CSS file
      // 添加 CommonJS 转换配置，解决 require is not defined 问题
      commonjsOptions: {
        transformMixedEsModules: true,
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
