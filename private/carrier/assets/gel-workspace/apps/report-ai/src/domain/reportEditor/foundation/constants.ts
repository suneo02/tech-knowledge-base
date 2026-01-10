/**
 * 编辑器数据属性和选择器常量
 * 用于定义 HTML 元素上的自定义 data 属性和 CSS 选择器
 */

import { convertChapterIdToString } from '@/domain/chapter';
import { SOURCE_MARKER_CONSTANTS } from 'gel-util/common';

export const RP_DATA_ATTRIBUTES = {
  /** 章节 ID（持久化） */
  CHAPTER_ID: 'data-chapter-id',
  /** 临时章节 ID */
  TEMP_CHAPTER_ID: 'data-temp-chapter-id',
  /** 报告标题 */
  REPORT_TITLE: 'data-report-title',
  /** 加载状态 */
  LOADING: 'data-loading',
  /** 加载容器标识 */
  LOADING_CONTAINER: 'data-loading-container',
  /** 占位类型（loading/citation 等） */
  PLACEHOLDER: 'data-placeholder',
  /** 引用占位-计数 */
  CITATION_COUNT: 'data-count',
  /** 外部渲染节点标记（loading/citation/source-marker/ai-action 等） */
  GEL_EXTERNAL: 'data-gel-external',
  // 溯源标记相关属性
  // 注意：SOURCE_ID 和 POSITIONS 与 gel-util/common 的 SOURCE_MARKER_CONSTANTS 保持一致
  /** 溯源标记-源ID（章节内数组索引） - 基础属性 */
  SOURCE_ID: SOURCE_MARKER_CONSTANTS.SOURCE_ID,
  /** 溯源标记-位置信息JSON - 基础属性 */
  POSITIONS: SOURCE_MARKER_CONSTANTS.POSITIONS,
  /** 溯源标记-引用ID（全局唯一） - 报告扩展属性 */
  REF_ID: 'data-ref-id',
  /** 溯源标记-引用类型（dpu/rag/file） - 报告扩展属性 */
  REF_TYPE: 'data-ref-type',
  /** 溯源标记-PDF页码（仅用于 file 类型，同一文件不同引用位置可能有不同页码） - 报告扩展属性 */
  PAGE_NUMBER: 'data-page-number',
  /** TinyMCE-不导出标记 - TinyMCE 特定属性 */
  MCE_BOGUS: 'data-mce-bogus',
} as const;

/**
 * 数据属性值常量
 */
export const RP_DATA_VALUES = {
  /** 加载状态为 true */
  LOADING_TRUE: 'true',
  /** 章节标题为 true */
  CHAPTER_TITLE_TRUE: 'true',
  /** 报告标题为 true */
  REPORT_TITLE_TRUE: 'true',
  /** 占位类型：加载 */
  PLACEHOLDER_LOADING: 'loading',
  /** 角色：引用面板 */
  ROLE_CITATION_PANEL: 'citation-panel',
  // 外部渲染节点类型
  /** 外部渲染类型：溯源标记 */
  GEL_EXTERNAL_SOURCE_MARKER: 'source-marker',
  /** 外部渲染类型：加载占位 */
  GEL_EXTERNAL_LOADING: 'loading',
  /** 外部渲染类型：引用占位 */
  GEL_EXTERNAL_CITATION: 'citation',
  /** 外部渲染类型：AI 操作 */
  GEL_EXTERNAL_AI_ACTION: 'ai-action',
  /** 外部渲染类型：章节编号 */
  GEL_EXTERNAL_CHAPTER_NUMBER: 'chapter-number',
  // TinyMCE 属性值
  /** TinyMCE 不导出标记值 - 完全隐藏（编辑器中不显示，序列化时移除） */
  MCE_BOGUS_ALL: 'all',
  /** TinyMCE 不导出标记值 - 正常显示但不保存（编辑器中显示，序列化时移除）⭐ 章节编号等外部渲染节点应使用此值 */
  MCE_BOGUS_1: '1',
  /** contenteditable false */
  CONTENTEDITABLE_FALSE: 'false',
} as const;

/**
 * CSS 类名常量
 */
export const RP_CSS_CLASSES = {
  /** 溯源标记类名 - 与 gel-util/common SOURCE_MARKER_CONSTANTS.CLASS_NAME 保持一致 */
  SOURCE_MARKER: SOURCE_MARKER_CONSTANTS.CLASS_NAME,
} as const;

/**
 * CSS 选择器常量
 */
export const RP_SELECTORS = {
  /** 查找指定章节 ID 的元素 */
  CHAPTER_BY_ID: (chapterId: string | string) =>
    `[${RP_DATA_ATTRIBUTES.CHAPTER_ID}="${convertChapterIdToString(chapterId)}"]`,
  /** 查找所有溯源标记 */
  SOURCE_MARKERS: `.${RP_CSS_CLASSES.SOURCE_MARKER}`,
} as const;
