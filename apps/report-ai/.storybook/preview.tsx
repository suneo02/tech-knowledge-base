import type { Preview } from '@storybook/react'
import '@wind/wind-ui/dist/wind-ui.min.css'
import { initialize, mswDecorator } from 'msw-storybook-addon'
import '../../../packages/ai-ui/dist/index.css'
import '../../../packages/gel-ui/dist/index.css'
import { storybookHandlers } from '../src/mocks/handlers'

// 初始化 MSW，忽略非 API 请求的未匹配告警
initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // MSW 配置
    msw: {
      handlers: storybookHandlers, // 使用默认的 handlers
    },
  },
  decorators: [mswDecorator],
}

export default preview
