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
  // 配置静态文件目录
  staticDirs: [
    '../public', // 生产环境资源
    './public', // Storybook专用测试文件
  ],
  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // 获取项目根目录路径
      const rootPath = resolve(__dirname, '../../../')
      const gelUtilPath = resolve(rootPath, 'packages/gel-util')
      return {
        ...config,
        resolve: {
          ...(config.resolve || {}),
          alias: [
            {
              find: '@',
              replacement: resolve(__dirname, '../src'),
            },
            {
              // 解决部分旧版 less 库（如 @wind/wind-ui-form）中 '~@' 写法无法被 Vite 正确解析的问题
              // 该写法意在指向 node_modules，此别名通过移除 '~' 字符，让 Vite 能正确解析路径
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
