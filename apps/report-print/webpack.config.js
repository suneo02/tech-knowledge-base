import CopyPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const { DefinePlugin } = webpack

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Determine environment
const isDev = process.env.NODE_ENV !== 'production'

export default {
  // 配置多入口
  entry: {
    credit: './src/pages/creditEntry.ts',
    creditEvaluation: './src/pages/creditEvaluationEntry.ts',
  },
  output: {
    filename: 'js/[name].[contenthash].js', // 使用contenthash代替简单的bundle.js
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    clean: true, // 在每次构建前清理 dist 文件夹
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.cjs'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devtool: isDev ? 'source-map' : false,

  optimization: {
    runtimeChunk: 'single', // 将webpack运行时代码提取到单独文件
    moduleIds: 'deterministic', // 使模块ID稳定，防止不必要的hash变化
    minimize: false,
    // 提取共享依赖并自动拆分
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10, // 允许更多的初始请求
      maxAsyncRequests: 10, // 允许更多的异步请求
      minSize: 20000, // 最小尺寸20KB
      maxSize: 100000, // 最大尺寸约100KB，超过此大小将尝试分割
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // 获取包名，如node_modules/packageName/...
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1]
            return packageName ? `vendor.${packageName.replace('@', '')}` : 'vendor'
          },
          priority: 10,
        },
        common: {
          // 提取两个入口点之间共享的代码
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
  },
  module: {
    rules: [
      // 转换所有JS/TS文件，包括monorepo package
      {
        test: /\.(ts|js|mjs)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 确保转换所有ES6+ 语法
                    targets: {
                      browsers: ['last 2 versions', 'ie >= 11'],
                    },
                  },
                ],
                '@babel/preset-typescript',
              ],
              plugins: [
                // 可以添加额外的babel插件
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      // 处理CSS文件
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // 处理普通 Less 文件
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // 处理 Less 模块文件
      {
        test: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Add Dotenv webpack plugin
    new Dotenv({
      path: `.env.${process.env.NODE_ENV || 'development'}`,
      safe: false, // If true, load '.env.example' to verify the '.env' variables are all set
      systemvars: true, // Load all system environment variables as well
      defaults: false, // Whether to load '.env.defaults' if '.env' file is missing
    }),
    // Add DefinePlugin to inject only non-dotenv environment variables
    new DefinePlugin({
      // Only define NODE_ENV, let Dotenv handle the rest
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // 企业深度信用报告页面
    new HtmlWebpackPlugin({
      template: './public/creditTemplate.html',
      filename: 'creditrp.html',
      chunks: ['credit', 'common'], // 只包含主入口和common依赖
      minify: false, // 不压缩HTML
    }),
    // 授信报告页面
    new HtmlWebpackPlugin({
      template: './public/creditEvaluationTemplate.html',
      filename: 'creditevaluationrp.html',
      chunks: ['creditEvaluation', 'common'], // 只包含主入口和common依赖
      minify: false, // 不压缩HTML
    }),
    // 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: 'styles/[id].[contenthash].css',
    }),
    // 复制样式文件到dist目录
    new CopyPlugin({
      patterns: [
        // Add this new pattern for the public directory
        {
          from: 'public',
          to: '.', // Copies to the root of the dist directory
          globOptions: {
            dot: true, // Important to copy dotfiles like .htaccess if any
            gitignore: true, // Respects .gitignore if you have one in public/
            ignore: ['**/creditTemplate.html', '**/creditEvaluationTemplate.html'], // Example: if your HtmlWebpackPlugin handles index.html
          },
          noErrorOnMissing: true, // Prevents error if public directory doesn't exist
        },
      ],
    }),
  ],
}
