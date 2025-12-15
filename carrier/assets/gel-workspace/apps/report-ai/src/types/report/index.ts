// 原有类型

// 章节扩展类型
export type { RPChapterEnriched, RPChapterFlat, RPLeafChapterEnriched } from './chapter';

// 本地草稿相关类型
export type { DocumentDraftState, DocumentStatus, DraftBaselineSource, RPDetailChapterDraft } from './localDraft';

// AI生成相关类型
export type {
  ChapterOperation,
  ChapterRegenerationOperationData,
  FullDocumentGenerationProgress,
  FullGenerationOperationData,
  GenerationProgress,
  GlobalOperationKind,
  GlobalOpState,
  HydrationTask,
  MultiChapterGenerationOperationData,
  RehydrationCheck,
  RPHydrationState,
} from './generation';

// 操作状态相关类型
export type { ChapterFrontendState } from './operations';

// 左侧大纲视图模型
export type { OutlineChapterViewModel } from './outlineView';
