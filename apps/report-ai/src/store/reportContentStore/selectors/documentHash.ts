/**
 * 文档哈希选择器
 *
 * @description 计算文档基线哈希，用于判断文档是否有变更
 * @note 独立模块，避免循环依赖
 */

import { createSelector } from '@reduxjs/toolkit';
import { calculateContentHash } from '../utils/contentHash';
import { selectCanonicalDocHtml } from './composition';

/**
 * 选择基线文档哈希（基于完整文档 HTML）
 */
export const selectBaselineDocHash = createSelector([selectCanonicalDocHtml], (fullHtml) =>
  calculateContentHash(fullHtml.trim())
);
