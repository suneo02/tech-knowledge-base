/**
 * AI生成相关类型定义
 *
 * @description 全文生成、章节重生成等AI功能的类型定义
 * @author AI Assistant
 * @since 1.0.0
 */

import type { TextRewriteOperationData } from '@/types/editor';

/**
 * 全局互斥操作类型
 *
 * @description 只允许一种非 idle 的操作存在，保存/草稿等本地并行状态不在此管理
 */
export type GlobalOperationKind =
  | 'idle'
  | 'server_loading'
  | 'full_generation'
  | 'multi_chapter_generation'
  | 'chapter_regeneration'
  | 'text_rewrite'
  | 'error';

/**
 * 全文生成操作数据
 */
export interface FullGenerationOperationData {
  type: 'full_generation';
  queue: string[];
  currentIndex: number;
}

/**
 * 多章节顺序生成操作数据
 */
export interface MultiChapterGenerationOperationData {
  type: 'multi_chapter_generation';
  queue: string[];
  currentIndex: number;
  failedChapters: string[];
}

/**
 * 章节重生成操作数据
 */
export interface ChapterRegenerationOperationData {
  type: 'chapter_regeneration';
  chapterId: string;
  correlationId: string;
}

/**
 * 全局操作状态（统一管理状态和数据）
 *
 * @description
 * - 状态和数据集中管理
 * - 类型安全：TypeScript 可以根据 kind 推断 data 类型
 * - 减少冗余字段
 */
export interface GlobalOpState {
  kind: GlobalOperationKind;
  startedAt: number | null;
  operationId?: string;

  /** 操作特定数据（根据 kind 不同而不同） */
  data?:
    | FullGenerationOperationData
    | MultiChapterGenerationOperationData
    | ChapterRegenerationOperationData
    | TextRewriteOperationData
    | null;

  /** 错误信息（仅在 kind === 'error' 时有值） */
  error?: string | null;
}

/**
 * 全文生成进度信息（派生类型，用于 UI 展示）
 *
 * @description 从 globalOperation.data 派生计算
 */
export interface FullDocumentGenerationProgress {
  currentIndex: number;
  total: number;
  completed: number;
  currentChapterId: string | null;
  percentage: number;
}

/**
 * 多章节生成进度信息（派生类型，用于 UI 展示）
 *
 * @description 从 globalOperation.data 派生计算
 */
export interface MultiChapterGenerationProgress {
  currentIndex: number;
  total: number;
  completed: number;
  failed: number;
  currentChapterId: string | null;
  percentage: number;
  failedChapters: string[];
}

/**
 * 章节操作记录
 *
 * @description 跟踪章节操作的生命周期，支持关联ID机制
 */
export interface ChapterOperation {
  /** 操作ID（关联ID） */
  correlationId: string;
  /** 章节ID */
  chapterId: string;
  /** 操作开始时间 */
  startTime: number;
  /** 操作状态 */
  status: 'pending' | 'completed' | 'failed';
  /** 操作版本号 */
  version?: number;
}

/**
 * 章节操作请求追踪
 *
 * @description 记录每个章节正在请求的最新 correlationId 以及是否已发送请求
 */
export interface ChapterOperationRequestState {
  correlationId: string;
  requested: boolean;
}

/**
 * AI 生成进度信息
 *
 * @description 通用的AI生成进度跟踪
 */
export interface GenerationProgress {
  totalChapters: number;
  completedChapters: number;
  currentChapterId: string | null;
  estimatedTimeRemaining: number; // 毫秒
  errorChapters: string[];
}

/**
 * 重注水条件检查结果
 *
 * @description 用于判断是否需要重注水到编辑器
 */
export interface RehydrationCheck {
  /** 是否应该重注水 */
  shouldRehydrate: boolean;
  /** 重注水原因 */
  reason: string;
  /** 冲突的章节ID列表 */
  conflictedChapters?: string[];
}

/**
 * 注水任务类型 - Redux 决策层的输出
 *
 * @description Redux 通过此类型明确告诉 Hook "需要执行什么任务"
 * Hook 层只负责执行，不再做场景判断
 */
export type HydrationTask =
  | {
      /** 初始化全量注水（首次页面加载） */
      type: 'full-init';
      reason: 'page-load';
    }
  | {
      /** 全量重注水（还原 / 生成完成） */
      type: 'full-rehydrate';
      reason: 'restore' | 'generation-complete';
    }
  | {
      /** 章节级注水（重生成） */
      type: 'chapter-rehydrate';
      chapterIds: string[];
      correlationIds: string[];
    }
  | {
      /** 空闲状态（无需注水） */
      type: 'idle';
    };

/**
 * 水合状态管理（重构后 - 最精简版）
 *
 * @description
 * - Redux 决策层：通过 currentTask 告诉 Hook 需要做什么
 * - Hook 执行层：读取 currentTask，执行对应的编辑器操作
 *
 * 核心改进：
 * - 决策与执行彻底分离
 * - 状态语义化（currentTask 明确表达意图）
 * - 移除不必要的 epoch 跟踪（页面加载总是需要注水）
 */
export interface RPHydrationState {
  /**
   * 当前待执行的注水任务（Redux 决策）
   *
   * - 设置：Redux reducers 根据事件类型决定任务
   * - 消费：useHydrationExecutor 读取并执行
   * - 完成：执行后 dispatch completeHydrationTask 重置为 idle
   */
  currentTask: HydrationTask;

  /**
   * 进行中的章节操作（correlationId 追踪）
   *
   * - 设置：startChapterOperation
   * - 完成：completeChapterOperation
   * - 用途：辅助重生成场景识别操作完成
   */
  activeOperations: Record<string, ChapterOperation>;

  /**
   * 最近一次针对章节的请求信息
   *
   * - key: chapterId
   * - value: correlationId 及是否已发送请求
   */
  latestRequestedOperations: Record<string, ChapterOperationRequestState>;
}
