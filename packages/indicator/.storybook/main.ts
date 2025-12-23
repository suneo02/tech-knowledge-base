import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
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
            'gel-ui',
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
            'gel-util/env': resolve(gelUtilPath, 'dist/env.mjs'),
            'gel-util/intl': resolve(gelUtilPath, 'dist/intl.mjs'),
            'gel-util/link': resolve(gelUtilPath, 'dist/link.mjs'),
            'gel-util/format': resolve(gelUtilPath, 'dist/format.mjs'),
            'gel-util/corp': resolve(gelUtilPath, 'dist/corp.mjs'),
            'gel-util/config': resolve(gelUtilPath, 'dist/config.mjs'),
            'gel-util/corpConfig': resolve(gelUtilPath, 'dist/corpConfig.mjs'),
            'gel-util/download': resolve(gelUtilPath, 'dist/download.mjs'),
            'gel-util/typeUtil': resolve(gelUtilPath, 'dist/typeUtil.mjs'),
          },
        },
      }
    }
    return config
  },
}
export default config
