/**
 * useRehydrationOrchestrator - 注水编排统一入口（彻底重构后）
 *
 * @description
 * 重构核心：决策与执行彻底分离
 * - Redux 决策层：通过 currentTask 告诉 Hook 做什么
 * - Hook 执行层：读取任务，执行编辑器操作
 *
 * 精简为 3 个 Hook，职责更清晰：
 * - useHydrationExecutor: 纯执行层（读取 Redux 任务，执行编辑器操作）
 * - useStreamingPreview: 流式预览（全文生成期间）
 * - useCompletionHandler: 完成检测与收尾
 *
 * 核心优势：
 * - ✅ Redux 负责决策（设置任务类型）
 * - ✅ Hook 负责执行（读取任务，操作编辑器）
 * - ✅ 彻底分离关注点，代码极简
 *
 * @see {@link ./rehydration/HYDRATION.md | Hydration 运行手册}
 * @see {@link ../../../docs/RPDetail/ContentManagement/data-layer-guide.md | 数据与状态管理 - Hydration 状态}
 * @see {@link ./README.md | Hooks 架构说明}
 *
 * @since 3.0 (彻底重构版 - Redux 决策驱动)
 */

import { ReportEditorRef } from '@/types/editor';
import type { RefObject } from 'react';
import { useChapterStreamPreview } from './rehydration/useChapterStreamPreview';
import { useCompletionHandler } from './rehydration/useCompletionHandler';
import { useHydrationExecutor } from './rehydration/useHydrationExecutor';

export interface UseRehydrationOrchestratorOptions {
  editorRef: RefObject<ReportEditorRef>;
  enableStreaming?: boolean; // 默认 true
}

export const useRehydrationOrchestrator = (options: UseRehydrationOrchestratorOptions) => {
  const { editorRef, enableStreaming = true } = options;

  // 核心执行层：读取 Redux 任务，执行编辑器操作
  useHydrationExecutor({ editorRef });

  // 辅助层：流式预览（全文生成期间）
  useChapterStreamPreview({ editorRef, enableStreaming });

  // 辅助层：完成检测与收尾
  useCompletionHandler();
};
