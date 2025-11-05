import type { Preview } from '@storybook/react'
import '@wind/wind-ui/dist/wind-ui.min.css'
import '../../../packages/cde/dist/index.css'
import '../../../packages/gel-ui/dist/index.css'
import '../../../packages/indicator/dist/index.css'

import React from 'react'
import { DebugPanel } from '../src/components/debug-panel'

export const decorators = [
  (Story) => (
    <div className="dev-mode">
      <Story />
      <DebugPanel
        style={{
          display: 'flex',
        }}
      />
    </div>
  ),
]
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
