// ===== 类型定义 =====
export type { ChapterLike, ChapterLikeWithTempId as ChapterLikeWithOptionalId, ChapterMap, ChapterNode } from './types';

// ===== 查询操作 =====
export {
  findChapterById,
  findChapterPathById,
  generateChapterHierarchicalNumber,
  getAllChapterKeys,
  getChapterKey,
  type NodeWithPath,
} from './queries/find';

// ===== 分析工具 =====
export {
  buildChapterLevelMap,
  buildChapterMap,
  buildChapterOrderMap,
  buildChapterPathMap,
  type ChapterNodeMap,
} from './queries/analysis';

// ===== 变更操作 =====
export {
  insertSibling,
  moveSibling,
  type ReorderChange as ChapterReorderChange,
  type ReorderResult as ChapterReorderResult,
  type InsertResult,
} from './mutations/basic';

// ===== 工厂方法 =====
export { createChapter, generateChapterTempId } from './mutations/factory';

// ===== 高级业务操作 =====
export { chapterTreeOperations, type TreeOperations } from './mutations/operations';

// ===== ID 映射工具 =====
export { applyIdMapToChapters, getRealChapterId, type ApplyIdMapOptions } from './transforms/idMapping';

// ===== 保存流程转换 =====
export { convertDocumentChaptersToSaveFormat, mergeSavedChaptersWithCanonical } from './transforms/save';

// ===== 编辑流程转换 =====
export { convertDocumentChaptersToDraft, mergeDraftToOutlineView } from './transforms/editor';

// ===== UI 状态管理 =====
export { expandStateUtils, selectionStateUtils } from './states/ui';

// ===== 业务状态逻辑 =====
export {
  determineChapterAIMessageStatus,
  getChapterAIMessageStatusDisplayText,
  isChapterAIMessageFinished,
  isChapterAIMessageGenerating,
} from './states/business';
