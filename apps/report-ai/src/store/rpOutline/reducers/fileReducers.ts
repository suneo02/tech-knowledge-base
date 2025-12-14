/**
 * RPOutline 文件管理 Reducers
 *
 * @description 处理文件列表的增删改查操作
 */

import { RPFileUploaded } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';
import { AddFilePayload, RPOutlineState } from '../types';

export const fileReducers = {
  addFile: (state: RPOutlineState, action: PayloadAction<AddFilePayload>) => {
    const existingIndex = state.files.findIndex((f) => f.fileId === action.payload.file.fileId);
    if (existingIndex >= 0) {
      // 更新现有文件
      state.files[existingIndex] = action.payload.file;
    } else {
      // 添加新文件
      state.files.push(action.payload.file);
    }
  },

  batchAddFiles: (state: RPOutlineState, action: PayloadAction<RPFileUploaded[]>) => {
    action.payload.forEach((filePayload) => {
      const existingIndex = state.files.findIndex((f) => f.fileId === filePayload.fileId);
      if (existingIndex >= 0) {
        // 更新现有文件
        state.files[existingIndex] = filePayload;
      } else {
        // 添加新文件
        state.files.push(filePayload);
      }
    });
  },
};
