/**
 * OutlineTreeEditor MSW Mock 接口
 *
 * @description 为大纲编辑器提供 MSW Mock 接口，支持定时失败模拟
 */

import { ApiCodeForWfc } from 'gel-api';
import { http, HttpResponse } from 'msw';

/**
 * 模拟编写思路生成内容
 */
const mockThoughtTemplates = [
  '本章节将从以下几个方面进行阐述：\n1. 核心概念的定义与内涵\n2. 相关理论基础与发展历程\n3. 实际应用场景与案例分析\n4. 未来发展趋势与展望',
  '在这一部分，我们需要重点关注：\n• 问题的本质特征与表现形式\n• 影响因素的深入分析\n• 解决方案的设计思路\n• 实施效果的评估标准',
  '本节内容的写作要点包括：\n→ 背景信息的详细介绍\n→ 关键数据的收集与整理\n→ 分析方法的选择与应用\n→ 结论的总结与建议',
  '针对该主题，建议从以下维度展开：\n▪ 宏观环境的影响分析\n▪ 微观层面的具体表现\n▪ 对比研究的方法运用\n▪ 政策建议的提出',
  '这部分内容应当涵盖：\n◆ 现状描述与问题识别\n◆ 原因分析与机制探讨\n◆ 对策建议与实施路径\n◆ 预期效果与风险评估',
];

/**
 * 根据章节标题生成相应的编写思路
 */
function generateThoughtByTitle(title: string): string {
  // 根据标题关键词选择合适的模板
  const keywords = ['概述', '分析', '研究', '发展', '问题', '对策', '建议', '总结', '展望'];
  let selectedTemplate = mockThoughtTemplates[0]; // 默认模板

  for (let i = 0; i < keywords.length; i++) {
    if (title.includes(keywords[i])) {
      selectedTemplate = mockThoughtTemplates[i % mockThoughtTemplates.length];
      break;
    }
  }

  // 添加针对性的内容
  const customizedThought = selectedTemplate.replace(/核心概念|问题|主题|该主题/g, `"${title}"相关内容`);

  return `${customizedThought}\n\n通过深入研究${title}，本章节旨在为读者提供全面而深入的理解，并为相关实践提供有价值的参考。`;
}

/**
 * 失败率控制器
 * 可以配置不同接口的失败概率和失败类型
 */
class FailureController {
  private failureRates: Record<string, number> = {};
  private lastFailureTimes: Record<string, number> = {};
  private failureIntervals: Record<string, number> = {};

  /**
   * 设置接口失败率
   * @param endpoint 接口名称
   * @param rate 失败率 (0-1)
   * @param intervalMs 定时失败间隔 (毫秒)
   */
  setFailureRate(endpoint: string, rate: number, intervalMs?: number) {
    this.failureRates[endpoint] = rate;
    if (intervalMs) {
      this.failureIntervals[endpoint] = intervalMs;
    }
  }

  /**
   * 判断是否应该失败
   */
  shouldFail(endpoint: string): boolean {
    const rate = this.failureRates[endpoint] || 0;
    const interval = this.failureIntervals[endpoint];
    const now = Date.now();

    // 定时失败逻辑
    if (interval) {
      const lastFailure = this.lastFailureTimes[endpoint] || 0;
      if (now - lastFailure >= interval) {
        this.lastFailureTimes[endpoint] = now;
        return true;
      }
    }

    // 随机失败逻辑
    return Math.random() < rate;
  }

  /**
   * 获取失败响应
   */
  getFailureResponse(endpoint: string) {
    const errorMessages = {
      analysisEngine: '意图分析失败，服务器错误',
      addChapter: '新增章节失败，服务器错误',
      updateChapter: '更新章节失败，网络超时',
      deleteChapter: '删除章节失败，权限不足',
      indentChapter: '缩进章节失败，数据冲突',
      outdentChapter: '取消缩进失败，操作无效',
      thoughtGeneration: '编写思路生成失败，AI服务暂时不可用',
    };

    return HttpResponse.json(
      {
        ErrorCode: ApiCodeForWfc.USE_FORBIDDEN,
        ErrorMsg: errorMessages[endpoint as keyof typeof errorMessages] || '操作失败',
        Data: null,
      },
      { status: 500 }
    );
  }
}

// 创建全局失败控制器实例
const failureController = new FailureController();

/**
 * 配置默认失败率
 * 可以根据需要调整不同接口的失败概率
 */
export const configureFailureRates = (config: {
  analysisEngine?: { rate: number; intervalMs?: number };
  addChapter?: { rate: number; intervalMs?: number };
  updateChapter?: { rate: number; intervalMs?: number };
  deleteChapter?: { rate: number; intervalMs?: number };
  indentChapter?: { rate: number; intervalMs?: number };
  outdentChapter?: { rate: number; intervalMs?: number };
  thoughtGeneration?: { rate: number; intervalMs?: number };
}) => {
  Object.entries(config).forEach(([endpoint, settings]) => {
    failureController.setFailureRate(endpoint, settings.rate, settings.intervalMs);
  });
};

/**
 * 模拟章节ID生成
 */
let mockChapterIdCounter = 1000;

/**
 * OutlineTreeEditor MSW Handlers
 */
export const outlineEditorHandlers = [
  // 意图分析引擎 (AnalysisEngine) - processChatPreflight 的第一步
  http.post('*/wind.ent.chat/api/chat/analysisEngine', async ({ request }) => {
    const body = (await request.json()) as any;

    // 检查是否应该失败
    if (failureController.shouldFail('analysisEngine')) {
      console.warn('🔴 MSW Mock: analysisEngine 模拟失败');
      return HttpResponse.json({
        result: null,
        message: '意图分析失败，服务器错误',
        ErrorCode: 500,
      });
    }

    // 模拟分析延迟
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100));

    // 生成模拟的分析结果
    const rawSentenceID = `sentence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chatId = body.body?.chatId || `chat_${Date.now()}`;
    const searchword = body.body?.searchword || '';

    console.log('✅ MSW Mock: analysisEngine 成功', {
      rawSentenceID,
      chatId,
      searchword: searchword.substring(0, 30) + '...',
    });

    // 返回符合 AnalysisEngineResponse 结构的响应
    return HttpResponse.json({
      result: {
        rawSentenceID,
        chatId,
        itResult: {
          it: 'report_outline_edit', // 意图分析结果：报告大纲编辑
          rewrite_sentence: searchword, // 重写句子，这里直接使用原句
        },
      },
      message: '意图分析成功',
      ErrorCode: ApiCodeForWfc.SUCCESS,
    });
  }),

  // 编写思路生成 (AI Agent) - 通过 chat/getUserQuestion 接口
  http.post('*/wind.ent.chat/api/chat/getUserQuestion', async ({ request }) => {
    const body = (await request.json()) as any;

    // 检查是否是编写思路生成请求 (通过 agentId 或其他标识判断)
    if (body.agentId === 'chapter_modify' || body.clientType === 'aireport') {
      // 检查是否应该失败
      if (failureController.shouldFail('thoughtGeneration')) {
        console.warn('🔴 MSW Mock: thoughtGeneration 模拟失败');
        return HttpResponse.json({
          result: '',
          message: '编写思路生成失败，AI服务暂时不可用',
          finish: true,
          status: 'error',
          ErrorCode: 500,
        });
      }

      // 模拟 AI 生成延迟（较长，因为是 AI 处理）
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000));

      // 从 rawSentenceID 中提取章节ID，模拟获取章节信息
      const chapterId = body.rawSentenceID || '1001';
      const mockTitle = body.rawSentence || `章节 ${chapterId}`; // 使用实际的用户输入作为标题

      const generatedThought = generateThoughtByTitle(mockTitle);

      console.log('✅ MSW Mock: thoughtGeneration 成功', {
        chapterId,
        title: mockTitle,
        generatedThought: generatedThought.substring(0, 50) + '...',
      });

      // 返回符合 ApiResponseForChat<string> 结构的响应
      return HttpResponse.json({
        result: '编写思路生成完成', // 问句拆解结果
        message: '编写思路生成成功',
        finish: true,
        status: 'success',
        // 关键：在 reportData 中包含 chapterOperation
        reportData: {
          chapterOperation: {
            chapter: {
              chapterId: parseInt(chapterId),
              title: mockTitle,
              writingThought: generatedThought,
            },
            status: {
              success: true,
              message: '编写思路生成完成',
              operation: 'create_with_ai',
            },
          },
        },
        ErrorCode: ApiCodeForWfc.SUCCESS,
      });
    }

    // 如果不是编写思路生成请求，返回默认响应
    return HttpResponse.json({
      result: '问句拆解完成',
      message: '请求处理成功',
      finish: true,
      status: 'success',
      ErrorCode: ApiCodeForWfc.SUCCESS,
    });
  }),

  // 新增章节
  http.post('*/reportChapter/batchUpdateChapterTree', async ({ request }) => {
    const body = (await request.json()) as any;

    // 检查是否应该失败
    if (failureController.shouldFail('addChapter')) {
      console.warn('🔴 MSW Mock: addChapter 模拟失败');
      return failureController.getFailureResponse('addChapter');
    }

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200));

    const chapterId = ++mockChapterIdCounter;
    console.log('✅ MSW Mock: addChapter 成功', { body, chapterId });

    return HttpResponse.json({
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMsg: '新增章节成功',
    });
  }),
];

/**
 * 预定义的失败配置方案
 */
export const failureScenarios = {
  // 无失败
  none: () => configureFailureRates({}),

  // 低失败率 (5%)
  low: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.05 },
      addChapter: { rate: 0.05 },
      updateChapter: { rate: 0.05 },
      deleteChapter: { rate: 0.05 },
      indentChapter: { rate: 0.05 },
      outdentChapter: { rate: 0.05 },
      thoughtGeneration: { rate: 0.05 },
    }),

  // 中等失败率 (15%)
  medium: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.15 },
      addChapter: { rate: 0.15 },
      updateChapter: { rate: 0.15 },
      deleteChapter: { rate: 0.15 },
      indentChapter: { rate: 0.15 },
      outdentChapter: { rate: 0.15 },
      thoughtGeneration: { rate: 0.15 },
    }),

  // 高失败率 (30%)
  high: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.3 },
      addChapter: { rate: 0.3 },
      updateChapter: { rate: 0.3 },
      deleteChapter: { rate: 0.3 },
      indentChapter: { rate: 0.3 },
      outdentChapter: { rate: 0.3 },
      thoughtGeneration: { rate: 0.3 },
    }),

  // 定时失败 (每10秒失败一次)
  timed: () =>
    configureFailureRates({
      analysisEngine: { rate: 0, intervalMs: 9000 },
      addChapter: { rate: 0, intervalMs: 10000 },
      updateChapter: { rate: 0, intervalMs: 12000 },
      deleteChapter: { rate: 0, intervalMs: 15000 },
      indentChapter: { rate: 0, intervalMs: 8000 },
      outdentChapter: { rate: 0, intervalMs: 11000 },
      thoughtGeneration: { rate: 0, intervalMs: 13000 },
    }),

  // 混合模式 (随机 + 定时)
  mixed: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.1, intervalMs: 18000 },
      addChapter: { rate: 0.1, intervalMs: 20000 },
      updateChapter: { rate: 0.1, intervalMs: 25000 },
      deleteChapter: { rate: 0.2, intervalMs: 30000 },
      indentChapter: { rate: 0.1, intervalMs: 18000 },
      outdentChapter: { rate: 0.1, intervalMs: 22000 },
      thoughtGeneration: { rate: 0.15, intervalMs: 28000 },
    }),

  // AI 专项测试 (只有编写思路生成有较高失败率)
  aiTest: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.05 },
      addChapter: { rate: 0.05 },
      updateChapter: { rate: 0.05 },
      deleteChapter: { rate: 0.05 },
      indentChapter: { rate: 0.05 },
      outdentChapter: { rate: 0.05 },
      thoughtGeneration: { rate: 0.4, intervalMs: 15000 }, // 40% 失败率 + 定时失败
    }),

  // 分析引擎专项测试 (只有意图分析有较高失败率)
  analysisTest: () =>
    configureFailureRates({
      analysisEngine: { rate: 0.5, intervalMs: 10000 }, // 50% 失败率 + 定时失败
      addChapter: { rate: 0.05 },
      updateChapter: { rate: 0.05 },
      deleteChapter: { rate: 0.05 },
      indentChapter: { rate: 0.05 },
      outdentChapter: { rate: 0.05 },
      thoughtGeneration: { rate: 0.05 },
    }),
};

/*
 * ===== 使用说明 =====
 *
 * ## 基础使用
 *
 * 1. 导入并注册 MSW handlers:
 *    import { outlineEditorHandlers, failureScenarios } from '@/mocks/report/outlineEditor.msw'
 *    setupWorker(...outlineEditorHandlers).start()
 *
 * 2. 配置失败场景:
 *    failureScenarios.none()         // 无失败
 *    failureScenarios.low()          // 低失败率 (5%)
 *    failureScenarios.medium()       // 中等失败率 (15%)
 *    failureScenarios.high()         // 高失败率 (30%)
 *    failureScenarios.timed()        // 定时失败
 *    failureScenarios.mixed()        // 混合模式
 *    failureScenarios.aiTest()       // AI 专项测试
 *    failureScenarios.analysisTest() // 分析引擎专项测试
 *
 * 3. 自定义失败配置:
 *    configureFailureRates({
 *      analysisEngine: { rate: 0.1, intervalMs: 8000 },    // 意图分析失败
 *      thoughtGeneration: { rate: 0.2, intervalMs: 10000 }, // 编写思路生成失败
 *      addChapter: { rate: 0.1 }                            // 新增章节失败
 *    })
 *
 * ## 支持的接口
 *
 * ### 意图分析引擎 (AnalysisEngine)
 * - 接口: POST /wind.ent.chat/api/chat/analysisEngine
 * - 功能: 分析用户意图，生成 rawSentenceID 和 chatId
 * - 延迟: 100-400ms（模拟分析处理时间）
 * - 失败配置: analysisEngine
 * - 返回: AnalysisEngineResponse 结构，包含意图分析结果
 *
 * ### 编写思路生成 (AI Agent)
 * - 接口: POST /wind.ent.chat/api/chat/getUserQuestion
 * - 触发条件: agentId === 'chapter_modify' || clientType === 'aireport'
 * - 功能: 根据章节标题智能生成编写思路
 * - 延迟: 1-3秒（模拟 AI 处理时间）
 * - 失败配置: thoughtGeneration
 * - 返回: ApiResponseForChat<string> 结构，reportData.chapterOperation 包含生成结果
 *
 * ### 章节操作
 * - 新增章节: POST /reportChapter/addChapter
 * - 更新章节: POST /reportChapter/updateChapter
 * - 删除章节: POST /reportChapter/deleteChapter
 * - 缩进章节: POST /reportChapter/indentChapter
 * - 取消缩进: POST /reportChapter/outdentChapter
 *
 * ## 编写思路生成特性
 *
 * ### 智能内容生成
 * - 根据章节标题关键词选择合适的模板
 * - 支持关键词：概述、分析、研究、发展、问题、对策、建议、总结、展望
 * - 自动生成结构化的编写思路内容
 *
 * ### 模拟真实场景
 * - 较长的处理延迟（1-3秒）
 * - 可配置的失败率和定时失败
 * - 详细的控制台日志输出
 *
 * ## 测试建议
 *
 * 1. 正常流程测试: 使用 failureScenarios.none()
 * 2. 错误处理测试: 使用 failureScenarios.high() 或 failureScenarios.aiTest()
 * 3. 性能测试: 观察 AI 生成的延迟处理
 * 4. 用户体验测试: 使用 failureScenarios.mixed() 模拟真实网络环境
 */
