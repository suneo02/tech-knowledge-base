import type { Preview } from '@storybook/react'

import '@wind/wind-ui/dist/wind-ui.min.css'
import '../../../packages/gel-ui/dist/index.css'
import '../../../packages/indicator/dist/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
