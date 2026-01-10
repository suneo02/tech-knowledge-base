/**
 * 章节数据类型转换工具
 *
 * @description
 * 提供章节相关的数据类型转换函数，主要处理 DOM 与业务逻辑之间的类型差异。
 *
 * 核心场景：
 * - DOM 中的 chapter id 是 string 类型（从 data-chapter-id 属性读取）
 * - 业务逻辑和 API 中的 chapter id 是 number 类型
 *
 * @module chapter/transforms/converters
 */

/**
 * 将 DOM 中的 chapter id（string）转换为业务逻辑中的 chapter id（number）
 *
 * @description
 * DOM 属性（如 data-chapter-id）读取的值始终是 string 类型，
 * 但在业务逻辑、API 请求、状态管理中需要使用 number 类型。
 *
 * 转换规则：
 * - 有效数字字符串 → 转换为 number
 * - 空字符串 / undefined / null → 返回 undefined
 * - 无效数字字符串 → 返回 undefined（静默处理，记录警告）
 *
 * @param chapterId - DOM 中读取的 chapter id（string 类型）
 * @returns 转换后的 chapter id（number 类型），无效时返回 undefined
 *
 * @example
 * ```typescript
 * // 从 DOM 读取
 * const domChapterId = element.getAttribute('data-chapter-id'); // "123"
 * const numericId = convertChapterIdToNumber(domChapterId); // 123
 *
 * // 处理空值
 * convertChapterIdToNumber(''); // undefined
 * convertChapterIdToNumber(undefined); // undefined
 *
 * // 处理无效值
 * convertChapterIdToNumber('abc'); // undefined (会记录警告)
 * ```
 */
export function convertChapterIdToNumber(chapterId: string | undefined | null): number | undefined {
  // 处理空值
  if (!chapterId || chapterId.trim() === '') {
    return undefined;
  }

  const trimmedId = chapterId.trim();
  const numericId = Number(trimmedId);

  // 检查是否为有效数字
  if (Number.isNaN(numericId) || !Number.isFinite(numericId)) {
    console.warn(`[convertChapterIdToNumber] Invalid chapter id: "${chapterId}"`);
    return undefined;
  }

  return numericId;
}

/**
 * 将业务逻辑中的 chapter id（number）转换为 DOM 中的 chapter id（string）
 *
 * @description
 * 在设置 DOM 属性（如 data-chapter-id）时，需要将 number 类型转换为 string。
 *
 * 转换规则：
 * - 有效数字 → 转换为字符串
 * - undefined / null → 返回空字符串
 * - NaN / Infinity → 返回空字符串（静默处理，记录警告）
 *
 * @param chapterId - 业务逻辑中的 chapter id（number 类型）
 * @returns 转换后的 chapter id（string 类型），无效时返回空字符串
 *
 * @example
 * ```typescript
 * // 设置 DOM 属性
 * const chapterId = 123;
 * element.setAttribute('data-chapter-id', convertChapterIdToString(chapterId)); // "123"
 *
 * // 处理空值
 * convertChapterIdToString(undefined); // ""
 * convertChapterIdToString(null); // ""
 * ```
 */
export function convertChapterIdToString(chapterId: number | undefined | null | string): string {
  // 处理空值
  if (chapterId === undefined || chapterId === null) {
    return '';
  }

  if (typeof chapterId === 'string') {
    return chapterId;
  }

  // 检查是否为有效数字
  if (Number.isNaN(chapterId) || !Number.isFinite(chapterId)) {
    console.warn(`[convertChapterIdToString] Invalid chapter id: ${chapterId}`);
    return '';
  }

  return String(chapterId);
}
