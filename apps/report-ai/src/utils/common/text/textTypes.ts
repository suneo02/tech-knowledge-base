/**
 * 文本处理类型定义
 */

/**
 * 差异操作类型
 */
export type DiffOperation = 'equal' | 'insert' | 'delete';

/**
 * 文本差异
 */
export interface TextDiff {
  /** 操作类型 */
  operation: DiffOperation;
  /** 文本内容 */
  text: string;
  /** 操作位置（可选） */
  position?: number;
}

/**
 * 文本比较选项
 */
export interface TextComparisonOptions {
  /** 是否忽略空白字符 */
  ignoreWhitespace?: boolean;
  /** 是否忽略大小写 */
  ignoreCase?: boolean;
  /** 最小差异阈值 */
  minDiffThreshold?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
}

/**
 * 文本处理选项
 */
export interface TextProcessingOptions {
  /** 是否保留换行符 */
  preserveLineBreaks?: boolean;
  /** 是否移除HTML标签 */
  stripHtml?: boolean;
  /** 最大长度限制 */
  maxLength?: number;
  /** 截断后缀 */
  truncateSuffix?: string;
}
