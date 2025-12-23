/**
 * RPOutline Reducers 统一导出
 *
 * @description 合并所有模块化的 reducers
 */

import { baseReducers } from './baseReducers';
import { fileReducers } from './fileReducers';

/**
 * 合并所有 reducer 模块
 */
export const allReducers = {
  // 基础状态管理
  ...baseReducers,

  // 文件管理
  ...fileReducers,
};
