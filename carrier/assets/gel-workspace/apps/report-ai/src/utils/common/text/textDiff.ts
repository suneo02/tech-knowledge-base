/**
 * 文本差异检测工具函数
 *
 * 使用成熟的fast-diff库进行文本差异检测
 */

import fastDiff from 'fast-diff';
import { normalizeText } from './textProcessor';
import { DiffOperation, TextComparisonOptions, TextDiff } from './textTypes';

/**
 * 比较两个文本的差异
 *
 * @param text1 - 第一个文本
 * @param text2 - 第二个文本
 * @param options - 比较选项
 * @returns 差异列表
 */
export const diffTexts = (text1: string, text2: string, options: TextComparisonOptions = {}): TextDiff[] => {
  try {
    // 预处理文本
    const processedText1 = preprocessText(text1, options);
    const processedText2 = preprocessText(text2, options);

    // 使用fast-diff进行差异检测
    const diffs = fastDiff(processedText1, processedText2);

    // 转换为我们的格式
    return diffs.map(([operation, text]) => ({
      operation: mapFastDiffOperation(operation),
      text,
    }));
  } catch (error) {
    console.error('Error diffing texts:', error);
    return [];
  }
};

/**
 * 计算差异大小
 *
 * @param diffs - 差异列表
 * @returns 差异字符数
 */
export const calculateDiffSize = (diffs: TextDiff[]): number => {
  try {
    return diffs.reduce((size, diff) => {
      // 只计算插入和删除的字符数
      return diff.operation !== 'equal' ? size + diff.text.length : size;
    }, 0);
  } catch (error) {
    console.error('Error calculating diff size:', error);
    return 0;
  }
};

/**
 * 合并相邻的相同操作
 *
 * @param diffs - 差异列表
 * @returns 合并后的差异列表
 */
export const mergeDiffs = (diffs: TextDiff[]): TextDiff[] => {
  try {
    if (diffs.length === 0) return [];

    const merged: TextDiff[] = [];
    let current = { ...diffs[0] };

    for (let i = 1; i < diffs.length; i++) {
      const diff = diffs[i];

      if (diff.operation === current.operation) {
        // 合并相同操作
        current.text += diff.text;
      } else {
        // 不同操作，保存当前并开始新的
        merged.push(current);
        current = { ...diff };
      }
    }

    merged.push(current);
    return merged;
  } catch (error) {
    console.error('Error merging diffs:', error);
    return diffs;
  }
};

/**
 * 格式化差异摘要
 *
 * @param diffs - 差异列表
 * @returns 可读的差异摘要
 */
export const formatDiffSummary = (diffs: TextDiff[]): string => {
  try {
    const stats = {
      equal: 0,
      insert: 0,
      delete: 0,
    };

    for (const diff of diffs) {
      stats[diff.operation] += diff.text.length;
    }

    if (stats.insert === 0 && stats.delete === 0) {
      return '无变更';
    }

    const parts: string[] = [];
    if (stats.insert > 0) {
      parts.push(`新增 ${stats.insert} 个字符`);
    }
    if (stats.delete > 0) {
      parts.push(`删除 ${stats.delete} 个字符`);
    }

    return parts.join('，');
  } catch (error) {
    console.error('Error formatting diff summary:', error);
    return '差异摘要生成失败';
  }
};

/**
 * 检查两个文本是否有实质性差异
 *
 * @param text1 - 第一个文本
 * @param text2 - 第二个文本
 * @param options - 比较选项
 * @returns 是否有差异
 */
export const hasSignificantDifference = (
  text1: string,
  text2: string,
  options: TextComparisonOptions = {}
): boolean => {
  try {
    const diffs = diffTexts(text1, text2, options);
    const diffSize = calculateDiffSize(diffs);

    const threshold = options.minDiffThreshold || 1;
    return diffSize >= threshold;
  } catch (error) {
    console.error('Error checking significant difference:', error);
    return false;
  }
};

// ============ 辅助函数 ============

/**
 * 预处理文本
 */
const preprocessText = (text: string, options: TextComparisonOptions): string => {
  try {
    if (!text) return '';

    let processed = text;

    if (options.ignoreWhitespace) {
      processed = normalizeText(processed, { preserveLineBreaks: false });
    }

    if (options.ignoreCase) {
      processed = processed.toLowerCase();
    }

    return processed;
  } catch (error) {
    console.error('Error preprocessing text:', error);
    return text;
  }
};

/**
 * 映射fast-diff操作到我们的操作类型
 */
const mapFastDiffOperation = (operation: number): DiffOperation => {
  switch (operation) {
    case 0: // fastDiff.EQUAL
      return 'equal';
    case 1: // fastDiff.INSERT
      return 'insert';
    case -1: // fastDiff.DELETE
      return 'delete';
    default:
      return 'equal';
  }
};
