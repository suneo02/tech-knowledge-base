import type { Meta, StoryObj } from '@storybook/react';
import { AliceGenerating } from './index';

const meta: Meta<typeof AliceGenerating> = {
  title: 'Report/RPContentExternal/RPGenerating',
  component: AliceGenerating,
  parameters: {
    docs: {
      description: {
        component:
          '生成中提示组件。此组件在 TinyMCE iframe 内渲染时会使用全局 CSS（rpGenerating.css 与 statusTip.css）。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AliceGenerating>;

export const Default: Story = {
  args: {
    onStop: () => {
      // eslint-disable-next-line no-console
      console.log('Stop clicked');
    },
  },
};
