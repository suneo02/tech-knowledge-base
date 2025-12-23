import type { StorybookConfig } from '@storybook/react-vite'
import { readdirSync } from 'fs'
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
      const gelUtilSrcPath = resolve(gelUtilPath, 'src')
      const gelUtilSubmodules = readdirSync(gelUtilSrcPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name !== '__test__')
      .map((dirent) => `gel-util/${dirent.name}`) // 获取 gel-util 的子模块
      return {
        ...config,
        optimizeDeps: {
          include: [...gelUtilSubmodules, 'gel-ui', 'cde', 'indicator', 'gel-api'],
        },
        resolve: {
          ...(config.resolve || {}),
          alias: [
            {
              find: '@',
              replacement: resolve(__dirname, '../src'),
            },
            {
              find: /^~/,
              replacement: '',
            },
            {
              find: /^gel-util\/(.*)/,
              replacement: resolve(gelUtilPath, 'dist/$1.mjs'),
            },
          ],
        },
      }
    }
    return config
  },
}
export default config
