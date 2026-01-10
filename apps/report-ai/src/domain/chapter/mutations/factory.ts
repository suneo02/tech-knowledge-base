/**
 * 章节工厂函数
 *
 * 职责：
 * - 创建新章节
 * - 生成临时 ID
 *
 * 特点：
 * - 自动标记 isTemporary: true
 * - 生成唯一的临时 ID
 * - 支持自定义初始值
 *
 * @module chapter/mutations/factory
 */

import type { RPChapter, RPChapterSavePayloadTemp } from 'gel-api';

/**
 * 生成章节唯一ID
 */
export const generateChapterTempId = (serial: string | number = Math.random().toString(36).slice(2, 8)): string => {
  return `new-chapter-${Date.now()}-${serial}`;
};

/**
 * 创建新的章节
 *
 * @param title - 章节标题
 * @param writingThought - 编写思路
 * @param children - 子章节
 * @param keywords - 关键词
 * @returns 新创建的章节，自动标记 isTemporary: true
 */
export const createChapter = (
  title: string = '',
  writingThought: string = '',
  children: RPChapter[] = [],
  keywords: string[] = []
): RPChapterSavePayloadTemp => {
  return {
    tempId: generateChapterTempId(),
    isTemporary: true,
    title,
    writingThought,
    keywords,
    children,
  };
};
