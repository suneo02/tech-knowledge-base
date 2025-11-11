/**
 * 章节悬停检测 DOM 操作工具函数
 *
 * @description 为章节标题悬停检测提供 DOM 操作和查询的业务逻辑支撑
 * 专注于元素识别、位置计算、标题查找等核心业务逻辑
 */

import { RP_DATA_ATTRIBUTES } from '@/domain/reportEditor/foundation';
import type { ChapterHoverInfo } from '../useChapterHoverWithInit';
import {
  findElementByPosition,
  findParentElement,
  getElementVerticalCenter,
  getElementViewportPosition,
} from './editorDomUtils';

/**
 * 常量定义
 */
export const MAX_PARENT_SEARCH_DEPTH = 10;
export const CHAPTER_HEADING_TAG_PATTERN = /^H[1-6]$/i;
export const CHAPTER_HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';

/**
 * 章节标题元素识别
 */

/**
 * 判断元素是否为携带章节 ID 的标题标签
 * 避免跨 iframe instanceof 失效问题
 */
export const isChapterHeadingElement = (element: Element | null): element is HTMLElement => {
  if (!element) {
    return false;
  }

  const tagName = element.tagName?.toUpperCase?.();
  if (!tagName || !CHAPTER_HEADING_TAG_PATTERN.test(tagName)) {
    return false;
  }

  return element.hasAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID);
};

/**
 * 从任意元素查找最近的章节标题
 * 先使用 closest API，失败后再逐级向上查找
 */
export const findNearestChapterHeading = (element: Element | null): HTMLElement | null => {
  if (!element) {
    return null;
  }

  // 直接命中标题元素
  if (isChapterHeadingElement(element)) {
    return element as HTMLElement;
  }

  // 使用 closest API 快速查找
  if (typeof element.closest === 'function') {
    const closestHeading = element.closest<HTMLElement>(CHAPTER_HEADING_SELECTOR);
    if (closestHeading && isChapterHeadingElement(closestHeading)) {
      return closestHeading;
    }
  }

  // 使用统一的父元素查找工具
  return findParentElement(element, isChapterHeadingElement, MAX_PARENT_SEARCH_DEPTH) as HTMLElement | null;
};

/**
 * 通过鼠标位置查找对应的章节标题元素
 * 使用 elementFromPoint API 精确定位
 */
export const findChapterHeadingByPosition = (doc: Document, x: number, y: number): HTMLElement | null => {
  const element = findElementByPosition(doc, x, y);
  return element ? findNearestChapterHeading(element) : null;
};

/**
 * 章节悬停位置计算
 */

/**
 * 计算章节标题的悬停位置信息
 * 包含 iframe 偏移处理，用于按钮定位
 */
export const calculateChapterHoverPosition = (headingElement: HTMLElement): ChapterHoverInfo | null => {
  if (!isChapterHeadingElement(headingElement)) {
    return null;
  }

  const chapterId = headingElement.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID);
  if (!chapterId) {
    return null;
  }

  // 使用统一的位置计算工具
  const position = getElementViewportPosition(headingElement);
  const verticalCenter = getElementVerticalCenter(headingElement);

  return {
    chapterId,
    element: headingElement,
    position: {
      top: verticalCenter,
      left: position.left,
    },
  };
};
