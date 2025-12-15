import { chatRefTableMock1, chatSuggestResMock1 } from '@/mocks/chatShare/ref/mock1';
import { rpFileMock1 } from '@/mocks/reportShare/mock1';
import { rpFileMock2 } from '@/mocks/reportShare/mock2';
import { rpFileMock4 } from '@/mocks/reportShare/mock4';
import type { Meta, StoryObj } from '@storybook/react';
import { ApiCodeForWfc, ApiResponseForGetUserQuestion } from 'gel-api';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { mockApiResponses } from '../../mocks/report/mswReportData.mock';
import { outlineMock4 } from '../../mocks/reportOutline/reportContent4.mock';
import { ReportDetail } from '../../pages/ReportDetail';
import { store } from '../../store';

// 用于跟踪 getUserQuestion 调用次数
let getUserQuestionCallCount = 0;

// ============ Handler 工厂函数 ============

/** 创建 getUserQuestion handler，支持自定义最终结果文本 */
const createGetUserQuestionHandler = (finalResult: string) => {
  return http.post('*/api/chat/getUserQuestion', async () => {
    getUserQuestionCallCount++;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isFinished = getUserQuestionCallCount >= 3;
    const res: ApiResponseForGetUserQuestion<string> = {
      ErrorCode: ApiCodeForWfc.SUCCESS,
      suggest: { items: chatSuggestResMock1 },
      // @ts-expect-error
      content: { data: chatRefTableMock1 },
      result: isFinished ? finalResult : `正在处理中... (${getUserQuestionCallCount}/3)`,
      finish: isFinished,
    };

    console.log(`📞 getUserQuestion 调用 #${getUserQuestionCallCount}, finish: ${isFinished}`);
    return HttpResponse.json(res);
  });
};

/**
 * 流式输出行为类型
 */
type StreamBehavior = 'normal' | 'error' | 'stuck' | 'direct-error';

/**
 * 创建流式输出 handler（统一工厂函数）
 * @param content 流式输出的内容
 * @param options 配置选项
 *   - charDelay: 每个字符的延迟时间（ms）。如果不传，则自动计算让总时长约为 20 秒
 *   - behavior: 流式行为类型
 *     - 'normal': 正常输出完整内容（默认）
 *     - 'error': 输出一半后中断
 *     - 'stuck': 输出一半后永久挂起
 *     - 'direct-error': 直接返回 500 错误
 */
const createStreamHandler = (
  content: string,
  options?: {
    charDelay?: number;
    behavior?: StreamBehavior;
  }
) => {
  const { charDelay, behavior = 'normal' } = options || {};

  return http.post('*/api/chat/getResult', async () => {
    // 直接错误：立即返回 500
    if (behavior === 'direct-error') {
      return HttpResponse.json(
        { ErrorCode: 'STREAM_ERROR', ErrorMsg: '流式服务暂时不可用，请稍后重试', result: null },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();

    // 确定输出长度
    const outputLength = behavior === 'normal' ? content.length : Math.floor(content.length / 2);

    // 自动计算延迟：让流式输出总是在 20 秒左右结束
    let delay = charDelay;
    if (delay === undefined) {
      // 目标总时长：20 秒 = 20000 毫秒
      const targetDuration = 10000;
      // 根据输出长度计算每个字符的延迟
      delay = outputLength > 0 ? targetDuration / outputLength : 50;
      // 限制延迟范围：最小 10ms，最大 200ms
      delay = Math.max(10, Math.min(200, delay));
    }

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const now = Date.now();

        // 输出内容
        for (let i = 0; i < outputLength; i++) {
          const data = {
            id: `mock-sse-${i}`,
            object: 'chat.completion.chunk',
            created: now + i,
            model: 'mock-model',
            choices: [
              {
                index: 0,
                delta: { content: content[i], reasoning_content: '' },
                finish_reason: null,
              },
            ],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          await new Promise((r) => setTimeout(r, delay));
        }

        // 根据行为类型处理结束
        if (behavior === 'normal') {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } else if (behavior === 'error') {
          controller.close(); // 模拟中断
        } else if (behavior === 'stuck') {
          await new Promise(() => {}); // 永远不会 resolve，模拟卡住
        }
      },
    });

    return new HttpResponse(stream as unknown as BodyInit, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  });
};

/** 基础聊天 handlers（不包含 getUserQuestion 和 getResult） */
const baseChatHandlers = [
  http.post('*/api/chat/analysisEngine', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      result: {
        rawSentenceID: 'mock-raw-sentence-id',
        itResult: { it: 'aireport.mock.intent', rewrite_sentence: '' },
      },
    });
  }),
  http.post('*/api/chat/addChatGroup', () => {
    return HttpResponse.json({ ErrorCode: ApiCodeForWfc.SUCCESS, result: { chatId: 'mock-chat-id' } });
  }),
  http.post('*/api/chat/queryReference', () => {
    return HttpResponse.json({ ErrorCode: ApiCodeForWfc.SUCCESS, result: null, finish: true });
  }),
  http.post('*/api/chat/trace', () => {
    const firstLeafSection = outlineMock4[0].children?.[0];
    const traces = firstLeafSection?.traceContent || [];
    return HttpResponse.json({ ErrorCode: ApiCodeForWfc.SUCCESS, Data: traces });
  }),
  http.post('*/api/report/files/*', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: { files: [...rpFileMock1, ...rpFileMock2, ...rpFileMock4] },
    });
  }),
  http.post('*/reportChapter/batchUpdateChapterTree', async ({ request }) => {
    const body = (await request.json()) as any;
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log('✅ MSW Mock: batchUpdateChapterTree 成功', {
      reportId: body.reportId,
      chaptersCount: body.chapterTree?.length || 0,
    });
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMsg: '章节树更新成功',
      result: { tempIdMapping: {} },
    });
  }),
  http.post('*/api/report/fileDelete', async ({ request }) => {
    const body = (await request.json()) as any;
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log('✅ MSW Mock: fileDelete 成功', { fileId: body.fileId });
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMsg: '文件删除成功',
      result: { fileId: body.fileId },
    });
  }),
  http.post('*/api/report/reportFileUpload', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('✅ MSW Mock: fileUpload 成功', { fileName: file?.name, fileSize: file?.size });
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMsg: '文件上传成功',
      Data: { fileID: `mock-file-${Date.now()}` },
    });
  }),
];

// 通用的聊天相关 MSW handlers，避免每个故事覆盖后丢失全局 handlers
const chatHandlers = [
  ...baseChatHandlers,
  createGetUserQuestionHandler('请给我报告大纲\n请列出核心要点'),
  createStreamHandler(outlineMock4[0].children?.[0]?.content || '这是第一段回答。 这是第二段回答。 这是第三段回答。'),
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
const MockReportDetail: React.FC<{ id: string }> = ({ id }) => {
  return (
    <Routes>
      <Route path="/reportdetail/:id" element={<ReportDetail />} />
      <Route path="/test" element={<SimpleTest />} />
      <Route path="*" element={<Navigate to={`/reportdetail/${id}`} replace />} />
    </Routes>
  );
};

const meta: Meta<typeof MockReportDetail> = {
  title: 'Pages/ReportDetail',
  component: MockReportDetail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ReportDetail 页面

这是报告详情页面的完整展示，包含以下功能：

- 报告标题和基本信息显示
- 左侧面板（大纲导航）
- 右侧报告内容展示
- 实时数据更新和轮询

## 使用说明

1. 页面会自动根据 reportId 加载报告数据
2. 支持实时轮询更新报告状态
3. 当报告生成完成时会自动停止轮询
4. 左侧面板可以导航到不同的章节
5. 右侧显示当前选中章节的详细内容

## Mock 数据说明

当前使用的 Mock 数据包含：
- 3个主要章节，每个章节包含2个子章节
- 所有章节状态为已完成
- 报告名称为"2024年市场分析报告"
- 模拟了完整的报告数据结构

## 测试场景

1. **Default**: 默认状态，报告已完成
2. **Loading**: 加载状态，报告正在生成中
3. **Error**: 错误状态，报告加载失败
4. **EmptyReport**: 空报告，没有章节内容
5. **LargeReport**: 大章节报告，包含更多章节内容

## Redux Provider 配置

本 Story 已配置 Redux Provider，支持：

- 侧边栏状态管理 (layout store)
- 用户包信息管理 (userPackage store)
- 完整的状态管理功能

## MSW Mock 说明

本 Story 使用 MSW (Mock Service Worker) 来拦截和模拟 HTTP 请求：

- 自动拦截 \`report/query\` 接口
- 根据不同的 Story 返回不同的测试数据
- 支持延迟、错误等复杂场景模拟
- 无需手动在浏览器控制台执行脚本

## 优势

✅ **自动化**: 无需手动执行 Mock 脚本
✅ **类型安全**: 完整的 TypeScript 支持
✅ **场景丰富**: 支持多种测试场景
✅ **易于维护**: 集中管理 Mock 数据
✅ **开发友好**: 与 Storybook 完美集成
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
 * 默认状态 - 报告已完成
 */
export const Default: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示报告详情页面的默认状态，报告已完成生成，包含完整的章节内容。

**Mock 数据**: 
\`\`\`javascript
${JSON.stringify(mockApiResponses.default, null, 2)}
\`\`\`

**MSW 配置**: 自动拦截 \`report/query\` 接口并返回默认数据`,
      },
    },
  },
};

/**
 * 加载状态 - 报告正在生成中
 */
export const Loading: Story = {
  args: {
    id: 'loading-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.loading);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示报告正在生成中的状态，模拟轮询加载过程。

**Mock 数据**: 
\`\`\`javascript
${JSON.stringify(mockApiResponses.loading, null, 2)}
\`\`\`

**MSW 配置**: 自动拦截 \`report/query\` 接口并返回加载状态数据`,
      },
    },
  },
};

/**
 * 错误状态 - 报告加载失败
 */
export const Error: Story = {
  args: {
    id: 'error-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.error, { status: 500 });
        }),
      ],
    },
    docs: {
      description: {
        story: `展示报告加载失败的错误状态。

**Mock 数据**: 
\`\`\`javascript
${JSON.stringify(mockApiResponses.error, null, 2)}
\`\`\`

**MSW 配置**: 自动拦截 \`report/query\` 接口并返回错误状态`,
      },
    },
  },
};

/**
 * 空报告 - 没有章节内容
 */
export const EmptyReport: Story = {
  args: {
    id: 'empty-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.empty);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示空报告状态，没有章节内容的情况。

**Mock 数据**: 
\`\`\`javascript
${JSON.stringify(mockApiResponses.empty, null, 2)}
\`\`\`

**MSW 配置**: 自动拦截 \`report/query\` 接口并返回空数据`,
      },
    },
  },
};

/**
 * 大章节报告 - 包含更多章节内容
 */
export const LargeReport: Story = {
  args: {
    id: 'large-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.large);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示包含大量章节的报告，测试页面在复杂内容下的表现。

**Mock 数据**: 
\`\`\`javascript
${JSON.stringify(mockApiResponses.large, null, 2)}
\`\`\`

**MSW 配置**: 自动拦截 \`report/query\` 接口并返回大型报告数据`,
      },
    },
  },
};

/**
 * 延迟加载 - 模拟网络延迟
 */
export const DelayedLoading: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', async () => {
          // 模拟 2 秒延迟
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示网络延迟情况下的页面表现。

**Mock 数据**: 默认数据 + 2秒延迟
**MSW 配置**: 自动拦截 \`report/query\` 接口并模拟网络延迟`,
      },
    },
  },
};

/**
 * 轮询测试 - 模拟轮询更新
 */
export const PollingTest: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...chatHandlers,
        http.get('*/api/report/query/*', ({}) => {
          const timestamp = Date.now();

          // 模拟轮询过程中的数据变化
          if (timestamp % 10000 < 5000) {
            // 前 5 秒返回加载状态
            return HttpResponse.json(mockApiResponses.loading);
          } else {
            // 后 5 秒返回完成状态
            return HttpResponse.json(mockApiResponses.default);
          }
        }),
      ],
    },
    docs: {
      description: {
        story: `展示轮询更新过程中的页面表现。

**Mock 数据**: 动态切换加载和完成状态
**MSW 配置**: 自动拦截 \`report/query\` 接口并模拟轮询行为`,
      },
    },
  },
};

/**
 * 短内容流式输出 - 方便测试
 */
export const ShortStreamContent: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...baseChatHandlers,
        createGetUserQuestionHandler('测试问题'),
        createStreamHandler('这是测试内容。'), // 自动计算延迟，总时长约 20 秒
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示短内容流式输出，方便快速测试流式效果。

**特点**:
- 流式内容仅为"这是测试内容。"（7个字符）
- 自动计算延迟，总时长约 20 秒
- 适合快速验证流式输出功能

**Mock 数据**: 默认报告数据 + 短流式内容
**MSW 配置**: 自定义流式输出 handler（20秒总时长）`,
      },
    },
  },
};

/**
 * 流式输出失败 - 测试错误处理
 */
export const StreamError: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...baseChatHandlers,
        createGetUserQuestionHandler('测试流式失败'),
        createStreamHandler('这是部分内容，即将失败...', { behavior: 'error' }),
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示流式输出失败的场景，用于测试错误处理。

**特点**:
- 输出部分内容后中断（约输出一半内容）
- 模拟网络连接中断或服务器错误
- 测试前端错误边界和用户提示

**错误类型**: Stream connection lost
**Mock 数据**: 默认报告数据 + 流式错误
**MSW 配置**: 自定义流式错误 handler`,
      },
    },
  },
};

/**
 * 流式卡住 - 模拟长时间无响应
 */
export const StreamStuck: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...baseChatHandlers,
        createGetUserQuestionHandler('测试流式卡住'),
        createStreamHandler('这是部分内容，然后就卡住了...', { behavior: 'stuck' }),
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示流式输出卡住的场景，模拟服务器无响应。

**特点**:
- 输出部分内容后停止响应（约输出一半内容）
- 连接保持打开但不再发送数据
- 模拟服务器挂起或网络延迟极高的情况
- 测试超时处理和用户取消功能

**场景**: Stream stuck / Server hang
**Mock 数据**: 默认报告数据 + 流式卡住
**MSW 配置**: 自定义流式卡住 handler`,
      },
    },
  },
};

/**
 * 流式直接报错 - 返回错误状态码
 */
export const StreamDirectError: Story = {
  args: {
    id: 'mock-report-id',
  },
  parameters: {
    msw: {
      handlers: [
        ...baseChatHandlers,
        createGetUserQuestionHandler('测试流式直接报错'),
        createStreamHandler('', { behavior: 'direct-error' }),
        http.get('*/api/report/query/*', () => {
          return HttpResponse.json(mockApiResponses.default);
        }),
      ],
    },
    docs: {
      description: {
        story: `展示流式请求直接返回错误的场景。

**特点**:
- 请求立即返回 500 错误状态码
- 不建立流式连接
- 模拟服务器错误、服务不可用等情况
- 测试错误提示和重试机制

**错误类型**: HTTP 500 Internal Server Error
**错误信息**: "流式服务暂时不可用，请稍后重试"
**Mock 数据**: 默认报告数据 + 直接错误响应
**MSW 配置**: 返回 500 错误的 handler`,
      },
    },
  },
};
