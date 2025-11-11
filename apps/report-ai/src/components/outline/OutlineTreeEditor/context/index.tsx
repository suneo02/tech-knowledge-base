/**
 * OutlineTreeEditor Context 统一导出
 *
 * @description 大纲编辑器 Context 相关的所有导出
 * 包括 Provider、Hook、类型定义等
 */

// Context Provider 和 Hooks
export {
  OutlineStoreProvider,
  useOutlineDispatch,
  useOutlineState,
  useOutlineStoreContext,
} from './OutlineStoreContext';

// 导入 OutlineAction 用于 action creator

// Selector 函数
export {
  selectActiveItem,
  selectAllThoughtGenerationErrors,
  selectChapterByPath,
  selectEditingPath,
  selectEditingType,
  selectError,
  selectFocusedPath,
  selectGeneratingPaths,
  selectGeneratingThoughtCount,
  selectHasAnyGeneratingThought,
  selectHasThoughtGenerationErrors,
  selectIsEditingThought,
  selectIsEditingTitle,
  selectIsFocused,
  selectIsGeneratingThought,
  selectIsSyncing,
  selectIsValidPath,
  selectNavigationState,
  selectOutlineData,
  selectSelectedPath,
  selectThoughtGenerationError,
  selectThoughtGenerationState,
  selectTotalChapterCount,
} from './selectors';

// 直接导出 OutlineAction，让外部直接构造 action
// 移除无意义的 action creator 封装

// 类型定义
export type { EditorState, OutlineStoreProviderProps } from './OutlineStoreContext';

export { OutlineAction } from './OutlineStoreContext';
