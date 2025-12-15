/**
 * 章节 ID 映射应用工具
 *
 * @description 将临时 ID 替换为持久化 ID
 * @module chapterId/applyIdMap
 */

import type { EditorFacade } from '../editor/editorFacade';
import { RP_DATA_ATTRIBUTES } from '../foundation';

/** ID 映射应用选项 */
export interface ApplyIdMapOptions {
  /** 是否打印调试信息 */
  debug?: boolean;
}

/** ID 映射应用结果 */
export interface ApplyIdMapResult {
  /** 成功替换的元素数量 */
  replacedCount: number;
  /** 受影响的新 ID 列表 */
  affectedIds: string[];
  /** 未在 DOM 中找到的旧 ID 列表 */
  unmatchedIds: string[];
}

/**
 * 应用章节 ID 映射（临时 ID → 持久化 ID）
 *
 * 使用场景：
 * - 保存成功后，后端返回 ID 映射
 * - 需要将 DOM 中的临时 ID 替换为持久化 ID
 *
 * 核心逻辑：
 * 1. 查找所有带有 data-temp-chapter-id 的元素
 * 2. 根据 idMap 将临时 ID 替换为持久化 ID
 * 3. 移动 ID：从 data-temp-chapter-id 到 data-chapter-id
 * 4. 清理临时标记
 *
 * @param editor - EditorFacade 实例
 * @param idMap - ID 映射表，格式为 { tempId: chapterId }
 * @param options - 应用选项
 * @returns 应用结果统计
 *
 * @example
 * ```typescript
 * const idMap = {
 *   'new-chapter-123': '789',
 *   'new-chapter-456': '790'
 * };
 *
 * const result = applySectionIdMap(editor, idMap);
 * console.log(result.replacedCount); // 2
 * ```
 */
export const applySectionIdMap = (
  editor: EditorFacade,
  idMap: Record<string, string>,
  options: ApplyIdMapOptions = {}
): ApplyIdMapResult => {
  // 检查编辑器和映射表是否有效
  if (!editor.isReady() || !idMap || Object.keys(idMap).length === 0) {
    return { replacedCount: 0, affectedIds: [], unmatchedIds: [] };
  }

  // 获取编辑器 DOM 文档和 body 元素
  const doc = editor.getDocument();
  const body = doc?.body;
  if (!doc || !body) {
    return { replacedCount: 0, affectedIds: [], unmatchedIds: [] };
  }

  // 查找所有带有 temp-chapter-id 的元素（临时章节）
  const elements = Array.from(body.querySelectorAll(`[${RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID}]`));
  let replacedCount = 0;
  const affectedIds = new Set<string>();

  // 初始化未匹配 ID 集合
  const unmatchedIds = new Set<string>(Object.keys(idMap));

  elements.forEach((element) => {
    // 获取临时 ID
    const tempId = element.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID);
    if (!tempId) return;

    // 查找映射表中的新 ID
    const chapterId = idMap[tempId];
    if (!chapterId) return;

    // 移动 ID：从临时字段到持久化字段
    element.setAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID, chapterId);
    element.removeAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID);

    replacedCount += 1;
    affectedIds.add(chapterId);
    unmatchedIds.delete(tempId);
  });

  // 调试输出
  if (options.debug) {
    console.log('[applySectionIdMap] replacedCount:', replacedCount, {
      affectedIds: affectedIds.size,
      unmatchedIds: unmatchedIds.size,
    });
  }

  return {
    replacedCount,
    affectedIds: Array.from(affectedIds),
    unmatchedIds: Array.from(unmatchedIds),
  };
};
