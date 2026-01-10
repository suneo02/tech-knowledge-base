/// <reference types="vite/client" />
import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

// 根据环境变量配置不同的 CSS Modules 命名规则
const getCSSModulesConfig = () => {
  return {
    localsConvention: 'camelCase' as const,
    generateScopedName: '[name]__[local]___[hash:base64:5]',
  }
}

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    logLevel: 'warn',
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      }),
      svgr({ svgrOptions: { icon: true } }),
    ],
    css: {
      modules: getCSSModulesConfig(),
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    // 配置公共目录，用于存放静态资源
    publicDir: resolve(__dirname, 'public'),
    build: {
      emptyOutDir: false, // 确保每次构建前清空目录
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      sourcemap: mode === 'development' ? true : false, // 开发环境生成 sourcemap
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'indicator',
        fileName: 'index.mjs',
        formats: ['es'],
      },

      rollupOptions: {
        // 避免打包大型库，显著减小体积
        external: [
          'react',
          'react-dom',
          'xlsx',
          '@wind/wind-ui',
          '@wind/wind-ui-table',
          '@wind/icons',
          'gel-api',
          'gel-ui',
          /^gel-util(\/.*)?$/, // 支持 gel-util 的子路径导出
          'classnames',
          'lodash',
          'dayjs',
          'ahooks',
          '@ant-design/icons',
          'qs',
          'path-browserify',
        ],
        output: {
          format: 'es',
          entryFileNames: `[name].mjs`, // Keep directory structure for submodules
          preserveModules: true,
          preserveModulesRoot: 'src',
          // Ensure CSS is generated as separate files
          assetFileNames: (assetInfo) => {
            // 处理不同类型的资源文件
            if (!assetInfo.name) {
              return 'assets/[name].[ext]'
            }

            if (/\.css$/i.test(assetInfo.name)) {
              return 'index.css'
            }
            return `assets/[name].[ext]`
          },
        },
      },
      cssCodeSplit: false,
      // 确保资源文件被复制到输出目录
      copyPublicDir: true,
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
    // 确保静态资源文件被正确处理
    assetsInclude: ['**/*.xlsx', '**/*.xls'],
    // 开发服务器配置
    server: {
      fs: {
        // 允许服务来自项目根目录以外的文件
        allow: ['..'],
      },
    },
  })
)
