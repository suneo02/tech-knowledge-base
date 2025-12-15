// 全局操作状态
export {
  selectGlobalOp,
  selectGlobalOperationKind,
  selectIsChapterAIGCOp,
  selectIsFullDocGen,
  selectIsGlobalBusy,
  selectIsServerLoading,
  selectShouldEditorBeReadonly,
} from './base';

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
} from './aigcGen';

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
} from './aigcTextRewrite';
