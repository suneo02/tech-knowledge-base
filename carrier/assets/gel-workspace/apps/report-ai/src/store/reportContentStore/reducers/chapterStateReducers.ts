/**
 * 章节前端状态管理 Reducers
 *
 * 管理与章节相关的前端状态，与数据模型分离：
 * - 章节锁定状态
 * - 版本控制和冲突检测
 * - 重注水控制的 epoch
 */

import { ChapterFrontendState } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

export const chapterStateReducers = {
  /**
   * 设置章节锁定状态
   */
  setChapterLocked: (state: ReportContentState, action: PayloadAction<{ chapterId: string; locked: boolean }>) => {
    const { chapterId, locked } = action.payload;

    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }

    state.chapterStates[chapterId].locked = locked;
  },

  /**
   * 更新章节 epoch（重注水控制）
   */
  updateChapterEpoch: (state: ReportContentState, action: PayloadAction<{ chapterId: string; epoch: number }>) => {
    const { chapterId, epoch } = action.payload;

    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }

    state.chapterStates[chapterId].epoch = epoch;
  },

  /**
   * 更新章节版本（乐观锁）
   */
  updateChapterVersion: (state: ReportContentState, action: PayloadAction<{ chapterId: string; version: number }>) => {
    const { chapterId, version } = action.payload;

    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }

    state.chapterStates[chapterId].version = version;
  },

  /**
   * 更新章节最后修改时间
   */
  updateChapterLastModified: (
    state: ReportContentState,
    action: PayloadAction<{ chapterId: string; lastModified?: number }>
  ) => {
    const { chapterId, lastModified = Date.now() } = action.payload;

    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }

    state.chapterStates[chapterId].lastModified = lastModified;
  },

  /**
   * 批量设置章节状态
   */
  setChapterStates: (state: ReportContentState, action: PayloadAction<Record<string, ChapterFrontendState>>) => {
    state.chapterStates = action.payload;
  },

  /**
   * 清除章节状态
   */
  clearChapterState: (state: ReportContentState, action: PayloadAction<string>) => {
    const chapterId = action.payload;
    delete state.chapterStates[chapterId];
  },

  /**
   * 清除所有章节状态
   */
  clearAllChapterStates: (state: ReportContentState) => {
    state.chapterStates = {};
  },
};
