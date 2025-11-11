/**
 * 文档解析模块
 *
 * @description 提供完整文档的 HTML 解析能力，输出结构化的章节树（节点包含标题与正文）。
 * @module document/parse
 */

import { generateChapterTempId } from '@/domain/chapter';
import { parseHtml } from '@/utils/common';
import { RPChapterPayloadTempIdentifier, RPChapterPayloadTempIdIdentifier } from 'gel-api';
import {
  extractHeadingText,
  getContentHtmlAfterHeading,
  getHeadingLevel,
  HEADING_SELECTOR,
  RP_DATA_ATTRIBUTES,
  RP_DATA_VALUES,
} from '../foundation';

interface RPChapterIdIdentifier {
  chapterId?: string;
}

type DebugLog = (message: string, context?: Record<string, unknown>) => void;

const noopLog: DebugLog = () => {};

const createDebugLogger = (enabled?: boolean): DebugLog => {
  if (!enabled) return noopLog;
  return (message, context = {}) => {
    console.log(`[documentParse] ${message}`, context);
  };
};

interface ChapterSegment
  extends RPChapterPayloadTempIdentifier,
    RPChapterPayloadTempIdIdentifier,
    Partial<RPChapterIdIdentifier> {
  /** 提取后的纯文本标题 */
  title: string;
  /** 正文 HTML（不包含标题） */
  content: string;
  /** 标题层级（h1 → 1 ... h6 → 6） */
  level: number;
  /** 完整章节 HTML，用于兼容旧逻辑与 diff */
  fullHtml?: string;
}

interface ChapterNode {
  /** 当前节点的标题层级（用于确定父子关系） */
  level: number;
  /** 章节内容实体 */
  chapter: DocumentChapterNode;
  /** 子章节集合 */
  children: ChapterNode[];
}

/**
 * 章节解析选项
 */
export interface DocumentChapterParseOptions {
  /** 调试模式 */
  debug?: boolean;
}

/**
 * 文档章节节点
 *
 * 注意：此接口用于编辑器解析，ID 类型为 string（从 DOM 属性读取）
 * 与 RPChapterSavePayload 不同（chapterId 为 number）
 */
export interface DocumentChapterNode
  extends RPChapterPayloadTempIdentifier,
    RPChapterPayloadTempIdIdentifier,
    Partial<RPChapterIdIdentifier> {
  /** 章节标题 */
  title: string;
  /** 章节内容 */
  content: string;
  /** 完整 HTML（可选） */
  fullHtml?: string;
  /** 子章节 */
  children?: DocumentChapterNode[];
}

/**
 * 章节树解析结果
 */
export interface DocumentChapterTreeResult {
  chapters: DocumentChapterNode[];
  warnings: string[];
}

const removeReportTitleNodes = (document: Document) => {
  document
    .querySelectorAll(`[${RP_DATA_ATTRIBUTES.REPORT_TITLE}="${RP_DATA_VALUES.REPORT_TITLE_TRUE}"]`)
    .forEach((node) => node.remove());
};

const collectChapterSegments = (document: Document, log: DebugLog): ChapterSegment[] => {
  // 1. 先移除报告标题等非章节节点，确保不会被当成章节处理
  removeReportTitleNodes(document);

  // 2. 基于 heading 顺序遍历文档，按层级动态拼装章节片段
  const headings = Array.from(document.querySelectorAll(HEADING_SELECTOR));
  const segments: ChapterSegment[] = [];
  let tempSerial = 0;

  headings.forEach((heading, index) => {
    const level = getHeadingLevel(heading);
    if (level === 0) return;

    // 2.1 优先读取持久化 ID
    const chapterId = heading.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID)?.trim() ?? '';

    // 2.2 检查是否为临时章节（读取 data-temp-chapter-id）
    let tempId = heading.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID)?.trim() ?? '';
    let isTemporary = !!tempId;

    // 2.3 兼容旧逻辑：如果没有 tempId 但也没有 chapterId，生成新的临时 ID
    if (!isTemporary && !chapterId) {
      tempId = generateChapterTempId(tempSerial);
      isTemporary = true;
      tempSerial += 1;
    }

    // 2.4 使用 tempId 或 chapterId 作为标识
    const effectiveId = tempId || chapterId;

    if (!effectiveId) {
      return;
    }

    // 2.3 提取章节内容：从当前 heading 到下一个同级或更高级 heading 之间的所有内容
    const range = document.createRange();
    range.setStartBefore(heading);

    // 查找下一个同级或更高级的标题
    let nextChapterHeading: Element | null = null;
    for (let i = index + 1; i < headings.length; i++) {
      const candidate = headings[i];
      const candidateLevel = getHeadingLevel(candidate);

      if (candidateLevel <= level) {
        nextChapterHeading = candidate;
        break;
      }
    }

    if (nextChapterHeading) {
      // 设置结束位置为下一个章节标题之前
      range.setEndBefore(nextChapterHeading);
    } else {
      // 如果是最后一个章节，提取到文档末尾
      const body = document.body;
      if (body && body.lastChild) {
        range.setEndAfter(body.lastChild);
      } else {
        range.setEndAfter(heading);
      }
    }

    // 2.4 克隆范围内的内容
    const fragment = range.cloneContents();
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(fragment);
    const chapterHtml = tempContainer.innerHTML;

    // 2.5 提取标题文本（移除序号）
    const title = extractHeadingText(
      heading,
      `[${RP_DATA_ATTRIBUTES.GEL_EXTERNAL}="${RP_DATA_VALUES.GEL_EXTERNAL_CHAPTER_NUMBER}"]`
    );

    // 2.6 提取正文内容（复用 chapterStructure 的工具函数）
    // getContentHtmlAfterHeading 会自动处理：从标题后收集内容，直到遇到任意级别的下一个标题
    const content = getContentHtmlAfterHeading(heading);

    if (isTemporary) {
      log('detected temporary chapter', { title, level, tempId });
    }

    segments.push({
      chapterId: isTemporary ? undefined : chapterId,
      tempId: isTemporary ? tempId : undefined,
      isTemporary,
      title,
      content,
      level,
      fullHtml: chapterHtml,
    });
  });

  return segments;
};

const buildChapterTree = (segments: ChapterSegment[]): DocumentChapterNode[] => {
  if (segments.length === 0) return [];

  const roots: ChapterNode[] = [];
  const stack: ChapterNode[] = [];

  const pushNode = (node: ChapterNode) => {
    // 1. 维护一个栈，根据 heading 层级决定父子关系
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  };

  segments.forEach((segment) => {
    const chapter: DocumentChapterNode = {
      chapterId: segment.chapterId,
      title: segment.title,
      content: segment.content,
      isTemporary: segment.isTemporary,
      ...(segment.tempId ? { tempId: segment.tempId } : {}),
      ...(segment.fullHtml ? { fullHtml: segment.fullHtml } : {}),
    };

    const node: ChapterNode = {
      level: segment.level,
      chapter,
      children: [],
    };

    pushNode(node);
  });

  const toChapterNode = (node: ChapterNode): DocumentChapterNode => {
    // 2. 递归收敛树结构，剥离内部辅助字段
    if (node.children.length === 0) {
      return node.chapter;
    }

    return {
      ...node.chapter,
      children: node.children.map(toChapterNode),
    };
  };

  return roots.map(toChapterNode);
};

/**
 * 将文档级 HTML 解析为章节树
 *
 * @description
 * 1. 使用 DOMParser 解析完整 HTML
 * 2. 收集标题节点，组装章节片段（自动补全临时章节标记）
 * 3. 按标题层级构建章节树，并返回结构化结果
 */
export const parseDocumentChapterTree = (
  html: string,
  options: DocumentChapterParseOptions = {}
): DocumentChapterTreeResult => {
  const { debug } = options;
  const log = createDebugLogger(debug);

  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    throw new Error('Invalid HTML input: HTML must be a non-empty string');
  }

  const parseResult = parseHtml(html, { debug });
  if (!parseResult.success) {
    throw new Error(parseResult.error ?? 'HTML parsing failed');
  }

  const segments = collectChapterSegments(parseResult.document, log);
  log('collected chapter segments', { count: segments.length });

  const chapters = buildChapterTree(segments);
  log('built chapter tree', { rootCount: chapters.length });

  return {
    chapters,
    warnings: parseResult.warnings,
  };
};
