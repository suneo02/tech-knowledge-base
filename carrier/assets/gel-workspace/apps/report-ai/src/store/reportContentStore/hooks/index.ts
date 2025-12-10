/**
 * 状态管理 Hooks 入口
 *
 * 任务1.2：创建状态管理Hook（融入一致性保障）
 * 导出所有状态管理相关的 Hooks
 */

// 编辑器草稿同步 - 基于新的 Draft Map 架构
export { useEditorDraftSync } from './useEditorDraftSync';
export type { UseEditorDraftSyncOptions, UseEditorDraftSyncReturn } from './useEditorDraftSync';

export { useReportContentPersistence } from './useReportContentPersistence';
export type { ReportContentPersistenceState, UseReportContentPersistenceOptions } from './useReportContentPersistence';

// 全文生成Redux版本
export { useFullDocGeneration } from './useFullDocGeneration';
export type {
  UseFullDocumentGenerationReduxParams,
  UseFullDocumentGenerationReduxReturn,
} from './useFullDocGeneration';

// 全文生成控制器（仅在 Provider 内部使用）
export { useFullDocGenerationController } from './useFullDocGenerationController';

// 章节重生成
export { useChapterRegeneration } from './useChapterRegeneration';
export type { UseChapterRegenerationReturn } from './useChapterRegeneration';

// 多章节顺序生成
export { useMultiChapterGeneration } from './useMultiChapterGeneration';
export type { UseMultiChapterGenerationParams, UseMultiChapterGenerationReturn } from './useMultiChapterGeneration';

// LocalDraft与ReportChapter同步管理功能已整合到 useEditorDraftSync 中
// ✅ useEditorDraftSync 已重新实现以适应新的 Draft Map 架构

// AI 生成期间的流式重注水
export { useRehydrationOrchestrator } from './useRehydrationOrchestrator';
export type { UseRehydrationOrchestratorOptions } from './useRehydrationOrchestrator';

// 文本改写
export { useTextRewrite } from './useTextRewrite';
export type { UseTextRewriteOptions, UseTextRewriteReturn } from './useTextRewrite';

// 报告文件管理
export { useReportFiles } from './useReportFiles';
export type { UseReportFilesParams, UseReportFilesReturn } from './useReportFiles';
