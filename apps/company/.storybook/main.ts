import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // First, remove the existing rule for LESS if it exists from storybook default
    const rules = config.module?.rules?.filter(
      (rule) => rule && typeof rule === 'object' && rule.test && !rule.test.toString().includes('less')
    )

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
        // Add gel-util submodules aliases
        'gel-util/env': path.resolve(gelUtilPath, 'dist/env.es.js'),
        'gel-util/intl': path.resolve(gelUtilPath, 'dist/intl.es.js'),
        'gel-util/link': path.resolve(gelUtilPath, 'dist/link.es.js'),
        'gel-util/format': path.resolve(gelUtilPath, 'dist/format.es.js'),
        'gel-util/translate': path.resolve(gelUtilPath, 'dist/translate.es.js'),
        'gel-util/corp': path.resolve(gelUtilPath, 'dist/corp.es.js'),
        'gel-util/config': path.resolve(gelUtilPath, 'dist/config.es.js'),
        'gel-util/corpConfig': path.resolve(gelUtilPath, 'dist/corpConfig.es.js'),
        'gel-util/download': path.resolve(gelUtilPath, 'dist/download.es.js'),
        'gel-util/typeUtil': path.resolve(gelUtilPath, 'dist/typeUtil.es.js'),
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
            test: /[\\/]node_modules[\\/]gel-util[\\/]/,
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
