/**
 * reportEditor 基础层入口
 *
 * 仅暴露与 DOM/章节结构相关的纯函数，禁止 TinyMCE 依赖进入。
 */

// HTML 常量 & 选择器
export { createSelector, RP_CSS_CLASSES, RP_DATA_ATTRIBUTES, RP_DATA_VALUES, RP_SELECTORS } from './constants';

// DOM 属性工具
export { querySelector } from './domAttributes';

// 章节结构工具
export {
  extractHeadingText,
  getContentHtmlAfterHeading,
  getContentNodesAfterHeading,
  getHeadingLevel,
  HEADING_LEVELS,
  HEADING_SELECTOR,
  HEADING_TAG_NAMES,
  type HeadingLevel,
} from './chapterStructure';
