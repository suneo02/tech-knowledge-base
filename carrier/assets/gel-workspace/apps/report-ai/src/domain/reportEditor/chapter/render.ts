/**
 * 章节渲染模块
 *
 * 职责：
 * - 生成章节 HTML 结构（标题、内容容器、章节容器）
 * - 渲染章节内容（Markdown/HTML → HTML + 溯源标记）
 * - 组装完整的章节 HTML
 *
 * 设计原则：
 * - 纯函数设计，无副作用
 * - 单一职责，每个函数只做一件事
 * - 自底向上组合，从小到大构建 HTML
 *
 * @see apps/report-ai/docs/RPDetail/RPEditor/rendering-and-presentation-guide.md
 */

import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { md } from '@/libs/markdown';
import { MessageParsedReportContent, RPChapterEnriched } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { ChatEntityRecognize, ChatTraceItem, RPDetailChapter, RPFileTraced, WithDPUList, WithRAGList } from 'gel-api';
import { formatAIAnswerWithEntities } from 'gel-util/common';
import { createChapterOrdinalHTML } from '../chapterOrdinal';
import { appendSourceMarkers, generateSourceMarkersHtml } from '../chapterRef/render';
import { RP_CSS_CLASSES, RP_DATA_ATTRIBUTES, RP_DATA_VALUES } from '../foundation';

// ============================================================================
// 第一层：HTML 结构生成（原子函数）
// ============================================================================

/**
 * 生成章节标题 HTML
 *
 * @param title 章节标题文本
 * @param level 标题层级（1-6）
 * @param chapterId 章节 ID
 * @param hierarchicalNumber 层级编号（如 "1.2.3"）
 * @returns 标题 HTML 字符串
 */
export const createChapterTitleHtml = (
  title: string,
  level: number = 1,
  chapterId?: string,
  hierarchicalNumber?: string
): string => {
  if (!title) return '';

  const numberPrefix = hierarchicalNumber ? createChapterOrdinalHTML(hierarchicalNumber) : '';
  const chapterIdAttr = chapterId ? ` ${RP_DATA_ATTRIBUTES.CHAPTER_ID}="${chapterId}"` : '';
  return `<h${level}${chapterIdAttr}>${numberPrefix}${title}</h${level}>`;
};

// ============================================================================
// 第二层：HTML 组装
// ============================================================================

/**
 * 组装章节 HTML 的参数
 */
export interface AssembleChapterHtmlOptions {
  /** 章节标题 */
  title: string;
  /** 章节内容（已渲染的 HTML） */
  content: string;
  /** 标题层级（1-6） */
  level?: number;
  /** 章节 ID */
  chapterId?: string;
  /** 层级编号（如 "1.2.3"） */
  hierarchicalNumber?: string;
}

/**
 * 组装完整的章节 HTML
 *
 * 将标题和内容组装成完整的章节结构（不再使用容器包裹）：
 * - 标题包含 data-chapter-id 属性用于标识章节
 * - 内容直接跟在标题后面，不使用容器包裹
 *
 * @param options 组装参数
 * @returns 完整的章节 HTML
 *
 * @example
 * ```typescript
 * // 完整章节结构
 * const html = assembleChapterHtml({
 *   title: '第一章',
 *   content: '<p>章节内容</p>',
 *   level: 1,
 *   chapterId: '123',
 *   hierarchicalNumber: '1'
 * });
 * // 输出: <h1 data-chapter-id="123">1 第一章</h1><p>章节内容</p>
 * ```
 */
export const assembleChapterHtml = (options: AssembleChapterHtmlOptions): string => {
  const { title, content, level = 1, chapterId, hierarchicalNumber } = options;

  const titleHtml = createChapterTitleHtml(title, level, chapterId, hierarchicalNumber);

  return `${titleHtml}\n${content}`;
};

// ============================================================================
// 第三层：内容处理工具
// ============================================================================

/**
 * 规范化章节内容：将标题转换为加粗段落
 *
 * 原因：章节已有自己的标题层级（h1-h6），内容中的标题会造成结构混乱
 *
 * @param html HTML 内容
 * @returns 规范化后的 HTML（h1-h6 → p > strong）
 */
const normalizeContentHeadings = (html: string): string => {
  if (!html) return html;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.innerHTML = heading.innerHTML;
    p.appendChild(strong);
    heading.replaceWith(p);
  });

  return tempDiv.innerHTML;
};

/**
 * 溯源数据接口
 */
interface SourceData extends Partial<WithDPUList>, Partial<WithRAGList> {
  traceContent?: ChatTraceItem[];
  entity?: ChatEntityRecognize[];
  files?: RPFileTraced[];
  referenceOrdinalMap?: ReportReferenceOrdinalMap;
}

/**
 * 渲染 Markdown 内容为 HTML（含溯源标记）
 *
 * 处理流程：
 * 1. 实体识别格式化
 * 2. Markdown → HTML
 * 3. 规范化标题
 * 4. 添加溯源标记
 *
 * @param markdown Markdown 内容
 * @param sourceData 溯源数据
 * @returns 渲染后的 HTML（含溯源标记）
 */
const renderMarkdownWithSources = (markdown: string, sourceData: SourceData): string => {
  const { entity, traceContent, dpuList, ragList, files, referenceOrdinalMap } = sourceData;

  // 1. 实体识别格式化
  const formatted = formatAIAnswerWithEntities({
    answers: markdown,
    entity: entity || [],
  });

  // 2. Markdown → HTML
  let html = md.render(formatted);

  // 3. 规范化标题
  html = normalizeContentHeadings(html);

  // 4. 生成并添加溯源标记
  const sourceMarkersHtml = generateSourceMarkersHtml(
    traceContent,
    dpuList || [],
    ragList || [],
    files || [],
    referenceOrdinalMap
  );

  return appendSourceMarkers(html, sourceMarkersHtml);
};

/**
 * 渲染 HTML 内容（含溯源标记）
 *
 * 处理流程：
 * 1. 规范化标题
 * 2. 添加溯源标记
 *
 * @param html HTML 内容
 * @param sourceData 溯源数据
 * @returns 渲染后的 HTML（含溯源标记）
 */
const renderHtmlWithSources = (html: string, sourceData: SourceData): string => {
  const { traceContent, dpuList, ragList, files, referenceOrdinalMap } = sourceData;

  // 1. 规范化标题
  let normalized = normalizeContentHeadings(html);

  // 2. 生成并添加溯源标记
  const sourceMarkersHtml = generateSourceMarkersHtml(
    traceContent,
    dpuList || [],
    ragList || [],
    files || [],
    referenceOrdinalMap
  );

  return appendSourceMarkers(normalized, sourceMarkersHtml);
};

// ============================================================================
// 第四层：内容渲染（对外接口）
// ============================================================================

/**
 * 从 AI 消息渲染章节内容
 *
 * @param message AI 消息数据
 * @param chapter 章节数据（提供溯源信息）
 * @param referenceOrdinalMap 全局引用序号映射
 * @returns 渲染后的 HTML 内容（含溯源标记）
 */
export const renderContentFromMessage = (
  message: MessageInfo<MessageParsedReportContent> | undefined,
  chapter?: RPDetailChapter,
  referenceOrdinalMap?: ReportReferenceOrdinalMap
): string => {
  if (!message?.message) return '';

  if (message.message.role === 'aiReportContent') {
    return renderMarkdownWithSources(message.message.content, {
      dpuList: chapter?.refData,
      ragList: chapter?.refSuggest,
      files: chapter?.files,
      referenceOrdinalMap,
    });
  }

  console.error('[renderContentFromMessage] Invalid message role:', message.message.role);
  return '';
};

// ============================================================================
// 加载状态 HTML 生成
// ============================================================================

/**
 * 生成加载状态 HTML
 *
 * @param status 加载状态
 * @returns 加载状态 HTML
 */
export const generateLoadingHTML = (status: 'not_started' | 'pending' | 'receiving' | 'finish'): string => {
  switch (status) {
    case 'pending':
      return `<div ${RP_DATA_ATTRIBUTES.LOADING}="${RP_DATA_VALUES.LOADING_TRUE}" class="${RP_CSS_CLASSES.LOADING_CONTAINER} ${RP_CSS_CLASSES.LOADING_PENDING} ${RP_CSS_CLASSES.LOADING_FADE_IN}">
  <div class="${RP_CSS_CLASSES.LOADING_INDICATOR}"><div class="${RP_CSS_CLASSES.LOADING_SPINNER}"></div><span class="${RP_CSS_CLASSES.LOADING_TEXT}">正在生成内容...</span></div>
</div>`;
    case 'receiving':
      return `<div ${RP_DATA_ATTRIBUTES.LOADING}="${RP_DATA_VALUES.LOADING_TRUE}" class="${RP_CSS_CLASSES.LOADING_CONTAINER} ${RP_CSS_CLASSES.LOADING_RECEIVING}">
  <div class="${RP_CSS_CLASSES.LOADING_INDICATOR}"><div class="${RP_CSS_CLASSES.LOADING_SPINNER}"></div><span class="${RP_CSS_CLASSES.LOADING_TEXT}">正在生成内容...</span></div>
</div>`;
    default:
      return '';
  }
};

/**
 * 从章节数据渲染内容
 *
 * 支持两种数据源：
 * 1. AI 消息（优先）
 * 2. 章节存储的内容（Markdown 或 HTML）
 *
 * @param chapter 章节数据
 * @param message AI 消息（可选）
 * @param referenceOrdinalMap 全局引用序号映射
 * @returns 渲染后的 HTML 内容（含溯源标记）
 */
export const renderContentFromChapter = (
  chapter: RPDetailChapter,
  message?: MessageInfo<MessageParsedReportContent>,
  referenceOrdinalMap?: ReportReferenceOrdinalMap
): string => {
  // 优先使用消息数据
  if (message) {
    return renderContentFromMessage(message, chapter, referenceOrdinalMap);
  }

  // 使用章节存储的内容
  if (!chapter.content) return '';

  const sourceData: SourceData = {
    traceContent: chapter.traceContent,
    dpuList: chapter.refData,
    ragList: chapter.refSuggest,
    files: chapter.files,
    referenceOrdinalMap,
  };

  if (chapter.contentType === 'html') {
    return renderHtmlWithSources(chapter.content, sourceData);
  }

  // 默认为 Markdown
  return renderMarkdownWithSources(chapter.content, sourceData);
};

// ============================================================================
// 第五层：完整章节渲染（对外接口）
// ============================================================================

/**
 * 渲染完整章节的参数
 */
export interface RenderChapterOptions {
  /** 章节数据 */
  chapter: RPChapterEnriched;
  /** 全局引用序号映射 */
  referenceOrdinalMap?: ReportReferenceOrdinalMap;
}

/**
 * 渲染完整的章节 HTML
 *
 * 包含完整的章节结构：
 * - 章节容器（data-section-id）
 * - 章节标题（h1-h6 + 层级编号）
 * - 内容容器（data-section-content）
 *
 * @param options 渲染参数
 * @returns 完整的章节 HTML
 *
 * @example
 * ```typescript
 * const html = renderChapter({
 *   chapter,
 *   levelMap,
 *   pathMap,
 *   referenceOrdinalMap,
 * });
 * ```
 */
export const renderChapter = (options: RenderChapterOptions): string => {
  const { chapter, referenceOrdinalMap } = options;
  const chapterId = String(chapter.chapterId);

  // 1. 渲染内容
  const content = renderContentFromChapter(chapter, undefined, referenceOrdinalMap);

  // 4. 组装完整章节 HTML
  return assembleChapterHtml({
    title: chapter.title || '',
    content,
    level: chapter.level,
    chapterId,
    hierarchicalNumber: chapter.hierarchicalNumber,
  });
};
