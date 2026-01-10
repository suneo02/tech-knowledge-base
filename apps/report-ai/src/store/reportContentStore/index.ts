/**
 * 报告内容管理 Store 模块入口
 *
 * 任务1.1：定义核心数据类型（融入一致性保障）
 * 提供报告级别的 RTK Store 工厂，支持多报告并存
 * 每个 ReportEditor 实例使用独立的 Provider
 */

// 工厂函数和 Provider
export { createReportContentStore } from './factory';
export type { ReportContentDispatch, ReportContentStore } from './factory';
export { RPDetailRTKScope } from './provider';

// Redux Slice
export { rpDetailActions } from './slice';

// Hooks
// Redux Hooks
export { useRPDetailDispatch, useRPDetailSelector } from './hooksRedux';

// 业务 Hooks
export {
  useCancelGeneration,
  useChapterRegeneration,
  useEditorDraftSync,
  useFullDocGeneration,
  useRehydrationOrchestrator,
  useReportContentPersistence,
} from './hooks';

export type {
  ReportContentPersistenceState,
  UseCancelGenerationReturn,
  UseChapterRegenerationReturn,
  UseEditorDraftSyncOptions,
  UseEditorDraftSyncReturn,
  UseFullDocumentGenerationReduxParams,
  UseFullDocumentGenerationReduxReturn,
  UseRehydrationOrchestratorOptions,
  UseReportContentPersistenceOptions,
} from './hooks';

// 选择器
export {
  selectCanonicalDocHtml,
  selectChapterContentMap,
  selectChapterEpoch,
  selectChapterEpochs,
  selectChapterLockedStates,
  selectChapters,
  selectChapterState,
  selectChapterStates,
  selectFullDocGenData,
  selectFullDocGenError,
  selectFullDocGenProgress,
  selectGlobalOp,
  selectGlobalOperationKind,
  selectHydration,
  selectHydrationActiveOperations,
  selectIsChapterLocked,
  selectIsGlobalBusy,
  selectIsServerLoading,
  selectLatestRequestedOperations,
  selectReferenceMap,
  selectReferenceOrdinalMap,
  selectReferencePriority,
  selectReportId,
  selectReportName,
  selectShouldEditorBeReadonly,
  selectSortedReferences,
} from './selectors';
