import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

// Define entry points for each HTML page

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    logLevel: 'warn',

    assetsInclude: ['**/*.xlsx', '**/*.xls', '**/*.pdf', '**/*.doc', '**/*.docx'],
    root: './',
    base: '', // Using relative paths for flexible deployment
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      AutoImport({
        // 自动导入 jQuery API
        imports: [
          // 预设
          {
            jquery: [
              // 默认导入
              ['default', '$'],
              ['default', 'jQuery'],
            ],
          },
        ],
        // 生成 TypeScript 声明文件
        dts: './auto-imports.d.ts',
        // 生成 ESLint 配置
        eslintrc: {
          enabled: true,
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: false,
      copyPublicDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          other: resolve(__dirname, 'other.html'),
          risk: resolve(__dirname, 'risk.html'),
          contact: resolve(__dirname, 'contact.html'),
        },
        output: {
          manualChunks: {
            vendor: ['jquery'],
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || ''
            const extType = info.split('.').at(1) || ''
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return 'assets/images/[name].[hash][extname]'
            }
            if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              return 'assets/fonts/[name][extname]'
            }
            if (/pdf|docx|xlsx|pptx|doc|xls|ppt/i.test(extType)) {
              return 'assets/documents/[name][extname]'
            }
            return 'assets/[name].[hash][extname]'
          },
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
        },
      },
      minify: isProd ? 'terser' : false,
      sourcemap: !isProd,
    },
    server: {
      port: 8080,
      host: true,
      open: true,
      proxy: {
        '/prod-api': {
          target: 'https://gel.wind.com.cn',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/prod-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Access-Control-Allow-Origin', '*')
            })
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*'
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
              proxyRes.headers['Access-Control-Allow-Headers'] =
                'Origin, X-Requested-With, Content-Type, Accept, wind.sessionid'
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true'
            })
          },
        },
        '/test-api': {
          target: 'https://test.wind.com.cn',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/test-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Access-Control-Allow-Origin', '*')
            })
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*'
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
              proxyRes.headers['Access-Control-Allow-Headers'] =
                'Origin, X-Requested-With, Content-Type, Accept, wind.sessionid'
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true'
            })
          },
        },
      },
    },
  }
})
