import type { Preview } from '@storybook/react'

import '@wind/wind-ui/dist/wind-ui.min.css'
import '../../gel-ui/dist/index.css'

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
