/**
 * GlobalOp Reducers 统一导出
 *
 * 管理所有 GlobalOp 相关的状态变更
 */

import { serverLoadingReducers } from './serverLoading';

/**
 * 所有 GlobalOp 相关的 reducers
 */
export const globalOpReducers = {
  // 服务器加载
  ...serverLoadingReducers,
};

// 导出类型
export type { ChapterLoadResult } from './serverLoading';
