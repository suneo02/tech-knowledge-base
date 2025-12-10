/**
 * AI 操作相关类型定义
 *
 * 完全独立的类型定义，不依赖任何其他模块
 */

import type { SelectionSnapshot } from './selection-types';

/**
 * AI 任务类型定义
 *
 * 用于文本 AI 改写场景，定义支持的任务类型
 * 每个任务类型对应一个 ChatPresetQuestion 枚举值
 *
 * 配置和业务逻辑请参考：
 * @see apps/report-ai/src/domain/chat/taskConfig.ts - AI 任务配置
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 * @see packages/gel-api/src/chat/base/analysisEngine.ts - ChatPresetQuestion 枚举定义
 */

/**
 * AI 任务类型
 *
 * 支持的文本改写任务类型：
 * - polish: 润色/完善表达
 * - translate: 翻译文字
 * - expand: 扩写内容
 * - contract: 缩写内容
 * - continue: 续写内容
 * - summarize: 总结标题
 * - bullet_points: 列举关键点
 */
export type AITaskType = 'polish' | 'translate' | 'expand' | 'contract' | 'continue' | 'summarize' | 'bullet_points';

/**
 * AI 操作数据
 *
 * 包含解析后的选区信息，直接传递给外部回调
 * 由 menuRegistry 内部解析并传递给外部使用
 */
export interface AIActionData {
  /** AI 任务类型 */
  actionType: AITaskType;
  /** 选区快照（包含文本、HTML、上下文、书签等） */
  snapshot: SelectionSnapshot;
  /** 选区所属的章节 ID */
  chapterId: string;
}

/**
 * 文本改写操作数据
 *
 * 用于 Redux 状态管理中的文本改写操作
 */
export interface TextRewriteOperationData {
  type: 'text_rewrite';
  snapshot: SelectionSnapshot;
  correlationId: string;
  chapterId: string;
  taskType: string;
}

/**
 * AI 操作调用函数类型
 */
export type AIInvokeFunction = (params: AIActionData) => void;
