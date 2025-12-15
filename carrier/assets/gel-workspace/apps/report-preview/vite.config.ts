import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type ConfigEnv, type ProxyOptions, type UserConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'development'

  // 开发环境代理配置
  const devProxy: Record<string, ProxyOptions> = {
    '/api/xtest': {
      target: 'https://test.wind.com.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/xtest/, ''),
    },
    '/api/xsh': {
      target: 'https://114.80.154.45',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/xsh/, ''),
    },
    '/api/xnj': {
      target: 'https://180.96.8.44',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/xnj/, ''),
    },
  }

  const plugins = [react(), svgr({ svgrOptions: { icon: true } })]

  // 只在构建分析模式下添加可视化分析插件
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      })
    )
  }

  return {
    logLevel: 'warn',
    base: './',
    plugins,
    // 多页面配置
    build: {
      // 设置构建目标浏览器
      target: 'es2015',
      // 提高构建性能
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // 生产环境优化
      minify: !isDev ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev,
        },
      },
      // 设置CSS代码分割
      cssCodeSplit: true,
      // 启用源码映射（仅在开发模式）
      sourcemap: isDev,
      // 分块策略
      chunkSizeWarningLimit: 1000, // 提高警告阈值，单位kb
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
        },
        output: {
          // 采用更简单的分块策略
          manualChunks: {
            // 将所有第三方库打包在一个文件中
            vendor: ['react', 'react-dom'],
            // 其他第三方库
            'vendor-other': [],
          },
          // 入口与分块文件名
          entryFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name]-[hash].js',
          chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name]-[hash].js',
          assetFileNames: isDev ? 'assets/[ext]/[name].[ext]' : 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          // 解决部分旧版 less 库（如 @wind/wind-ui-form）中 '~@' 写法无法被 Vite 正确解析的问题
          // 该写法意在指向 node_modules，此别名通过移除 '~' 字符，让 Vite 能正确解析路径
          find: /^~/,
          replacement: '',
        },
      ],
    },

    // 开发服务器配置
    server: {
      port: 3020,
      open: true,
      proxy: isDev ? devProxy : {},
    },

    // CSS 配置
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:5]',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      // 开启 CSS 源码映射
      devSourcemap: isDev,
    },

    // 优化依赖预构建
    optimizeDeps: {
      // 强制预构建这些依赖
      include: ['react', 'react-dom'],
      // 强制排除这些依赖不进行预构建
      exclude: [],
    },
  }
})
