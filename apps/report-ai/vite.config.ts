import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type ConfigEnv, type ProxyOptions, type UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'development';

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
  };

  const plugins = [react(), svgr({ svgrOptions: { icon: true } })];

  return {
    plugins,
    css: {
      modules: {
        // 开启 camelCase 格式的类名
        localsConvention: 'camelCase' as const,
        // 类名前缀，用于避免命名冲突
        generateScopedName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:5]',
      },
      preprocessorOptions: {
        less: {
          // Less 配置项
          javascriptEnabled: true,
          // 添加全局 Less 变量或 mixins 文件（如果需要）
          // additionalData: `@import "@/styles/variables.less";`
        },
      },
      // 开启 CSS 代码分割
      devSourcemap: isDev,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
        {
          // 解决部分旧版 less 库（如 @wind/wind-ui-form）中 '~@' 写法无法被 Vite 正确解析的问题
          // 该写法意在指向 node_modules，此别名通过移除 '~' 字符，让 Vite 能正确解析路径
          find: /^~/,
          replacement: '',
        },
      ],
    },
    base: './',
    // 配置公共目录，确保模板文件被正确复制
    publicDir: path.resolve(__dirname, 'public'),
    server: {
      port: 3090,
      host: true,
      proxy: isDev ? devProxy : {},
    },
    build: {
      // 设置构建目标浏览器，提高兼容性
      target: 'es2015',
      // 提高构建性能
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // 确保公共目录中的文件被复制到构建目录
      copyPublicDir: true,
      // 添加代码分割和懒加载优化配置
      minify: !isDev ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev,
        },
        // 防止变量重用导致的初始化顺序问题
        mangle: {
          toplevel: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      },
      // 设置CSS代码分割
      cssCodeSplit: true,
      // 启用源码映射（仅在开发模式）
      sourcemap: isDev,
      // 分块策略
      chunkSizeWarningLimit: 1000, // 提高警告阈值，单位kb
      rollupOptions: {
        // 关键改变：最大程度减少代码分割，使全部代码打包在一起避免初始化顺序问题
        output: {
          // 采用更简单的分块策略，减少组件互相依赖引起的问题
          manualChunks: {
            // 将所有第三方库打包在一个文件中，确保它们一起加载
            vendor: ['react', 'react-dom', 'antd', 'react-router-dom'],

            // 简化其他第三方库分组，减少依赖交叉
            'vendor-other': [],

            // 处理业务代码，但不再进行太细粒度的拆分
            app: [],
          },
          // 入口与分块文件名
          entryFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name]-[hash].js',
          chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name]-[hash].js',
          assetFileNames: isDev ? 'assets/[ext]/[name].[ext]' : 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 加载优化
      modulePreload: {
        polyfill: true,
      },
    },
    // 确保处理组件库中的静态资源
    assetsInclude: ['**/*.xlsx', '**/*.xls'],
    // 优化依赖预构建
    optimizeDeps: {
      // 强制预构建这些依赖
      include: ['react', 'react-dom', 'react-router-dom', 'antd', '@wind/wind-ui', 'lodash-es', 'dayjs'],
      // 强制排除这些依赖不进行预构建
      exclude: [],
    },
    // 针对初始化顺序问题进行优化
    esbuild: {
      // 保留类名和函数名，避免压缩引起的顺序问题
      keepNames: true,
    },
  };
});
