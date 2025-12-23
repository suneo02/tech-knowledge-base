import { outlineMock4 } from '@/mocks/reportOutline/reportContent4.mock';
import { rpOutlineMock1 } from '@/mocks/reportOutline/res1';
import type { Meta, StoryObj } from '@storybook/react';
import { RPChapter } from 'gel-api';
import { OutlineView } from '../../components/outline/OutlineView';
import { partialChapters } from '../../mocks/report/mswReportData.mock';
import { outlineMock2 } from '../../mocks/report/reportContent3.mock';

// 创建大型章节数据用于测试
const createLargeChapters = (): RPChapter[] => {
  return Array.from({ length: 10 }, (_, index) => ({
    outlineId: index + 1,
    writingThought: `这是第${index + 1}章的写作思路...`,
    title: `第${index + 1}章 章节${index + 1}`,
    chapterId: index + 1,
    chapterOrder: index + 1,
    children: Array.from({ length: 5 }, (_, childIndex) => ({
      title: `${index + 1}.${childIndex + 1} 子章节${childIndex + 1}`,
      outlineId: index + 1,
      writingThought: `这是第${index + 1}章第${childIndex + 1}个子章节的内容...`,
      chapterId: index + 1,
      chapterOrder: childIndex + 1,
      children: [],
    })),
  }));
};

const meta: Meta<typeof OutlineView> = {
  title: 'Report/OutlineView',
  component: OutlineView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# OutlineView 组件

报告大纲展示组件，用于展示报告的结构和章节导航。

## 功能特性

- **树形结构展示**：以树形结构展示报告的章节层次
- **章节导航**：点击章节可跳转到对应内容
- **展开/收起**：支持章节的展开和收起操作
- **状态指示**：显示章节的生成状态（生成中、已完成、待生成）
- **进度显示**：显示整体生成进度
- **批量操作**：支持全部展开/收起功能

## 使用场景

1. **报告编辑**：在编辑报告时查看和导航章节
2. **内容预览**：预览报告的整体结构
3. **状态监控**：监控章节的生成状态
4. **快速导航**：快速跳转到指定章节

## 组件状态

- **加载状态**：大纲数据正在加载中
- **空状态**：没有大纲数据
- **正常状态**：显示完整的大纲结构
- **生成状态**：部分章节正在生成中

## 交互功能

- **章节选择**：点击章节可选中并跳转
- **展开/收起**：点击展开图标可展开或收起章节
- **全部操作**：一键展开或收起所有章节
- **状态指示**：通过图标显示章节的生成状态
        `,
      },
    },
  },

  argTypes: {
    treeData: {
      description: '大纲树形数据',
      control: { type: 'object' },
    },
    loading: {
      description: '是否正在加载',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认状态 - 完整大纲
 */
export const Default: Story = {
  args: {
    treeData: rpOutlineMock1.chapters,
    loading: false,
    onSelect: (chapterId: string) => {
      console.log('章节选中:', chapterId);
    },
  },
  parameters: {
    docs: {
      description: {
        story: `展示完整的大纲结构，所有章节都已生成完成。

**特点**：
- 3个主要章节，每个章节包含2个子章节
- 所有章节状态为已完成
- 支持章节导航和展开/收起操作
- 显示完整的树形结构`,
      },
    },
  },
};

/**
 * 加载状态 - 大纲正在加载
 */
export const Loading: Story = {
  args: {
    treeData: [],
    loading: true,
    onSelect: (chapterId: string) => {
      console.log('章节选中:', chapterId);
    },
  },
  parameters: {
    docs: {
      description: {
        story: `展示大纲正在加载的状态。

**特点**：
- 显示加载动画
- 提示"正在加载大纲..."
- 适用于数据获取阶段`,
      },
    },
  },
};

/**
 * 空状态 - 没有大纲数据
 */
export const Empty: Story = {
  args: {
    treeData: [],
    loading: false,
    onSelect: (chapterId: string) => {
      console.log('章节选中:', chapterId);
    },
  },
  parameters: {
    docs: {
      description: {
        story: `展示没有大纲数据的状态。

**特点**：
- 显示空状态图标
- 提示"暂无大纲数据"
- 适用于数据为空的情况`,
      },
    },
  },
};

/**
 * 部分完成 - 部分章节已生成
 */
export const Partial: Story = {
  args: {
    treeData: partialChapters,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: `展示部分章节已完成的状态。

**特点**：
- 部分章节有内容，部分章节为空
- 显示生成进度为60%
- 适用于章节生成过程中的状态`,
      },
    },
  },
};

/**
 * 生成中状态 - 部分章节正在生成
 */
export const Generating: Story = {
  args: {
    treeData: outlineMock2,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `展示部分章节正在生成的状态。

**特点**：
- 部分章节显示生成中状态
- 部分章节已完成
- 显示生成进度为75%
- 适用于实时生成场景`,
      },
    },
  },
};

/**
 * 大型大纲 - 包含大量章节
 */
export const LargeOutline: Story = {
  args: {
    treeData: createLargeChapters(),
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: `展示包含大量章节的大纲。

**特点**：
- 10个主要章节，每个章节包含5个子章节
- 总共50个子章节
- 测试组件在大量数据下的性能
- 验证滚动和展开/收起功能`,
      },
    },
  },
};

/**
 * 复杂结构 - 多层级章节
 */
export const ComplexStructure: Story = {
  args: {
    treeData: [
      {
        title: '第一章 概述',
        summary: '本章介绍基本概念...',
        chapterId: '1',
        chapterOrder: 1,
        children: [
          {
            title: '1.1 背景介绍',
            summary: '介绍项目背景...',
            chapterId: '1-1',
            chapterOrder: 1,
            children: [
              {
                title: '1.1.1 历史背景',
                summary: '详细的历史背景...',
                chapterId: '1-1-1',
                chapterOrder: 1,
                children: [],
              },
              {
                title: '1.1.2 现状分析',
                summary: '当前状况分析...',
                chapterId: '1-1-2',
                chapterOrder: 2,
                children: [],
              },
            ],
          },
          {
            title: '1.2 目标设定',
            summary: '明确项目目标...',
            chapterId: '1-2',
            chapterOrder: 2,
            children: [],
          },
        ],
      },
      {
        title: '第二章 详细分析',
        summary: '深入分析各个维度...',
        chapterId: '2',
        chapterOrder: 2,
        children: [
          {
            title: '2.1 技术分析',
            summary: '技术层面的分析...',
            chapterId: '2-1',
            chapterOrder: 1,
            children: [],
          },
          {
            title: '2.2 市场分析',
            summary: '市场层面的分析...',
            chapterId: '2-2',
            chapterOrder: 2,
            children: [],
          },
        ],
      },
    ],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: `展示具有复杂层级结构的大纲。

**特点**：
- 包含三级章节结构
- 测试深层嵌套的展示
- 验证复杂结构的展开/收起
- 测试导航功能的准确性`,
      },
    },
  },
};

/**
 * 进度测试 - 不同生成进度
 */
export const ProgressTest: Story = {
  args: {
    treeData: outlineMock4,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `测试不同生成进度的显示。

**特点**：
- 生成进度为45%
- 正在生成状态
- 大纲未完成状态
- 适用于进度监控场景`,
      },
    },
  },
};
