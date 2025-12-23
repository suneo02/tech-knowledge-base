import type { StorybookConfig } from '@storybook/react-vite'

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

      return {
        ...config,
        optimizeDeps: {
          include: ['gel-ui'],
        },
        resolve: {
          ...(config.resolve || {}),
          alias: {
            ...(config.resolve?.alias || {}),
          },
        },
      }
    }
    return config
  },
}
export default config
