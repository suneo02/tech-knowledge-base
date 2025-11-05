import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // 获取项目根目录路径
      const rootPath = resolve(__dirname, '../../../')
      const gelUtilPath = resolve(rootPath, 'packages/gel-util')

      return {
        ...config,
        optimizeDeps: {
          include: [
            'cde',
            'gel-ui',
            'indicator',
            // gel-util 各个子模块
            'gel-util/env',
            'gel-util/intl',
            'gel-util/link',
            'gel-util/format',
            'gel-util/corp',
            'gel-util/config',
            'gel-util/corpConfig',
            'gel-util/download',
            'gel-util/typeUtil',
          ],
          exclude: ['gel-util'],
        },
        resolve: {
          ...(config.resolve || {}),
          alias: {
            ...(config.resolve?.alias || {}),
            // 为每个子模块设置别名
            'gel-util/env': resolve(gelUtilPath, 'dist/env.es.js'),
            'gel-util/intl': resolve(gelUtilPath, 'dist/intl.es.js'),
            'gel-util/link': resolve(gelUtilPath, 'dist/link.es.js'),
            'gel-util/format': resolve(gelUtilPath, 'dist/format.es.js'),
            'gel-util/corp': resolve(gelUtilPath, 'dist/corp.es.js'),
            'gel-util/config': resolve(gelUtilPath, 'dist/config.es.js'),
            'gel-util/corpConfig': resolve(gelUtilPath, 'dist/corpConfig.es.js'),
            'gel-util/download': resolve(gelUtilPath, 'dist/download.es.js'),
            'gel-util/typeUtil': resolve(gelUtilPath, 'dist/typeUtil.es.js'),
          },
        },
      }
    }
    return config
  },
}
export default config
