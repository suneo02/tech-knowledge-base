import type { StorybookConfig } from '@storybook/react-vite'
import { readdirSync } from 'fs'
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
  staticDirs: ['./public'],
  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      const rootPath = resolve(__dirname, '../../../')
      const gelUtilPath = resolve(rootPath, 'packages/gel-util')
      const gelUtilSrcPath = resolve(gelUtilPath, 'src')
      const gelUtilSubmodules = readdirSync(gelUtilSrcPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name !== '__tests__' && dirent.name !== '__test__')
        .map((dirent) => `gel-util/${dirent.name}`)
      return {
        ...config,
        optimizeDeps: {
          include: [...gelUtilSubmodules],
        },
        resolve: {
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
