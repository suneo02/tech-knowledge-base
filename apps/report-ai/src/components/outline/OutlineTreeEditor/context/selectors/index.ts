/**
 * Selector 函数
 *
 * @description 用于从状态中提取派生数据的纯函数
 * 所有 selector 都是纯函数，便于测试和优化
 */

import { TreePath } from 'gel-util/common';
import { createPathKey } from '../../../pathUtils';
import { EditorState } from '../types';

// ===== 基础状态 Selector =====

/**
 * 获取大纲数据
 */
export const selectOutlineData = (state: EditorState) => state.data;

/**
 * 获取同步状态
 */
export const selectIsSyncing = (state: EditorState) => state.isSyncing;

/**
 * 获取错误信息
 */
export const selectError = (state: EditorState) => state.error;

// ===== 导航状态 Selector =====

/**
 * 获取导航状态
 */
export const selectNavigationState = (state: EditorState) => ({
  selectedPath: state.selectedPath,
  activeItem: state.activeItem,
});

/**
 * 获取当前选中的项目路径
 */
export const selectSelectedPath = (state: EditorState) => state.selectedPath;

/**
 * 获取当前活跃项目状态
 */
export const selectActiveItem = (state: EditorState) => state.activeItem;

/**
 * 获取当前聚焦的项目路径（兼容性函数）
 */
export const selectFocusedPath = (state: EditorState) =>
  state.activeItem?.mode === 'focused' ? state.activeItem.path : null;

/**
 * 获取当前编辑的项目路径（兼容性函数）
 */
export const selectEditingPath = (state: EditorState) =>
  state.activeItem?.mode === 'editing' ? state.activeItem.path : null;

/**
 * 检查指定路径是否为当前聚焦项目
 */
export const selectIsFocused = (state: EditorState, path: TreePath): boolean => {
  const activeItem = state.activeItem;
  return (
    activeItem?.mode === 'focused' &&
    activeItem.path !== null &&
    path.length === activeItem.path.length &&
    path.every((p, i) => p === activeItem.path![i])
  );
};

/**
 * 检查指定路径是否正在编辑标题
 */
export const selectIsEditingTitle = (state: EditorState, path: TreePath): boolean => {
  const activeItem = state.activeItem;
  return (
    activeItem?.mode === 'editing' &&
    activeItem.editingType === 'title' &&
    activeItem.path !== null &&
    path.length === activeItem.path.length &&
    path.every((p, i) => p === activeItem.path![i])
  );
};

/**
 * 检查指定路径是否正在编辑思路
 */
export const selectIsEditingThought = (state: EditorState, path: TreePath): boolean => {
  const activeItem = state.activeItem;
  return (
    activeItem?.mode === 'editing' &&
    activeItem.editingType === 'thought' &&
    activeItem.path !== null &&
    path.length === activeItem.path.length &&
    path.every((p, i) => p === activeItem.path![i])
  );
};

/**
 * 获取当前编辑类型
 */
export const selectEditingType = (state: EditorState): 'title' | 'thought' | null => {
  const activeItem = state.activeItem;
  return activeItem?.mode === 'editing' ? activeItem.editingType || null : null;
};

// ===== 编写思路生成 Selector =====

/**
 * 获取编写思路生成状态
 */
export const selectThoughtGenerationState = (state: EditorState) => ({
  generatingPaths: state.thoughtGeneratingPaths,
  errors: state.thoughtGenerationErrors,
});

/**
 * 检查指定路径是否正在生成编写思路
 *
 * @param state 编辑器状态
 * @param path 章节路径
 * @returns 是否正在生成编写思路
 */
export const selectIsGeneratingThought = (state: EditorState, path: TreePath): boolean => {
  const pathKey = createPathKey(path);
  return state.thoughtGeneratingPaths.has(pathKey);
};

/**
 * 获取指定路径的编写思路生成错误信息
 *
 * @param state 编辑器状态
 * @param path 章节路径
 * @returns 错误信息字符串，无错误时返回空字符串
 */
export const selectThoughtGenerationError = (state: EditorState, path: TreePath): string => {
  const pathKey = createPathKey(path);
  return state.thoughtGenerationErrors[pathKey] || '';
};

/**
 * 获取所有正在生成编写思路的路径
 */
export const selectGeneratingPaths = (state: EditorState): Set<string> => {
  return state.thoughtGeneratingPaths;
};

/**
 * 获取所有编写思路生成错误
 */
export const selectAllThoughtGenerationErrors = (state: EditorState): Record<string, string> => {
  return state.thoughtGenerationErrors;
};

// ===== 派生数据 Selector =====

/**
 * 检查是否有任何章节正在生成编写思路
 */
export const selectHasAnyGeneratingThought = (state: EditorState): boolean => {
  return state.thoughtGeneratingPaths.size > 0;
};

/**
 * 获取正在生成编写思路的章节数量
 */
export const selectGeneratingThoughtCount = (state: EditorState): number => {
  return state.thoughtGeneratingPaths.size;
};

/**
 * 检查是否有编写思路生成错误
 */
export const selectHasThoughtGenerationErrors = (state: EditorState): boolean => {
  return Object.values(state.thoughtGenerationErrors).some((error) => error.trim() !== '');
};

// ===== 查询工具函数 Selector =====

/**
 * 获取指定路径的章节数据
 *
 * @param state 编辑器状态
 * @param path 章节路径
 * @returns 章节数据，不存在时返回 null
 */
export const selectChapterByPath = (state: EditorState, path: TreePath) => {
  let current = state.data.chapters[path[0]];
  if (!current) return null;

  for (let i = 1; i < path.length; i++) {
    if (!current.children) return null;
    current = current.children[path[i]];
    if (!current) return null;
  }

  return current;
};

/**
 * 获取章节总数
 *
 * @param state 编辑器状态
 * @returns 章节总数
 */
export const selectTotalChapterCount = (state: EditorState): number => {
  const countChapters = (chapters: any[]): number => {
    return chapters.reduce((count, chapter) => {
      return count + 1 + (chapter.children ? countChapters(chapter.children) : 0);
    }, 0);
  };
  return countChapters(state.data.chapters);
};

/**
 * 检查路径是否有效
 *
 * @param state 编辑器状态
 * @param path 章节路径
 * @returns 路径是否有效
 */
export const selectIsValidPath = (state: EditorState, path: TreePath): boolean => {
  return selectChapterByPath(state, path) !== null;
};
