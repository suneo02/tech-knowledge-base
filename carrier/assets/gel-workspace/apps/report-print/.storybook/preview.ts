import type { Preview } from '@storybook/html'
import '../src/styles/reset.less'
// Remove the reference to the non-existent CSS file
// import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true, // Add table of contents to docs
      // Add more configurations for the docs if needed
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f8f8' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
}

export default preview
