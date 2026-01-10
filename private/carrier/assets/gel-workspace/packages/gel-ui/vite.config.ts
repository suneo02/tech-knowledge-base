/// <reference types="vite/client" />
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
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
      svgr({
        svgrOptions: { icon: true },
        // 支持多种导入方式
        include: '**/*.svg?react',
      }),
      // Removed CSS-in-JS plugin as we want to extract CSS to separate files
      {
        ...copy({
          targets: [
            { src: 'src/styles/shared', dest: 'dist/styles' },
            { src: 'src/styles/mixin', dest: 'dist/styles' },
          ],
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
      emptyOutDir: false, // 确保每次构建前清空目录
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      sourcemap: mode === 'development' ? true : false, // 开发环境生成 sourcemap
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
          '@ant-design/x',
          '@wind/icons',
          '@wind/wind-ui',
          '@wind/wind-ui-table',
          '@wind/wind-ui-form',
          '@wind/wui-alice-logo',
          '@tinymce/tinymce-react',
          '@toast-ui/editor',
          '@toast-ui/react-editor',
          'ahooks',
          'antd',
          'classnames',
          'dayjs',
          'gel-api',
          /^gel-util(\/.*)?$/, // 支持 gel-util 的子路径导出
          'gel-types',
          'axios',
          'tinymce',
          'qs',
          'path-browserify',
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
            }
            return `assets/[name].[ext]`
          },
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
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
        {
          // 解决部分旧版 less 库（如 @wind/wind-ui-form）中 '~@' 写法无法被 Vite 正确解析的问题
          // 该写法意在指向 node_modules，此别名通过移除 '~' 字符，让 Vite 能正确解析路径
          find: /^~/,
          replacement: '',
        },
      ],
    },
    // 添加对 SVG 字符串导入的支持
    assetsInclude: ['**/*.svg'],
  })
)
