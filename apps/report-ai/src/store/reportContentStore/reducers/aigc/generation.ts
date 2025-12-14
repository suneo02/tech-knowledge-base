/**
 * AIGC 生成 Reducers
 *
 * 管理 AI 生成相关操作：
 * - 全文生成
 * - 多章节顺序生成
 *
 * @see {@link ../../../../docs/RPDetail/ContentManagement/full-generation-flow.md | 全文生成流程}
 * @see {@link ../../../../docs/specs/multi-chapter-sequential-aigc/spec-core-v1.md | 多章节顺序生成}
 */

import { PayloadAction } from '@reduxjs/toolkit';
import type { ReportContentState } from '../../types';
import { BatchChapterGenHelper, ChapterOperationHelper, GlobalOpHelper } from './shared';

// ==================== 全文生成 ====================

export const fullGenerationReducers = {
  /**
   * 开始全文生成
   */
  startFullDocumentGeneration: (state: ReportContentState, action: PayloadAction<{ chapterIds: string[] }>) => {
    const { chapterIds } = action.payload;

    state.globalOp = {
      kind: 'full_generation',
      startedAt: Date.now(),
      operationId: undefined,
      data: {
        type: 'full_generation',
        queue: chapterIds,
        currentIndex: 0,
      },
      error: null,
    };
  },

  /**
   * 推进到下一章节
   */
  progressToNextChapter: (state: ReportContentState) => {
    if (!GlobalOpHelper.validate(state, 'full_generation', 'full_generation')) return;
    BatchChapterGenHelper.progressToNext(state);
  },

  /**
   * 完成全文生成
   */
  completeFullDocumentGeneration: (
    state: ReportContentState,
    action: PayloadAction<{ success: boolean; error?: string }>
  ) => {
    if (!GlobalOpHelper.validate(state, 'full_generation', 'full_generation')) return;

    const queueData = GlobalOpHelper.getQueueData(state);
    if (queueData) {
      BatchChapterGenHelper.complete(state, queueData.queue, action.payload);
    }
  },

  /**
   * 中断全文生成
   */
  interruptFullDocumentGeneration: (state: ReportContentState) => {
    if (!GlobalOpHelper.validate(state, 'full_generation', 'full_generation')) return;
    // 中断时保留数据，只改变 kind
    state.globalOp.kind = 'idle';
  },

  /**
   * 恢复全文生成
   */
  resumeFullDocumentGeneration: (state: ReportContentState) => {
    const { kind, data } = state.globalOp;
    if (kind !== 'idle' || !data || data.type !== 'full_generation') return;

    state.globalOp.kind = 'full_generation';
    state.globalOp.startedAt = Date.now();
  },

  /**
   * 重置全文生成
   */
  resetFullDocumentGeneration: (state: ReportContentState) => {
    BatchChapterGenHelper.resetFromGlobalOp(state, 'full_generation');
  },

  /**
   * 设置全文生成错误
   */
  setFullDocumentGenerationError: (state: ReportContentState, action: PayloadAction<string>) => {
    if (!GlobalOpHelper.validate(state, 'full_generation', 'full_generation')) return;

    const queueData = GlobalOpHelper.getQueueData(state);
    if (queueData) {
      ChapterOperationHelper.cleanupMany(state, queueData.queue);
      GlobalOpHelper.setError(state, action.payload);
    }
  },
};

// ==================== 多章节顺序生成 ====================

export const multiChapterGenerationReducers = {
  /**
   * 开始多章节顺序生成
   */
  startMultiChapterGeneration: (state: ReportContentState, action: PayloadAction<{ chapterIds: string[] }>) => {
    const { chapterIds } = action.payload;

    state.globalOp = {
      kind: 'multi_chapter_generation',
      startedAt: Date.now(),
      operationId: undefined,
      data: {
        type: 'multi_chapter_generation',
        queue: chapterIds,
        currentIndex: 0,
        failedChapters: [],
      },
      error: null,
    };
  },

  /**
   * 推进多章节生成到下一章节
   */
  progressMultiChapterToNext: (state: ReportContentState) => {
    if (!GlobalOpHelper.validate(state, 'multi_chapter_generation', 'multi_chapter_generation')) return;
    BatchChapterGenHelper.progressToNext(state);
  },

  /**
   * 取消多章节生成
   */
  cancelMultiChapterGeneration: (state: ReportContentState) => {
    if (!GlobalOpHelper.validate(state, 'multi_chapter_generation', 'multi_chapter_generation')) return;

    const queueData = GlobalOpHelper.getQueueData(state);
    if (queueData) {
      BatchChapterGenHelper.cancel(state, queueData.queue);
    }
  },

  /**
   * 标记章节失败
   */
  markMultiChapterFailed: (state: ReportContentState, action: PayloadAction<{ chapterId: string }>) => {
    if (!GlobalOpHelper.validate(state, 'multi_chapter_generation', 'multi_chapter_generation')) return;

    const data = state.globalOp.data;
    if (data && data.type === 'multi_chapter_generation') {
      const { chapterId } = action.payload;
      if (!data.failedChapters.includes(chapterId)) {
        data.failedChapters.push(chapterId);
      }
    }
  },

  /**
   * 完成多章节生成
   */
  completeMultiChapterGeneration: (
    state: ReportContentState,
    action: PayloadAction<{ success: boolean; error?: string }>
  ) => {
    if (!GlobalOpHelper.validate(state, 'multi_chapter_generation', 'multi_chapter_generation')) return;

    const queueData = GlobalOpHelper.getQueueData(state);
    if (queueData) {
      BatchChapterGenHelper.complete(state, queueData.queue, action.payload);
    }
  },

  /**
   * 重置多章节生成
   */
  resetMultiChapterGeneration: (state: ReportContentState) => {
    BatchChapterGenHelper.resetFromGlobalOp(state, 'multi_chapter_generation');
  },
};
