import { ApiCodeForWfc } from 'gel-api';
import { http, HttpResponse } from 'msw';
import { reportFilesMocks } from './files';
import { mockApiResponses } from './report/mswReportData.mock';

/**
 * 文件上传测试场景说明：
 * - POST /api/report/fileUpload - 普通上传（2.5秒延迟）
 * - POST /api/report/fileUpload/fast - 快速上传（0.5秒延迟）
 * - POST /api/report/fileUpload/slow - 慢速上传（5秒延迟）
 * - POST /api/report/fileUpload/error - 上传失败场景
 * - POST /api/report/fileUpload/progress?step=N - 分步进度上传
 */

// 导出用于 Storybook 的 handlers
export const storybookHandlers = [
  // Default 场景
  http.get('*/api/report/query/*', () => {
    return HttpResponse.json(mockApiResponses.default);
  }),

  // Loading 场景
  http.get('*/api/report/query/loading*', () => {
    return HttpResponse.json(mockApiResponses.loading);
  }),

  // Partial 场景
  http.get('*/api/report/query/partial*', () => {
    return HttpResponse.json(mockApiResponses.partial);
  }),

  // Error 场景
  http.get('*/api/report/query/error*', () => {
    return HttpResponse.json(mockApiResponses.error, { status: 500 });
  }),

  // Empty 场景
  http.get('*/api/report/query/empty*', () => {
    return HttpResponse.json(mockApiResponses.empty);
  }),

  // Large 场景
  http.get('*/api/report/query/large*', () => {
    return HttpResponse.json(mockApiResponses.large);
  }),

  // Network Error 场景
  http.get('*/api/report/query/network-error*', () => {
    return HttpResponse.json(mockApiResponses.networkError, { status: 0 });
  }),

  // Timeout 场景
  http.get('*/api/report/query/timeout*', () => {
    return HttpResponse.json(mockApiResponses.timeout, { status: 408 });
  }),

  // 普通上传 - 2.5秒延迟
  http.post('*/api/report/fileUpload', async () => {
    // 模拟文件上传延迟 2-3 秒
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        fileID: `file-${Date.now()}`,
        fileName: 'test-document.pdf',
        uploadTime: new Date().toISOString(),
      },
    });
  }),

  // 快速上传场景 - 用于测试完成状态
  http.post('*/api/report/fileUpload/fast', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        fileID: `fast-file-${Date.now()}`,
        fileName: 'quick-upload.docx',
        uploadTime: new Date().toISOString(),
      },
    });
  }),

  // 慢速上传场景 - 用于测试长时间 loading
  http.post('*/api/report/fileUpload/slow', async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        fileID: `slow-file-${Date.now()}`,
        fileName: 'large-file.xlsx',
        uploadTime: new Date().toISOString(),
      },
    });
  }),

  // 上传失败场景
  http.post('*/api/report/fileUpload/error', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return HttpResponse.json(
      {
        ErrorCode: 'UPLOAD_FAILED',
        Message: '文件上传失败：文件大小超出限制',
      },
      { status: 400 }
    );
  }),

  // 带进度的上传场景 - 分步返回进度
  http.post('*/api/report/fileUpload/progress', async ({ request }) => {
    const url = new URL(request.url);
    const step = url.searchParams.get('step') || '0';
    const stepNum = parseInt(step, 10);

    // 模拟分步上传进度
    const delays = [800, 800, 800, 600, 400]; // 每步的延迟时间
    const progress = [20, 45, 70, 85, 100]; // 每步的进度

    if (stepNum < delays.length) {
      await new Promise((resolve) => setTimeout(resolve, delays[stepNum]));

      if (stepNum === delays.length - 1) {
        // 最后一步，返回完成状态
        return HttpResponse.json({
          ErrorCode: ApiCodeForWfc.SUCCESS,
          Data: {
            fileID: `progress-file-${Date.now()}`,
            fileName: 'progress-upload.pdf',
            uploadTime: new Date().toISOString(),
            progress: 100,
            completed: true,
          },
        });
      } else {
        // 中间步骤，返回进度
        return HttpResponse.json({
          ErrorCode: ApiCodeForWfc.SUCCESS,
          Data: {
            progress: progress[stepNum],
            completed: false,
            message: `上传中... ${progress[stepNum]}%`,
          },
        });
      }
    }

    // 默认返回完成
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        fileID: `default-progress-file-${Date.now()}`,
        fileName: 'default-progress.pdf',
        uploadTime: new Date().toISOString(),
        progress: 100,
        completed: true,
      },
    });
  }),

  // AI Chat: 意图分析（返回 ApiResponseForChat 结构）
  http.post('*/api/chat/analysisEngine', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      result: {
        rawSentenceID: 'mock-raw-sentence-id',
        itResult: {
          it: 'aireport.mock.intent',
          rewrite_sentence: '',
        },
        reAgentId: 'aireport.mock.agent',
      },
    });
  }),

  // AI Chat: 创建会话组
  http.post('*/api/chat/addChatGroup', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      result: { chatId: 'mock-chat-id' },
    });
  }),

  // AI Chat: 数据召回（返回 ApiResponseForChat 结构即可，内容可为空）
  http.post('*/api/chat/queryReference', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      result: null,
      finish: true,
    });
  }),

  // AI Chat: 问句拆解（返回字符串，finish=true 以结束轮询）
  http.post('*/api/chat/getUserQuestion', () => {
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      result: '请给我报告大纲\n请列出核心要点',
      finish: true,
    });
  }),

  // AI Chat: 流式输出（SSE） chat/getResult
  http.post('*/api/chat/getResult', () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const now = Date.now();
        // 模拟分片输出
        const chunks = ['这是第一段回答。', ' 这是第二段回答。', ' 这是第三段回答。'];
        for (let i = 0; i < chunks.length; i++) {
          const data = {
            id: `mock-sse-${i}`,
            object: 'chat.completion.chunk',
            created: now + i,
            model: 'mock-model',
            choices: [
              {
                index: 0,
                delta: {
                  content: chunks[i],
                  reasoning_content: '',
                },
                finish_reason: null,
              },
            ],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          await new Promise((r) => setTimeout(r, 200));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new HttpResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  }),

  // Report Files: 获取报告关联的文件列表
  http.get('*/api/report/files/*', ({ params }) => {
    const reportId = params[0] as string;

    // 根据 reportId 返回不同场景的数据
    if (reportId.includes('empty')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.empty,
        },
      });
    }

    if (reportId.includes('large')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.large,
        },
      });
    }

    if (reportId.includes('failed')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.withFailedFiles,
        },
      });
    }

    if (reportId.includes('processing')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.processing,
        },
      });
    }

    if (reportId.includes('images')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.imagesOnly,
        },
      });
    }

    if (reportId.includes('documents')) {
      return HttpResponse.json({
        ErrorCode: ApiCodeForWfc.SUCCESS,
        Data: {
          files: reportFilesMocks.documentsOnly,
        },
      });
    }

    if (reportId.includes('error')) {
      return HttpResponse.json(
        {
          ErrorCode: ApiCodeForWfc.DEFAULT_ERROR,
          Message: '获取报告文件失败',
        },
        { status: 500 }
      );
    }

    // 默认场景
    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      Data: {
        files: reportFilesMocks.default,
      },
    });
  }),
];
