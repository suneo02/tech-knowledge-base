/**
 * 单章节重生成 Reducers
 *
 * 管理单章节重生成操作（包含首次生成和重新生成）
 *
 * @see {@link ../../../../docs/specs/single-chapter-aigc-implementation/spec-design-v1.md | 单章节 AIGC 方案设计}
 */

import { PayloadAction } from '@reduxjs/toolkit';
import type { ReportContentState } from '../../types';
import { ChapterOperationHelper, GlobalOpHelper, SingleChapterOpHelper } from './shared';

export const chapterRegenerationReducers = {
  /**
   * 取消单章节生成
   */
  cancelChapterRegeneration: (state: ReportContentState) => {
    if (!GlobalOpHelper.validate(state, 'chapter_regeneration', 'chapter_regeneration')) return;

    const data = state.globalOp.data;
    if (data && data.type === 'chapter_regeneration') {
      const { chapterId, correlationId } = data;
      SingleChapterOpHelper.cancel(state, chapterId, correlationId);
    }
  },

  /**
   * 设置单章节生成错误
   */
  setChapterRegenerationError: (
    state: ReportContentState,
    action: PayloadAction<{ code: string; message: string }>
  ) => {
    if (!GlobalOpHelper.validate(state, 'chapter_regeneration', 'chapter_regeneration')) return;

    const data = state.globalOp.data;
    if (data && data.type === 'chapter_regeneration') {
      const { chapterId, correlationId } = data;

      // 清理章节操作
      ChapterOperationHelper.cleanup(state, chapterId);

      // 标记操作失败
      if (state.hydration.activeOperations[correlationId]) {
        state.hydration.activeOperations[correlationId].status = 'failed';
      }

      GlobalOpHelper.setError(state, action.payload.message);
    }
  },

  /**
   * 重置单章节生成
   */
  resetChapterRegeneration: (state: ReportContentState) => {
    const { kind, data } = state.globalOp;

    // 如果正在进行单章节生成，清理资源
    if (kind === 'chapter_regeneration' && data?.type === 'chapter_regeneration') {
      const { chapterId, correlationId } = data;

      ChapterOperationHelper.cleanup(state, chapterId);

      // 清理 activeOperation
      if (state.hydration.activeOperations[correlationId]) {
        delete state.hydration.activeOperations[correlationId];
      }
    }

    // 清除 globalOp（如果是单章节生成或错误状态）
    if (kind === 'chapter_regeneration' || (kind === 'error' && data?.type === 'chapter_regeneration')) {
      GlobalOpHelper.setIdle(state);
    }
  },
};
