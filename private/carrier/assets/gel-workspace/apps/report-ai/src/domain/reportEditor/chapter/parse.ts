/**
 * 章节内容解析
 *
 * @description 封装从章节 HTML 片段中提取标题、正文的逻辑。
 * 输入为章节 HTML 字符串，输出结构化内容，供文档解析层使用。
 */

import { parseHtml } from '@/utils/common';
import { CHAPTER_ORDINAL_SELECTOR } from '../chapterOrdinal';
import { extractHeadingText, getContentHtmlAfterHeading } from '../foundation';

/**
 * 提取章节标题（移除序号）
 * @deprecated 请使用 foundation/chapterStructure.ts 中的 extractHeadingText
 */
const extractChapterTitle = (heading: Element): string => {
  return extractHeadingText(heading, CHAPTER_ORDINAL_SELECTOR);
};

export interface ParsedChapterContent {
  title: string;
  content: string;
}

/**
 * 解析单个章节片段
 *
 * @description
 * 传入章节 HTML 字符串，统一输出标题和正文。
 * - 标题会移除章节序号等装饰节点
 * - 内容从标题后的节点收集，直到遇到同级或更高级标题
 *
 * @param html - 章节 HTML 字符串
 * @returns 解析后的章节内容
 */
export const parseChapterContent = (html: string): ParsedChapterContent => {
  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    return { title: '', content: '' };
  }

  const parseResult = parseHtml(html);
  if (!parseResult.success) {
    console.warn('Failed to parse chapter HTML:', parseResult.error);
    return { title: '', content: '' };
  }

  const document = parseResult.document;

  // 查找章节标题（任何 h 标签）
  const heading = document.querySelector('h1, h2, h3, h4, h5, h6');

  if (!heading) {
    return { title: '', content: '' };
  }

  // 1. 解析标题文本，剥离序号或辅助标记
  const title = extractChapterTitle(heading);
  // 2. 提取正文 HTML，从标题后收集到下一个同级或更高级标题
  const content = getContentHtmlAfterHeading(heading);

  return { title, content };
};
