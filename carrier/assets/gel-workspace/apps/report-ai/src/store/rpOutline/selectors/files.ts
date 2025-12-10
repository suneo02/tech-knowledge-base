/**
 * RPOutline 文件管理选择器
 *
 * @description 文件列表相关的状态选择器
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../type';
import { selectRPOutlineState } from './base';

// === 文件管理选择器 ===
export const selectFiles = createSelector([selectRPOutlineState], (rpOutline) => rpOutline.files);

export const selectFileCount = createSelector([selectFiles], (files) => files.length);

export const selectFileById = createSelector(
  [selectFiles, (_state: RootState, fileId: string) => fileId],
  (files, fileId) => files.find((f) => f.fileId === fileId)
);
