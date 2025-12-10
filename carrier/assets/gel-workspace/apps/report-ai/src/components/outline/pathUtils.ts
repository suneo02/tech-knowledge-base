/**
 * 大纲路径工具函数
 *
 * @description 提供大纲项目路径相关的工具函数
 */

import { TreePath } from 'gel-util/common';

/**
 * 将大纲项目路径转换为字符串键
 *
 * @description 用于在状态管理中作为 Map/Set 的键值
 * @param path 大纲项目路径
 * @returns 路径字符串键，格式为 "0-1-2"
 *
 * @example
 * ```ts
 * createPathKey([0, 1, 2]) // "0-1-2"
 * createPathKey([0]) // "0"
 * createPathKey([]) // ""
 * ```
 */
export const createPathKey = (path: TreePath): string => {
  return path.join('-');
};
