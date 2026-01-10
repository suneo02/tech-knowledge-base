import { RPFileUploaded } from '@/types';
import type { Meta, StoryObj } from '@storybook/react';
import { OutlineFileItem } from '../../components/File/OutlineFileItem';

const meta: Meta<typeof OutlineFileItem> = {
  title: 'File/FileItem',
  component: OutlineFileItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '文件项组件，用于显示单个文件的信息，包括文件名、上传时间、上传进度等。',
      },
    },
  },
  argTypes: {
    file: {
      description: '文件信息对象',
    },
    onRemove: {
      description: '删除文件回调',
      action: 'fileRemoved',
    },
    showRemoveButton: {
      description: '是否显示删除按钮',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 创建不同类型的文件数据
const createMockFile = (fileName: string, uploadProgress?: number): RPFileUploaded => ({
  fileId: `file-${Math.random().toString(36).substr(2, 9)}`,
  fileName,
  uploadTime: new Date().toISOString(),
  uploadProgress,
});

// Word 文件 - 完成状态
export const WordFileCompleted: Story = {
  args: {
    file: createMockFile('财务报告模板.docx', 100),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Word 文件完成状态，显示蓝色背景和对勾图标。',
      },
    },
  },
};

// Excel 文件 - 完成状态
export const ExcelFileCompleted: Story = {
  args: {
    file: createMockFile('数据分析表.xlsx', 100),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Excel 文件完成状态，显示绿色背景和对勾图标。',
      },
    },
  },
};

// PDF 文件 - 完成状态
export const PDFFileCompleted: Story = {
  args: {
    file: createMockFile('用户手册.pdf', 100),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'PDF 文件完成状态，显示红色背景和对勾图标。',
      },
    },
  },
};

// 其他文件 - 完成状态
export const OtherFileCompleted: Story = {
  args: {
    file: createMockFile('配置文件.txt', 100),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: '其他类型文件完成状态，显示灰色背景和对勾图标。',
      },
    },
  },
};

// Word 文件 - 上传中
export const WordFileUploading: Story = {
  args: {
    file: createMockFile('财务报告模板.docx', 45),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Word 文件上传中状态，显示蓝色背景和进度圆圈。',
      },
    },
  },
};

// Excel 文件 - 上传中
export const ExcelFileUploading: Story = {
  args: {
    file: createMockFile('数据分析表.xlsx', 67),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Excel 文件上传中状态，显示绿色背景和进度圆圈。',
      },
    },
  },
};

// PDF 文件 - 上传中
export const PDFFileUploading: Story = {
  args: {
    file: createMockFile('用户手册.pdf', 23),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'PDF 文件上传中状态，显示红色背景和进度圆圈。',
      },
    },
  },
};

// 其他文件 - 上传中
export const OtherFileUploading: Story = {
  args: {
    file: createMockFile('配置文件.txt', 89),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: '其他类型文件上传中状态，显示灰色背景和进度圆圈。',
      },
    },
  },
};

// 多个文件展示
export const MultipleFiles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <OutlineFileItem file={createMockFile('财务报告.docx', 100)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('数据表.xlsx', 78)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('说明书.pdf', 45)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('配置.txt', 100)} showRemoveButton={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示多个不同类型和状态的文件项，验证背景色和进度显示是否正确。',
      },
    },
  },
};

// 无删除按钮
export const WithoutRemoveButton: Story = {
  args: {
    file: createMockFile('只读文件.docx', 100),
    showRemoveButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: '不显示删除按钮的文件项。',
      },
    },
  },
};

// 长文件名测试
export const LongFileName: Story = {
  args: {
    file: createMockFile('这是一个非常长的文件名用来测试文本溢出处理效果.docx', 100),
    showRemoveButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: '测试长文件名的显示效果，文件名应该被截断并显示省略号。',
      },
    },
  },
};

// MIME 类型测试
export const MimeTypeFiles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <h4>MIME 类型文件测试</h4>
      <OutlineFileItem file={createMockFile('报告.docx', 100)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('数据.xlsx', 78)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('说明书.pdf', 45)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('旧版文档.doc', 100)} showRemoveButton={true} />
      <OutlineFileItem file={createMockFile('旧版表格.xls', 90)} showRemoveButton={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '测试 MIME 类型的文件是否能正确显示对应的背景色。包括新版和旧版 Office 文档的 MIME 类型。',
      },
    },
  },
};
