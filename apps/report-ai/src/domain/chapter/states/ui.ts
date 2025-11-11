/**
 * 章节 UI 状态管理
 *
 * 职责：
 * - 展开/折叠状态管理
 * - 选择状态管理
 *
 * 特点：
 * - 使用 Set 存储状态（高效查找）
 * - 所有函数返回新 Set（不可变）
 * - 提供工具对象（expandStateUtils, selectionStateUtils）
 *
 * @module chapter/states/ui
 */

import { traverseTree } from 'gel-util/common';
import { getAllChapterKeys } from '../queries/find';
import { ChapterLikeWithTempId } from '../types';

// ===== 展开状态管理 =====

/**
 * 章节展开状态管理工具对象
 */
export const expandStateUtils = {
  toggle: (expandedChapters: Set<string>, chapterId: string): Set<string> => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    return newExpanded;
  },

  isAllExpanded: <T extends ChapterLikeWithTempId<T>>(treeData: T[], expandedChapters: Set<string>): boolean => {
    const allChapterKeys = getAllChapterKeys(treeData);
    return allChapterKeys.every((key) => expandedChapters.has(key));
  },

  collapseAll: (): Set<string> => {
    return new Set<string>();
  },

  expandAll: <T extends ChapterLikeWithTempId<T>>(treeData: T[]): Set<string> => {
    const allChapterKeys = getAllChapterKeys(treeData);
    return new Set(allChapterKeys);
  },

  expandToLevel: <T extends { chapterId: string; children?: T[] }>(treeData: T[], maxLevel: number): Set<string> => {
    const expandedIds = new Set<string>();
    traverseTree(treeData, (node, depth) => {
      if (depth < maxLevel) {
        expandedIds.add(node.chapterId);
      }
    });
    return expandedIds;
  },

  expandPath: (expandedChapters: Set<string>, chapterIds: string[]): Set<string> => {
    const newExpanded = new Set(expandedChapters);
    chapterIds.forEach((id) => newExpanded.add(id));
    return newExpanded;
  },
};

// ===== 选择状态管理 =====

/**
 * 章节选择状态管理工具
 */
export const selectionStateUtils = {
  toggle: (selectedChapters: Set<string>, chapterId: string): Set<string> => {
    const newSelected = new Set(selectedChapters);
    if (newSelected.has(chapterId)) {
      newSelected.delete(chapterId);
    } else {
      newSelected.add(chapterId);
    }
    return newSelected;
  },

  clearAll: (): Set<string> => {
    return new Set<string>();
  },

  selectLevel: <T extends { chapterId: string; children?: T[] }>(treeData: T[], targetLevel: number): Set<string> => {
    const selectedIds = new Set<string>();
    traverseTree(treeData, (node, depth) => {
      if (depth === targetLevel) {
        selectedIds.add(node.chapterId);
      }
    });
    return selectedIds;
  },

  selectLeafNodes: <T extends { chapterId: string; children?: T[] }>(treeData: T[]): Set<string> => {
    const leafIds = new Set<string>();
    traverseTree(treeData, (node) => {
      if (!node.children || node.children.length === 0) {
        leafIds.add(node.chapterId);
      }
    });
    return leafIds;
  },
};
