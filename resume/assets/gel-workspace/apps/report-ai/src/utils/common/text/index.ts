/**
 * 文本处理工具函数 - 通用工具集
 *
 * 提供与业务无关的纯文本处理功能
 */

export {
  calculateTextSimilarity,
  cleanWhitespace,
  extractTextFromHtml,
  normalizeText,
  stripHtmlTags,
  truncateText,
} from './textProcessor';

export { calculateDiffSize, diffTexts, formatDiffSummary, hasSignificantDifference, mergeDiffs } from './textDiff';

export type { DiffOperation, TextComparisonOptions, TextDiff, TextProcessingOptions } from './textTypes';
