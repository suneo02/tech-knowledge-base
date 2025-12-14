import { RPFileUploaded } from '@/types';
import type { Meta, StoryObj } from '@storybook/react';
import { FileDisplay } from '../../components/File/FileDisplay/index';

const meta: Meta<typeof FileDisplay> = {
  title: 'File/FileDisplay',
  component: FileDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '文件展示组件，仅显示文件名与上传时间。',
      },
    },
  },
  argTypes: {
    files: {
      description: '文件列表',
      control: { type: 'object' },
    },
    onFileRemove: {
      description: '文件删除回调',
      action: 'fileRemoved',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 模拟文件数据
const mockFiles: RPFileUploaded[] = [
  {
    fileId: 'file-001',
    fileName: '财务报表.pdf',
    uploadTime: new Date('2024-01-15T10:30:00').toISOString(),
  },
  {
    fileId: 'file-002',
    fileName: '公司介绍.docx',
    uploadTime: new Date('2024-01-15T10:35:00').toISOString(),
  },
  {
    fileId: 'file-003',
    fileName: '市场分析.xlsx',
    uploadTime: new Date('2024-01-15T10:40:00').toISOString(),
  },
  {
    fileId: 'file-004',
    fileName: '投资报告.pdf',
    uploadTime: new Date('2024-01-15T10:45:00').toISOString(),
  },
];

// 基础用法
export const Default: Story = {
  args: {
    files: mockFiles,
  },
};

// 空状态
export const Empty: Story = {
  args: {
    files: [],
  },
};

// 单个文件
export const SingleFile: Story = {
  args: {
    files: [mockFiles[0]],
  },
};

// 仅部分文件
export const MaterialFilesOnly: Story = {
  args: {
    files: mockFiles.slice(0, 2),
  },
};

// 移除仅大纲文件示例（已不区分类型）

// 移除状态示例（组件不再展示状态）

// 移除状态示例（组件不再展示状态）

// 长文件名
export const LongFileName: Story = {
  args: {
    files: [
      {
        fileId: 'file-009',
        fileName: '这是一个非常长的文件名，用来测试组件在文件名过长时的显示效果.pdf',
        uploadTime: new Date('2024-01-15T11:20:00').toISOString(),
      },
    ],
  },
};

// 移除混合状态示例（组件不再展示状态）
