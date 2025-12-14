/**
 * Selectors 统一导出
 *
 * @description
 * 按功能模块组织的选择器统一导出入口
 *
 * **架构说明**：
 * - base: 基础状态选择器（直接访问 Redux state）
 * - chapters-draft: Draft 层章节选择器（用于编辑器实时显示）
 * - chapters-canonical: Canonical 层章节选择器（用于初始化、导出等）
 * - draftTree: 草稿树状态选择器
 * - composition: 章节内容合成选择器
 * - outlineView: 大纲视图模型选择器
 * - operations: 操作状态选择器
 * - generation: 全文生成选择器
 * - globalOperation: 全局互斥操作选择器
 * - chapterStats: 章节统计选择器
 */

// ==================== 基础状态选择器 ====================
export {
  selectChapters,
  selectCurrentHydrationTask,
  selectHydration,
  selectHydrationActiveOperations,
  selectLatestRequestedOperations,
  selectReferencePriority,
  selectReportContent,
  selectReportFiles,
  selectReportId,
  selectReportName,
} from './base';

// ==================== Canonical 层章节选择器（用于初始化、导出） ====================
export {
  selectCanonicalChapterMap,
  selectCanonicalChaptersEnriched,
  selectCanonicalChaptersEnrichedMap,
  selectFileUnifiedList,
  selectFileUnifiedMap,
  selectLeafChapterMap,
  selectLeafChapterOrderMap,
  selectLeafChapters,
  selectPendingFileIds,
  selectReferenceMap,
  selectReferenceOrdinalMap,
  selectSortedReferences,
  selectTopReportFiles,
} from './chaptersCanonical';

// ==================== 草稿树状态选择器 ====================
export {
  selectDocumentDraft,
  selectDocumentStatus,
  selectDocumentStatusSummary,
  selectDraftTree,
  selectHasDirtyChanges,
  selectHasDraftState,
  selectIsSaving,
  selectShouldClearDraftState,
} from './draftTreeSelectors';

// ==================== 文档哈希选择器 ====================
export { selectBaselineDocHash } from './documentHash';

// ==================== 章节内容合成选择器 ====================
export { selectCanonicalChapterHtmlMap, selectCanonicalDocHtml, selectChapterContentMap } from './composition';

// ==================== 大纲视图模型选择器 ====================
export { selectOutlineViewChapters } from './outlineView';

// ==================== 操作相关选择器 ====================

// 全局操作状态
export {
  selectGlobalOp,
  selectGlobalOperationKind,
  selectIsChapterAIGCOp,
  selectIsFullDocGen,
  selectIsGlobalBusy,
  selectIsServerLoading,
  selectShouldEditorBeReadonly,
} from './globalOp';

// 生成操作（全文/多章节/单章节）
export {
  selectChapterRegenerationChapterId,
  selectFullDocGenData,
  selectFullDocGenError,
  selectFullDocGenProgress,
  selectIsChapterRegenerating,
  selectIsGenerationInterrupted,
  selectIsMultiChapterGenerating,
  selectMultiChapterFailedChapters,
  selectMultiChapterGenerationProgress,
  selectMultiChapterGenerationQueue,
} from './globalOp';

// 文本改写操作
export {
  selectIsTextRewriting,
  selectTextRewriteChapterId,
  selectTextRewriteCorrelationId,
  selectTextRewriteData,
  selectTextRewriteError,
  selectTextRewriteSnapshot,
  selectTextRewriteStartedAt,
  selectTextRewriteTaskType,
} from './globalOp';

// ==================== 章节统计选择器 ====================
export {
  selectChapterEpoch,
  selectChapterEpochs,
  selectChapterLockedStates,
  selectChapterState,
  selectChapterStates,
  selectIsChapterLocked,
} from './chapterStats';
