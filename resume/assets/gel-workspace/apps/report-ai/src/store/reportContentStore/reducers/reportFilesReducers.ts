import { FileStatusUpdate } from '@/hooks/useFileStatusPolling';
import { PayloadAction } from '@reduxjs/toolkit';
import { RPFile } from 'gel-api';
import { ReportContentState } from '../types';

/**
 * Report Files Reducers
 *
 * 统一管理报告级文件相关的所有操作：
 * - 报告级文件列表管理（非章节内引用的文件也在此）
 * - 文件解析状态管理
 */
export const reportFilesReducers = {
  // ==================== 文件列表管理 ====================

  /** 设置报告级文件列表（覆盖） */
  setReportFiles: (state: ReportContentState, action: PayloadAction<RPFile[]>) => {
    state.reportFiles = action.payload || [];
  },

  /** 清空报告级文件列表 */
  clearReportFiles: (state: ReportContentState) => {
    state.reportFiles = [];
  },

  // ==================== 文件状态管理 ====================

  /**
   * 更新单个文件状态
   *
   * 直接更新 reportFiles 中对应文件的状态
   */
  updateFileStatus: (state: ReportContentState, action: PayloadAction<FileStatusUpdate>) => {
    const { fileId, status } = action.payload;
    const file = state.reportFiles.find((f) => f.fileId === fileId);
    if (file) {
      file.status = status;
    }
  },

  /**
   * 批量更新文件状态
   *
   * 直接更新 reportFiles 中对应文件的状态
   */
  batchUpdateFileStatus: (state: ReportContentState, action: PayloadAction<FileStatusUpdate[]>) => {
    action.payload.forEach(({ fileId, status }) => {
      const file = state.reportFiles.find((f) => f.fileId === fileId);
      if (file) {
        file.status = status;
      }
    });
  },
};
