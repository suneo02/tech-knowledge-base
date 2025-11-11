import type { Meta, StoryObj } from '@storybook/react';

import { reportOutlineRes2 } from '@/mocks/reportOutline/res2';
import { useState } from 'react';
import { FreeOutlineEditor, FreeOutlineEditorProps } from '../../components';

const meta: Meta<typeof FreeOutlineEditor> = {
  title: 'Report/FreeOutlineEditor',
  component: FreeOutlineEditor,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'onChange' },
    readOnly: { control: 'boolean' },
    debounce: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<FreeOutlineEditorProps>;

const Template = (args: FreeOutlineEditorProps) => {
  const [value, setValue] = useState(args.initialValue ?? reportOutlineRes2);
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
        <FreeOutlineEditor {...args} onChange={setValue} />
        <h3>value 值</h3>
        <span>{value}</span>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    initialValue: reportOutlineRes2,
    readOnly: false,
    debounce: 300,
  },
};

export const ReadOnly: Story = {
  render: Template,
  args: {
    ...Default.args,
    readOnly: true,
  },
};

export const Empty: Story = {
  render: Template,
  args: {
    ...Default.args,
    initialValue: '',
  },
};
