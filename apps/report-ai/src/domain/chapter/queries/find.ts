/**
 * 章节查询工具
 *
 * 职责：
 * - 查找章节（按 ID、按路径）
 * - 计算路径和层级编号
 * - 获取章节列表
 *
 * 特点：
 * - 所有函数都是纯函数
 * - 使用 gel-util 的树工具
 * - 支持泛型，适用于任何章节类型
 *
 * @module chapter/queries/find
 */

import {
  TreePath,
  flattenTreeWithPath,
  generateHierarchicalNumber,
  getNodesAlongPath,
  traverseTree,
} from 'gel-util/common';
import type { ChapterLike } from '../types';

export interface NodeWithPath<T extends ChapterLike<T>> {
  node: T;
  path: TreePath;
}

/**
 * 根据ID查找章节路径
 */
export const findChapterPathById = <T extends ChapterLike<T>>(nodes: T[], id: string | number): TreePath | null => {
  const flat = flattenTreeWithPath(nodes, 'children');
  const target = flat.find(({ node }) => String(node.chapterId) === String(id));
  return target ? (target.path as TreePath) : null;
};

/**
 * 根据ID查找章节
 */
export const findChapterById = <T extends ChapterLike<T>>(chapters: T[], chapterId: string): T | null => {
  const path = findChapterPathById(chapters, chapterId);
  if (!path) return null;

  const nodesOnPath = getNodesAlongPath(chapters, path);
  return nodesOnPath.length ? nodesOnPath[nodesOnPath.length - 1] : null;
};

/**
 * 生成章节的层级编号（使用通用树工具）
 */
export const generateChapterHierarchicalNumber = (path: TreePath): string => {
  return generateHierarchicalNumber(path);
};

/**
 * 获取章节的唯一标识键
 * 优先使用 chapterId，不存在时使用 tempId
 *
 * @param chapter - 章节对象
 * @returns 章节的唯一标识字符串
 * @throws 如果 chapterId 和 tempId 都不存在，抛出错误
 */
export function getChapterKey(chapter: { chapterId?: string | number; tempId?: string }): string {
  const key = chapter.chapterId?.toString() ?? chapter.tempId;
  if (!key) {
    throw new Error('Chapter must have either chapterId or tempId');
  }
  return key;
}

/**
 * 获取所有章节的唯一键列表（包括子章节）
 * 支持临时章节（使用 tempId）和已保存章节（使用 chapterId）
 */
export function getAllChapterKeys<T extends { chapterId?: string | number; tempId?: string; children?: T[] }>(
  chapters: T[]
): string[] {
  const chapterKeys: string[] = [];
  traverseTree(chapters, (chapter) => {
    chapterKeys.push(getChapterKey(chapter));
  });
  return chapterKeys;
}
