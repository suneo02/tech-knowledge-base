import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { Suspense, useRef } from 'react';
import { PDFViewer, type PDFViewerRef } from './index';

// Storybook 环境 Mock 装饰器
const StorybookMockDecorator = (Story: any) => {
  // 为 Storybook 环境添加必要的 Mock
  if (typeof window !== 'undefined') {
    // Mock Worker 如果不存在
    if (!window.Worker) {
      (window as any).Worker = class {
        postMessage() {}
        terminate() {}
        addEventListener() {}
        removeEventListener() {}
      };
    }

    // Mock URL API 如果不存在
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = () => 'blob:mock-url';
      window.URL.revokeObjectURL = () => {};
    }

    // Mock baifenFetch 如果不存在
    if (!(window as any).baifenFetch) {
      (window as any).baifenFetch = async (url: string) => {
        return fetch(url);
      };
    }
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Story />
    </Suspense>
  );
};

// 全屏容器装饰器 - 让 PDFViewer 占据整个视口
const FullscreenContainerDecorator = (Story: any) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Story />
    </div>
  );
};

const meta = {
  title: 'File/PDFViewer',
  component: PDFViewer,
  decorators: [StorybookMockDecorator, FullscreenContainerDecorator],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
PDFViewer 是一个功能完整的 PDF 文档查看器组件，基于 react-pdf 实现。

## 功能特性
- 支持多种加载方式（URL、Blob、自定义加载函数）
- 懒加载优化（仅渲染可视区域页面）
- 缩放控制：25%-200%，8 个档位
- 旋转功能：90° 增量
- 分页导航：上一页、下一页、跳转
- 文本选区高亮
- 定位到指定页面和元素
- 智能降级（加载失败时切换到原生查看器）
- 可控制的 UI 显示（头部、工具栏）

## 架构设计
- **组件层**: 纯展示逻辑，不包含加载逻辑
- **Hook 层**: usePdfLoader 管理加载状态和资源
- **服务层**: pdfService 提供统一的 PDF 加载能力

## 使用方式

### 方式1: 直接 URL
\`\`\`tsx
<PDFViewer source={{ url: '/document.pdf' }} fileName="文档.pdf" />
\`\`\`

### 方式2: Blob 对象
\`\`\`tsx
<PDFViewer source={{ file: pdfBlob }} fileName="文档.pdf" />
\`\`\`

### 方式3: 自定义加载函数
\`\`\`tsx
<PDFViewer
  source={{
    loader: async () => {
      return await pdfService.loadPdfFromGFS('path', 'file.pdf');
    }
  }}
  fileName="文档.pdf"
/>
\`\`\`

## Storybook 注意事项
- 使用内置的测试 PDF 文件和 Mock 环境
- 如果加载超时，会显示超时错误信息
- 生产环境中需要配置本地 PDF.js Worker 文件
        `,
      },
    },
  },
  argTypes: {
    source: {
      control: 'object',
      description: 'PDF 加载源配置',
      table: {
        type: {
          summary: 'PDFSource',
          detail: `{
  url?: string;                              // 直接 URL
  file?: Blob;                               // Blob 对象
  loader?: () => Promise<string | Blob | null>;  // 自定义加载函数
}`,
        },
      },
    },
    fileName: {
      control: 'text',
      description: 'PDF 文件名（用于显示和下载）',
    },
    showHeader: {
      control: 'boolean',
      description: '是否显示头部（文件名和分页器）',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showToolbar: {
      control: 'boolean',
      description: '是否显示工具栏',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    initialScale: {
      control: { type: 'number', min: 0.25, max: 2, step: 0.25 },
      description: '初始缩放比例',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    initialRotate: {
      control: { type: 'select', options: [0, 90, 180, 270] },
      description: '初始旋转角度',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    onTotalChange: {
      description: '总页数变化回调',
    },
    onPageChange: {
      description: '当前页码变化回调',
    },
    onLoadStateChange: {
      description: '加载状态变化回调',
    },
  },
  args: {
    onTotalChange: fn(),
    onPageChange: fn(),
    onLoadStateChange: fn(),
  },
} satisfies Meta<typeof PDFViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 示例 PDF 文件
const SAMPLE_PDF_URLS = {
  local: '/sample.pdf',
  base64:
    'data:application/pdf;base64,JVBERi0xLjMKJf////8KMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9PdXRsaW5lcwovQ291bnQgMAo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA2IDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzcgMDAwMDAgbiAKMDAwMDAwMDM2NCAwMDAwMCBuIAowMDAwMDAwNDY2IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNwovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTU5CiUlRU9G',
  external: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
};

const SAMPLE_PDF_URL = SAMPLE_PDF_URLS.local;

/**
 * 默认 PDF 查看器
 * 展示基本的 PDF 查看功能
 */
export const Default: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '示例文档.pdf',
    onTotalChange: fn().mockImplementation((total) => {
      console.log(`✅ PDF 加载成功: ${total} 页`);
    }),
    onPageChange: fn().mockImplementation((page) => {
      console.log(`📄 当前页: ${page}`);
    }),
    onLoadStateChange: fn().mockImplementation((state) => {
      console.log(`🔄 加载状态: ${state}`);
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '基本的 PDF 查看功能，使用本地 PDF 文件。打开控制台可以查看加载日志。',
      },
    },
  },
};

/**
 * 使用 URL 加载
 * 最简单的使用方式
 */
export const WithURL: Story = {
  args: {
    source: { url: SAMPLE_PDF_URLS.base64 },
    fileName: 'Hello World.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '使用 URL 方式加载 PDF，这是最简单直接的方式。',
      },
    },
  },
};

/**
 * 使用 Blob 对象
 * 适合文件上传场景
 */
export const WithBlob: Story = {
  args: {
    source: {
      file: (() => {
        const pdfContent = atob(SAMPLE_PDF_URLS.base64.split(',')[1]);
        const uint8Array = new Uint8Array(pdfContent.split('').map((char) => char.charCodeAt(0)));
        return new Blob([uint8Array], { type: 'application/pdf' });
      })(),
    },
    fileName: '本地文件.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '使用 Blob 对象加载 PDF，适合文件上传后预览的场景。',
      },
    },
  },
};

/**
 * 使用自定义加载函数
 * 展示最灵活的加载方式
 */
export const WithLoader: Story = {
  args: {
    source: {
      loader: async () => {
        // 模拟异步加载
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return SAMPLE_PDF_URL;
      },
    },
    fileName: '异步加载.pdf',
    onLoadStateChange: fn().mockImplementation((state) => {
      console.log(`加载状态: ${state}`);
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '使用自定义加载函数，可以实现复杂的加载逻辑（如认证、转换等）。',
      },
    },
  },
};

/**
 * 隐藏头部
 * 只显示 PDF 内容和工具栏
 */
export const WithoutHeader: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '无头部.pdf',
    showHeader: false,
  },
  parameters: {
    docs: {
      description: {
        story: '隐藏头部（文件名和分页器），适合嵌入式场景。',
      },
    },
  },
};

/**
 * 隐藏工具栏
 * 只显示 PDF 内容和头部
 */
export const WithoutToolbar: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '无工具栏.pdf',
    showToolbar: false,
  },
  parameters: {
    docs: {
      description: {
        story: '隐藏工具栏，适合只需要查看和翻页的场景。',
      },
    },
  },
};

/**
 * 极简模式
 * 隐藏所有 UI，只显示 PDF 内容
 */
export const MinimalMode: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '极简模式.pdf',
    showHeader: false,
    showToolbar: false,
  },
  parameters: {
    docs: {
      description: {
        story: '极简模式，隐藏所有 UI 元素，只显示 PDF 内容。',
      },
    },
  },
};

/**
 * 初始缩放 150%
 * 设置初始缩放比例
 */
export const InitialScale150: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '缩放150%.pdf',
    initialScale: 1.5,
  },
  parameters: {
    docs: {
      description: {
        story: '设置初始缩放比例为 150%，适合高分辨率屏幕。',
      },
    },
  },
};

/**
 * 初始旋转 90 度
 * 设置初始旋转角度
 */
export const InitialRotate90: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '旋转90度.pdf',
    initialRotate: 90,
  },
  parameters: {
    docs: {
      description: {
        story: '设置初始旋转角度为 90 度，适合横向文档。',
      },
    },
  },
};

/**
 * 使用 Ref 控制
 * 展示如何通过 ref 控制滚动
 */
export const WithRefControl: Story = {
  render: (args) => {
    const pdfRef = useRef<PDFViewerRef>(null);

    return (
      <div>
        <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
          <button onClick={() => pdfRef.current?.scrollToPage?.(1)}>跳转到第 1 页</button>
          <button onClick={() => pdfRef.current?.scrollToPage?.(3)} style={{ marginLeft: '10px' }}>
            跳转到第 3 页
          </button>
          <button onClick={() => pdfRef.current?.scrollToPage?.(5)} style={{ marginLeft: '10px' }}>
            跳转到第 5 页
          </button>
        </div>
        <PDFViewer ref={pdfRef} {...args} />
      </div>
    );
  },
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: 'Ref控制.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '使用 ref 控制 PDF 滚动，可以从外部跳转到指定页面。',
      },
    },
  },
};

/**
 * 小尺寸容器
 * 在较小的容器中显示
 */
export const SmallContainer: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '小容器.pdf',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '400px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '在较小容器中的 PDF 查看器，会自动适应容器大小。',
      },
    },
  },
};

/**
 * 加载状态
 * 展示加载过程
 */
export const LoadingState: Story = {
  args: {
    source: {
      loader: async () => {
        // 模拟慢加载
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return SAMPLE_PDF_URL;
      },
    },
    fileName: '加载中.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: 'PDF 文件加载过程中显示的加载状态。',
      },
    },
  },
};

/**
 * 加载错误
 * 展示加载失败的状态
 */
export const LoadError: Story = {
  args: {
    source: {
      url: 'https://invalid-url-that-will-fail.com/nonexistent.pdf',
    },
    fileName: '加载失败.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '当 PDF 文件无法加载时显示的错误状态。',
      },
    },
  },
};

/**
 * 交互测试
 * 测试组件的交互功能
 */
export const InteractiveTest: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '交互测试.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '用于测试 PDF 查看器交互功能的 Story，包含自动化测试用例。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待 PDF 加载完成
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // 测试下一页按钮
      const nextButtons = canvas.getAllByRole('button');
      const nextButton = nextButtons.find((btn) => btn.textContent?.includes('下一页'));
      if (nextButton && !nextButton.hasAttribute('disabled')) {
        await userEvent.click(nextButton);
      }

      // 等待一下
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 测试上一页按钮
      const prevButton = nextButtons.find((btn) => btn.textContent?.includes('上一页'));
      if (prevButton && !prevButton.hasAttribute('disabled')) {
        await userEvent.click(prevButton);
      }
    } catch (error) {
      console.warn('Some interactive elements may not be available yet:', error);
    }
  },
};

/**
 * 响应式设计测试
 * 测试在不同屏幕尺寸下的表现
 */
export const ResponsiveDesign: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '响应式.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: '测试 PDF 查看器在不同屏幕尺寸下的响应式表现。',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
      },
      defaultViewport: 'mobile',
    },
  },
};

/**
 * 自定义样式
 * 展示如何自定义组件样式
 */
export const CustomStyling: Story = {
  args: {
    source: { url: SAMPLE_PDF_URL },
    fileName: '自定义样式.pdf',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '20px',
          background: '#f0f2f5',
          border: '2px solid #1890ff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '展示如何通过容器样式自定义 PDF 查看器的外观。',
      },
    },
  },
};
