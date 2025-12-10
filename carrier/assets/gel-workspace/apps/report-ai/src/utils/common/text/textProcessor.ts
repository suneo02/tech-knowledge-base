/**
 * 文本处理工具函数
 *
 * 提供通用的文本处理功能，与业务逻辑无关
 */

import { TextProcessingOptions } from './textTypes';

/**
 * 清理空白字符
 *
 * @param text - 要处理的文本
 * @param preserveLineBreaks - 是否保留换行符
 * @returns 清理后的文本
 */
export const cleanWhitespace = (text: string, preserveLineBreaks = false): string => {
  try {
    if (!text || typeof text !== 'string') {
      return '';
    }

    if (preserveLineBreaks) {
      // 保留换行符，只合并其他空白字符
      return text
        .replace(/[^\S\n]+/g, ' ')
        .replace(/\n\s+/g, '\n')
        .trim();
    } else {
      // 合并所有空白字符为单个空格
      return text.replace(/\s+/g, ' ').trim();
    }
  } catch (error) {
    console.error('Error cleaning whitespace:', error);
    return text;
  }
};

/**
 * 移除HTML标签
 *
 * @param html - HTML字符串
 * @returns 纯文本内容
 */
export const stripHtmlTags = (html: string): string => {
  try {
    if (!html || typeof html !== 'string') {
      return '';
    }

    // 移除HTML标签，保留内容
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签及内容
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // 移除style标签及内容
      .replace(/<[^>]*>/g, '') // 移除所有HTML标签
      .replace(/&nbsp;/g, ' ') // 转换HTML实体
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  } catch (error) {
    console.error('Error stripping HTML tags:', error);
    return html;
  }
};

/**
 * 计算文本相似度（简单实现）
 *
 * @param text1 - 第一个文本
 * @param text2 - 第二个文本
 * @returns 相似度（0-1之间）
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  try {
    if (!text1 && !text2) return 1;
    if (!text1 || !text2) return 0;
    if (text1 === text2) return 1;

    // 使用简单的编辑距离算法
    const len1 = text1.length;
    const len2 = text2.length;
    const matrix = Array(len2 + 1)
      .fill(null)
      .map(() => Array(len1 + 1).fill(null));

    for (let i = 0; i <= len1; i++) {
      matrix[0][i] = i;
    }
    for (let j = 0; j <= len2; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = text1[i - 1] === text2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - distance) / maxLen;
  } catch (error) {
    console.error('Error calculating text similarity:', error);
    return 0;
  }
};

/**
 * 截断文本
 *
 * @param text - 要截断的文本
 * @param maxLength - 最大长度
 * @param suffix - 截断后缀
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  try {
    if (!text || typeof text !== 'string') {
      return '';
    }

    if (text.length <= maxLength) {
      return text;
    }

    const truncatedLength = maxLength - suffix.length;
    if (truncatedLength <= 0) {
      return suffix.substring(0, maxLength);
    }

    return text.substring(0, truncatedLength) + suffix;
  } catch (error) {
    console.error('Error truncating text:', error);
    return text;
  }
};

/**
 * 标准化文本
 *
 * @param text - 要标准化的文本
 * @param options - 处理选项
 * @returns 标准化后的文本
 */
export const normalizeText = (text: string, options: TextProcessingOptions = {}): string => {
  try {
    if (!text || typeof text !== 'string') {
      return '';
    }

    let result = text;

    // 移除HTML标签
    if (options.stripHtml) {
      result = stripHtmlTags(result);
    }

    // 清理空白字符
    result = cleanWhitespace(result, options.preserveLineBreaks);

    // 截断文本
    if (options.maxLength && result.length > options.maxLength) {
      result = truncateText(result, options.maxLength, options.truncateSuffix);
    }

    return result;
  } catch (error) {
    console.error('Error normalizing text:', error);
    return text;
  }
};

/**
 * 从HTML中提取文本内容
 *
 * @param html - HTML字符串
 * @param options - 处理选项
 * @returns 提取的文本内容
 */
export const extractTextFromHtml = (html: string, options: TextProcessingOptions = {}): string => {
  try {
    const mergedOptions: TextProcessingOptions = {
      stripHtml: true,
      preserveLineBreaks: false,
      ...options,
    };

    return normalizeText(html, mergedOptions);
  } catch (error) {
    console.error('Error extracting text from HTML:', error);
    return '';
  }
};
