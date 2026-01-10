/**
 * DOM 属性与选择器工具
 *
 * 职责：
 * - 提供统一的数据属性写入/读取接口
 * - 提供常用的查询选择器封装
 * - 依赖纯 DOM API，方便在 TinyMCE 之外的环境复用
 */

import { RP_DATA_ATTRIBUTES, RP_SELECTORS } from './constants';

/**
 * DOM 查询辅助函数
 */
export const querySelector = {
  /**
   * 查找章节元素
   * 支持持久化章节（chapterId）和临时章节（tempId）
   *
   * @param container - 查询容器
   * @param chapterId - 章节 ID（可能是 chapterId 或 tempId）
   * @returns 章节元素，未找到返回 null
   */
  chapterById: (container: Document | Element, chapterId: string | number): Element | null => {
    const id = String(chapterId);

    // 优先查找持久化章节
    const persistentChapter = container.querySelector(RP_SELECTORS.CHAPTER_BY_ID(id));
    if (persistentChapter) {
      return persistentChapter;
    }

    // 如果未找到，尝试查找临时章节
    const tempChapter = container.querySelector(`[${RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID}="${id}"]`);
    return tempChapter;
  },
};
