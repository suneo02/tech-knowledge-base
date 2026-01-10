import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-onboarding', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    const rules = config.module?.rules ? [...config.module.rules] : []

    // 确保 TS/TSX 通过 Babel 编译（处理 import type 等语法）
    rules.unshift({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
      ],
    })

    // 处理 JS/JSX 文件
    rules.unshift({
      test: /\.(js|jsx|mjs)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
            ],
          },
        },
      ],
    })

    // Rule for .module.less files
    rules?.push({
      test: /\.module\.less$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              exportLocalsConvention: 'camelCase',
            },
          },
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#00aec7',
                'link-color': '#0596b3',
              },
            },
          },
        },
      ],
    })

    // Rule for other .less files
    rules?.push({
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#00aec7',
                'link-color': '#0596b3',
              },
            },
          },
        },
      ],
    })
    if (config.module) {
      config.module.rules = rules
    }

    // Add path aliases and src directory resolution
    if (config.resolve) {
      // Get project root path
      const rootPath = path.resolve(__dirname, '../../../')
      const gelUtilPath = path.resolve(rootPath, 'packages/gel-util')

      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        src: path.resolve(__dirname, '../src'),
        'gel-util/env': path.resolve(gelUtilPath, 'dist/env.mjs'),
        'gel-util/intl': path.resolve(gelUtilPath, 'dist/intl.mjs'),
        'gel-util/link': path.resolve(gelUtilPath, 'dist/link.mjs'),
        'gel-util/format': path.resolve(gelUtilPath, 'dist/format.mjs'),
        'gel-util/translate': path.resolve(gelUtilPath, 'dist/misc/translate/core.mjs'),
        'gel-util/corp': path.resolve(gelUtilPath, 'dist/corp.mjs'),
        'gel-util/config': path.resolve(gelUtilPath, 'dist/config.mjs'),
        'gel-util/corpConfig': path.resolve(gelUtilPath, 'dist/corpConfig.mjs'),
        'gel-util/download': path.resolve(gelUtilPath, 'dist/common/download.mjs'),
        'gel-util/typeUtil': path.resolve(gelUtilPath, 'dist/typeUtil.mjs'),
      }

      // Ensure we check the src directory when resolving modules
      if (config.resolve.modules) {
        config.resolve.modules.push(path.resolve(__dirname, '../src'))
      } else {
        config.resolve.modules = [path.resolve(__dirname, '../src'), 'node_modules']
      }
    }

    // Add optimization for monorepo packages
    if (config.optimization && typeof config.optimization.splitChunks !== 'boolean') {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...(config.optimization.splitChunks?.cacheGroups || {}),
          gelUtil: {
            test: /[\\/]gel-util[\\/]dist[\\/]/,
            name: 'gel-util',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }

    return config
  },
}
export default config
