import type { StorybookConfig } from '@storybook/html-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  staticDirs: ['../public'], // Serve static files from public directory
  webpackFinal: async (config) => {
    // Get the base directory
    const basePath = path.resolve(__dirname, '../')

    // Configure module resolution
    if (config.resolve) {
      config.resolve.extensions = [
        '.ts',
        '.js',
        '.mjs',
        '.cjs',
        ...(config.resolve.extensions || []),
      ]
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(basePath, 'src'),
      }
    }

    // Configure module rules
    if (config.module?.rules) {
      // Add your specific rules for LESS files
      // Regular LESS files
      config.module.rules.push({
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          'style-loader', // In Storybook, use style-loader instead of MiniCssExtractPlugin.loader
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
      })

      // Module LESS files
      config.module.rules.push({
        test: /\.module\.less$/,
        use: [
          'style-loader', // In Storybook, use style-loader instead of MiniCssExtractPlugin.loader
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
      })
    }

    // Add support for workspace packages
    if (config.module?.rules) {
      // Find the JS/TS rule (typically babel-loader)
      // and modify its exclude pattern to match your webpack config
      try {
        // @ts-ignore - This is a simplistic approach to find the babel loader
        const jsRule = config.module.rules.find(
          (rule) =>
            rule &&
            typeof rule === 'object' &&
            rule.test &&
            rule.test.toString().includes('js'),
        )

        if (jsRule && typeof jsRule === 'object') {
          // @ts-ignore - Set the exclude pattern
          jsRule.exclude = /node_modules\/(?!.*workspace:)/
        }
      } catch (e) {
        console.warn('Could not modify babel-loader rule:', e)
      }
    }

    ;(config as any).devServer = {
      proxy: {
        '/api': {
          target: 'http://wx.wind.com.cn',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          secure: false,
          logLevel: 'debug',
        },
      },
    }
    return config
  },
}

export default config
