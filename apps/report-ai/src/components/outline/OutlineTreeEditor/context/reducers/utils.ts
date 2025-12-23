/**
 * Reducer 工具函数
 *
 * @description 提供 reducer 中使用的辅助函数
 */

import { RPChapter, ReportOutlineData } from 'gel-api';
import { TreePath } from 'gel-util/common';

/**
 * 更新指定路径章节的 ID
 *
 * @param data 大纲数据
 * @param path 章节路径
 * @param newChapterId 新的章节 ID
 * @returns 更新后的大纲数据
 */
export const updateChapterIdAtPath = (
  data: ReportOutlineData,
  path: TreePath,
  newChapterId: number
): ReportOutlineData => {
  const updateChapterInArray = (chapters: RPChapter[], currentPath: number[]): RPChapter[] => {
    if (currentPath.length === 0) return chapters;

    const [index, ...restPath] = currentPath;
    if (index >= chapters.length) return chapters;

    if (restPath.length === 0) {
      // 到达目标章节，更新 ID
      return chapters.map((ch, i) => (i === index ? { ...ch, chapterId: newChapterId } : ch));
    } else {
      // 继续向下递归
      return chapters.map((ch, i) =>
        i === index ? { ...ch, children: updateChapterInArray(ch.children || [], restPath) } : ch
      );
    }
  };

  return {
    ...data,
    chapters: updateChapterInArray(data.chapters, path),
  };
};
