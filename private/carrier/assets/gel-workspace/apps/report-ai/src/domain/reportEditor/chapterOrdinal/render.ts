import type { EditorFacade } from '../editor/editorFacade';
import { RP_DATA_ATTRIBUTES, RP_DATA_VALUES } from '../foundation';

/**
 * 章节序号节点的标准属性
 */
export const CHAPTER_ORDINAL_NODE_ATTRIBUTES = {
  /** 标记为外部渲染节点 */
  [RP_DATA_ATTRIBUTES.GEL_EXTERNAL]: RP_DATA_VALUES.GEL_EXTERNAL_CHAPTER_NUMBER,
  /** 不可编辑（作为原子节点存在，可整体删除） */
  contenteditable: RP_DATA_VALUES.CONTENTEDITABLE_FALSE,
  /** 保持文本不可直接编辑，但允许整体选中/删除 */
  style: 'user-select: none;',
} as const;

/**
 * 章节序号选择器
 *
 * 用于查找所有章节序号外部节点
 */
export const CHAPTER_ORDINAL_SELECTOR = `[${RP_DATA_ATTRIBUTES.GEL_EXTERNAL}="${RP_DATA_VALUES.GEL_EXTERNAL_CHAPTER_NUMBER}"]`;

/**
 * 格式化章节序号（添加后缀点号）
 */
export const formatChapterOrdinal = (hierarchicalNumber: string): string => {
  return `${hierarchicalNumber} `;
};

/**
 * 生成章节序号节点的 HTML 字符串
 */
export const createChapterOrdinalHTML = (hierarchicalNumber: string): string => {
  const attrs = Object.entries(CHAPTER_ORDINAL_NODE_ATTRIBUTES)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  const text = formatChapterOrdinal(hierarchicalNumber);
  return `<span ${attrs}>${text}</span>`;
};

/**
 * 创建章节序号节点的 DOM 元素
 */
export const createChapterOrdinalNode = (editor: EditorFacade, hierarchicalNumber: string): HTMLElement => {
  const span = editor.createElement('span', CHAPTER_ORDINAL_NODE_ATTRIBUTES);
  span.textContent = formatChapterOrdinal(hierarchicalNumber);
  return span;
};
