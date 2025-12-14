/**
 * 服务器加载 Reducers
 *
 * 管理章节加载等服务器操作的状态
 */

import { PayloadAction } from '@reduxjs/toolkit';
import type { RPDetailChapter, RPReferencePriority } from 'gel-api';
import type { ReportContentState } from '../../types';
import { setGlobalOpToError, setGlobalOpToIdle, setGlobalOpToServerLoading } from './shared';

/**
 * 章节加载结果
 */
export interface ChapterLoadResult {
  chapters: RPDetailChapter[];
  reportName: string;
  referencePriority: RPReferencePriority | undefined;
  loadedAt: number;
}

export const serverLoadingReducers = {
  /**
   * 开始章节加载
   */
  startChapterLoading: (state: ReportContentState) => {
    setGlobalOpToServerLoading(state);
  },

  /**
   * 章节加载成功
   */
  chapterLoadingSuccess: (state: ReportContentState, action: PayloadAction<ChapterLoadResult>) => {
    const { chapters, reportName, referencePriority } = action.payload;

    // 更新章节数据（Canonical Layer）
    state.chapters = chapters;
    state.reportInfo = {
      name: reportName,
      referencePriority,
    };

    // 页面加载：直接设置全量初始化任务
    state.hydration.currentTask = {
      type: 'full-init',
      reason: 'page-load',
    };

    // 服务器加载完成 → 回到 idle
    setGlobalOpToIdle(state);
  },

  /**
   * 章节加载失败
   */
  chapterLoadingFailure: (state: ReportContentState, action: PayloadAction<string>) => {
    setGlobalOpToError(state, action.payload);
  },

  /**
   * 重置章节加载状态
   */
  resetChapterLoadingState: (state: ReportContentState) => {
    setGlobalOpToIdle(state);
  },
};
