/**
 * 章节 Leaf 判断工具
 *
 * @description 提供章节是否为 leaf chapter 的判断逻辑
 */

import { isLeafNode, type TreeNode } from 'gel-util/common';

/**
 * 判断章节是否为 leaf chapter
 *
 * @param chapterId 章节 ID
 * @param chapterMap 章节映射表
 * @returns 是否为 leaf chapter
 */
export const isLeafChapter = <T extends TreeNode<T>>(chapterId: string, chapterMap: Map<string, T>): boolean => {
  const chapter = chapterMap.get(chapterId);
  if (!chapter) {
    return false;
  }
  return isLeafNode(chapter);
};

/**
 * 从章节映射表中筛选出所有 leaf chapters
 *
 * @param chapterMap 章节映射表
 * @returns leaf chapter ID 数组
 */
export const getLeafChapterIds = <T extends TreeNode<T>>(chapterMap: Map<string, T>): string[] => {
  const leafIds: string[] = [];
  chapterMap.forEach((chapter, id) => {
    if (isLeafNode(chapter)) {
      leafIds.push(id);
    }
  });
  return leafIds;
};
