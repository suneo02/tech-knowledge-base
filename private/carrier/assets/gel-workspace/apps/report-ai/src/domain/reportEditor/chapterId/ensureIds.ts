/**
 * 章节 ID 确保工具
 *
 * @description 为编辑器中的标题节点补齐或纠正章节 ID
 * @module chapterId/ensureIds
 */

import { generateChapterTempId } from '@/domain/chapter';
import type { EditorFacade } from '../editor/editorFacade';
import { getHeadingLevel, HEADING_SELECTOR, RP_DATA_ATTRIBUTES } from '../foundation';

/** 章节 ID 同步选项 */
export interface EnsureSectionIdsOptions {
  /** 是否打印调试信息 */
  debug?: boolean;
}

/** 章节 ID 同步结果 */
export interface EnsureSectionIdsResult {
  /** 扫描到的标题总数 */
  totalHeadings: number;
  /** 新分配 ID 的标题数量 */
  assignedCount: number;
  /** 本次操作涉及的所有章节 ID 列表 */
  touchedIds: string[];
}

/**
 * 获取标题的章节 ID（持久化或临时）
 */
const getHeadingIds = (heading: Element) => {
  const chapterId = heading.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID)?.trim() || '';
  const tempId = heading.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID)?.trim() || '';
  return { chapterId, tempId };
};

/**
 * 为标题分配新的临时 ID
 */
const assignTempId = (heading: Element): string => {
  const tempId = generateChapterTempId();
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID, tempId);
  return tempId;
};

/**
 * 确保所有章节标题都有有效的章节 ID
 *
 * 核心逻辑：
 * 1. 扫描编辑器中的所有标题元素（h1-h6）
 * 2. 为每个标题补齐章节 ID
 *
 * 处理策略：
 * - 如果标题已有 ID（持久化或临时）：保留原 ID
 * - 如果标题无 ID：生成新的临时 ID
 *
 * 设计原则：
 * - 只有标题元素有章节 ID，容器不需要 ID
 * - 临时章节使用 data-temp-chapter-id
 * - 持久化章节使用 data-chapter-id
 * - 章节编号基于标题层级自动计算，与 ID 无关
 *
 * @param editor - EditorFacade 实例
 * @param options - 同步选项
 * @returns 同步结果统计
 */
export const ensureSectionIds = (
  editor: EditorFacade,
  options: EnsureSectionIdsOptions = {}
): EnsureSectionIdsResult => {
  // 检查编辑器是否就绪
  if (!editor.isReady()) {
    return { totalHeadings: 0, assignedCount: 0, touchedIds: [] };
  }

  // 获取编辑器 DOM 文档和 body 元素
  const doc = editor.getDocument();
  const body = doc?.body;
  if (!doc || !body) {
    return { totalHeadings: 0, assignedCount: 0, touchedIds: [] };
  }

  // 查找所有标题元素
  const headings = Array.from(body.querySelectorAll(HEADING_SELECTOR));
  let assignedCount = 0;
  const touchedIds = new Set<string>();

  headings.forEach((heading) => {
    // 获取标题层级
    const level = getHeadingLevel(heading);
    if (level === 0) return;

    // 获取当前 ID
    const { chapterId, tempId } = getHeadingIds(heading);

    // 策略：如果标题无 ID，生成新的临时 ID
    if (!chapterId && !tempId) {
      const newTempId = assignTempId(heading);
      assignedCount += 1;
      touchedIds.add(newTempId);
    } else {
      // 记录已有的章节 ID
      const effectiveId = chapterId || tempId;
      if (effectiveId) {
        touchedIds.add(effectiveId);
      }
    }
  });

  // 调试输出
  if (options.debug) {
    console.log('[ensureSectionIds] headings:', headings.length, {
      assignedCount,
      touchedIds: touchedIds.size,
    });
  }

  return {
    totalHeadings: headings.length,
    assignedCount,
    touchedIds: Array.from(touchedIds),
  };
};
