import { chatDetailTurnList5 } from '@/mocks/chat/chatDetailTurnList5';
import { chatDetailTurnListSimple } from '@/mocks/chat/chatDetailTurnListSimple';
import type { Meta, StoryObj } from '@storybook/react';
import { ApiCodeForWfc } from 'gel-api';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChatOutline } from '../../pages/ChatOutline';
import { store } from '../../store';

// 通用的 ChatOutline 相关 MSW handlers
const chatOutlineHandlers = [
  // selectChatAIRecord 接口 - 获取聊天历史记录
  http.post('*/selectChatAIRecord', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: chatDetailTurnList5,
      Page: {
        Records: chatDetailTurnList5.length,
        PageIndex: 1,
        PageSize: 10,
      },
    });
  }),
  // report/create 接口 - 生成全文报告
  http.post('*/report/create', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        reportId: 'mock-report-id-' + Date.now(),
      },
    });
  }),
];

// 创建一个简化的测试组件
const SimpleTest: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>路由测试</h1>
      <p>如果你看到这个页面，说明路由配置有问题</p>
    </div>
  );
};

// 创建一个支持路由的 Mock 组件
const MockChatOutline: React.FC<{ chatId?: string }> = ({ chatId }) => {
  return (
    <Routes>
      <Route path="/chatoutline/:chatId" element={<ChatOutline />} />
      <Route path="/chatoutline" element={<ChatOutline />} />
      <Route path="/test" element={<SimpleTest />} />
      <Route path="*" element={<Navigate to={chatId ? `/chatoutline/${chatId}` : '/chatoutline'} replace />} />
    </Routes>
  );
};

const meta: Meta<typeof MockChatOutline> = {
  title: 'Pages/ChatOutline',
  component: MockChatOutline,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ChatOutline 页面

这是聊天大纲页面的完整展示，包含以下功能：

- 聊天对话界面（左侧主要内容区）
- 大纲生成进度展示（右侧进度区）
- 操作按钮区域（底部操作区）
- 实时聊天消息流处理

## 功能特性

1. **聊天对话**: 支持用户与 AI 的实时对话
2. **大纲生成**: AI 根据对话内容生成结构化大纲
3. **进度跟踪**: 实时显示大纲生成的四个步骤进度
4. **文件上传**: 支持上传文件作为参考资料
5. **深度思考**: 支持 AI 深度思考模式

## 页面布局

- **主内容区**: 包含聊天消息列表和输入操作区
- **进度区**: 显示分析问题、文件解析、深度思考、生成大纲四个步骤
- **响应式设计**: 适配不同屏幕尺寸

## 组件架构

\`\`\`
ChatOutline
├── ChatRPOutlineMessages    # 聊天消息组件
├── OperationArea            # 操作区（返回、重新生成、生成全文）
└── ProgressArea             # 进度展示区
\`\`\`

## Context 提供者

页面使用了多个 Context 提供者：

- **ChatRoomProvider**: 聊天室状态管理
- **RPOutlineProvider**: 大纲相关状态管理
- **Redux Provider**: 全局状态管理

## 样式特性

- 使用 Less Module 进行样式隔离
- 支持浏览器兼容性处理（Chrome 83+）
- 响应式网格布局
- 现代化 UI 设计

## 测试场景

1. **Default**: 默认状态，新建聊天
2. **WithChatId**: 带有聊天 ID 的历史会话
3. **Loading**: 加载状态
4. **Error**: 错误状态

## MSW Mock 说明

当前 Story 暂未配置 MSW handlers，后续可根据需要添加：

- 聊天消息接口 Mock
- 大纲生成接口 Mock
- 文件上传接口 Mock
- 进度状态接口 Mock

## 优势

✅ **完整功能**: 包含完整的聊天大纲生成流程
✅ **状态管理**: 完整的 Redux + Context 状态管理
✅ **类型安全**: 完整的 TypeScript 支持
✅ **响应式**: 适配不同屏幕尺寸
✅ **可扩展**: 易于添加新功能和 Mock 数据
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <HashRouter>
          <div style={{ height: '100vh', width: '100vw' }}>
            <Story />
          </div>
        </HashRouter>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认状态 - 新建聊天大纲
 */
export const Default: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加其他聊天相关的 MSW handlers
        // 例如：聊天消息、大纲生成、文件上传等接口
      ],
    },
    docs: {
      description: {
        story: `展示聊天大纲页面的默认状态，用户可以开始新的大纲生成对话。

**功能特性**:
- 空白聊天界面，等待用户输入
- 进度区显示未开始状态
- 操作区按钮处于初始状态

**MSW 配置**: 已配置 selectChatAIRecord 和 report/create 接口 Mock，支持聊天历史记录恢复和生成全文功能`,
      },
    },
  },
};

/**
 * 带聊天 ID - 历史会话恢复
 */
export const WithChatId: Story = {
  args: {
    chatId: 'mock-chat-id-123',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加历史消息恢复相关的 MSW handlers
      ],
    },
    docs: {
      description: {
        story: `展示带有聊天 ID 的历史会话恢复场景。

**功能特性**:
- 自动加载历史聊天记录
- 恢复之前的大纲生成进度
- 支持继续之前的对话

**MSW 配置**: 已配置 selectChatAIRecord 接口 Mock，支持历史消息查询和恢复`,
      },
    },
  },
};

/**
 * 加载状态 - 大纲生成中
 */
export const Loading: Story = {
  args: {
    chatId: 'loading-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加加载状态相关的 MSW handlers
        // 模拟大纲生成过程中的各个步骤状态
      ],
    },
    docs: {
      description: {
        story: `展示大纲生成过程中的加载状态。

**功能特性**:
- 进度区显示当前执行步骤
- 聊天区显示 AI 思考过程
- 操作按钮适当禁用

**MSW 配置**: 已配置 selectChatAIRecord 接口 Mock，后续可添加进度状态接口 Mock`,
      },
    },
  },
};

/**
 * 错误状态 - 生成失败
 */
export const Error: Story = {
  args: {
    chatId: 'error-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加错误状态相关的 MSW handlers
      ],
    },
    docs: {
      description: {
        story: `展示大纲生成失败的错误状态。

**功能特性**:
- 错误消息显示
- 重试操作可用
- 友好的错误提示

**MSW 配置**: 已配置 selectChatAIRecord 接口 Mock，后续可添加错误响应 Mock`,
      },
    },
  },
};

/**
 * 深度思考模式 - 启用深度分析
 */
export const DeepThinking: Story = {
  args: {
    chatId: 'deep-thinking-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加深度思考模式相关的 MSW handlers
      ],
    },
    docs: {
      description: {
        story: `展示启用深度思考模式的聊天大纲生成。

**功能特性**:
- AI 深度分析用户需求
- 更详细的思考过程展示
- 更高质量的大纲输出

**MSW 配置**: 已配置 selectChatAIRecord 接口 Mock，后续可添加深度思考接口 Mock`,
      },
    },
  },
};

/**
 * 文件上传 - 带参考文件
 */
export const WithFiles: Story = {
  args: {
    chatId: 'files-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加文件上传相关的 MSW handlers
      ],
    },
    docs: {
      description: {
        story: `展示包含文件上传的聊天大纲生成场景。

**功能特性**:
- 支持多文件上传
- 文件内容解析和分析
- 基于文件内容生成大纲

**MSW 配置**: 已配置 selectChatAIRecord 接口 Mock，后续可添加文件上传和解析接口 Mock`,
      },
    },
  },
};

/**
 * 完成状态 - 大纲生成完成
 */
export const Completed: Story = {
  args: {
    chatId: 'completed-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatOutlineHandlers,
        // TODO: 添加完成状态相关的 MSW handlers
      ],
    },
    docs: {
      description: {
        story: `展示大纲生成完成后的状态。

**功能特性**:
- 完整的大纲结构展示
- 生成全文按钮可用
- 支持重新生成大纲

**MSW 配置**: 已配置 selectChatAIRecord 和 report/create 接口 Mock，支持完整的生成全文流程（点击"生成全文"按钮会导航到报告详情页）`,
      },
    },
  },
};

/**
 * 简单大纲 - 用于调试
 */
export const SimpleOutline: Story = {
  args: {
    chatId: 'simple-outline-chat-id',
  },
  parameters: {
    msw: {
      handlers: [
        // selectChatAIRecord 接口 - 返回简单的聊天记录
        http.post('*/selectChatAIRecord', () => {
          return HttpResponse.json({
            ErrorCode: ApiCodeForWfc.SUCCESS,
            Data: chatDetailTurnListSimple,
            Page: {
              Records: chatDetailTurnListSimple.length,
              PageIndex: 1,
              PageSize: 10,
            },
          });
        }),
        // report/create 接口 - 生成全文报告
        http.post('*/report/create', () => {
          return HttpResponse.json({
            ErrorCode: ApiCodeForWfc.SUCCESS,
            Data: {
              reportId: 'mock-report-id-' + Date.now(),
            },
          });
        }),
        // batchUpdateChapterTree 接口 - 批量更新章节树
        http.post('*/reportChapter/batchUpdateChapterTree', async ({ request }) => {
          const body = (await request.json()) as any;
          console.log('batchUpdateChapterTree 请求:', body);

          // 模拟返回临时 ID 映射
          const tempIdMapping: Record<string, string> = {};
          if (body.chapterTree) {
            body.chapterTree.forEach((chapter: any, index: number) => {
              if (chapter.chapterId && chapter.chapterId < 0) {
                // 临时 ID 映射为真实 ID
                tempIdMapping[chapter.chapterId] = String(1000 + index);
              }
            });
          }

          return HttpResponse.json({
            ErrorCode: ApiCodeForWfc.SUCCESS,
            Data: {
              tempIdMapping,
            },
          });
        }),
      ],
    },
    docs: {
      description: {
        story: `展示简化的大纲结构，方便调试大纲相关功能。

**功能特性**:
- 精简的大纲结构（只有 2-3 个章节）
- 便于快速测试和调试
- 包含完整的交互功能

**MSW 配置**: 
- selectChatAIRecord: 返回简单的聊天记录
- report/create: 支持生成全文功能
- batchUpdateChapterTree: 支持批量更新章节树，自动处理临时 ID 映射

**调试说明**:
此 story 专门用于调试大纲功能，大纲结构简单，便于观察和测试章节的增删改操作。`,
      },
    },
  },
};
