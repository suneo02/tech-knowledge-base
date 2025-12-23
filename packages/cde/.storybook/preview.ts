import type { Preview } from '@storybook/react'
import '../../gel-ui/dist/index.css'

import '@wind/wind-ui/dist/wind-ui.min.css'
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
