/**
 * 全文生成状态选择器
 *
 * 管理全文档生成相关的状态和进度
 * 使用 domain 层的工具函数避免重复逻辑
 */

import { calculateQueueProgress, getCurrentChapterId, isFullGenerationOp } from '@/domain/globalOperation';
import { createSelector } from '@reduxjs/toolkit';
import { selectReportContent } from '../base';
import { selectGlobalOp } from './base';

// ==================== 全文生成选择器 ====================

/**
 * 选择全文生成进度
 */
export const selectFullDocGenProgress = createSelector([selectReportContent], (state) => {
  const op = state.globalOp;

  if (!isFullGenerationOp(op)) {
    return {
      currentIndex: 0,
      total: 0,
      completed: 0,
      currentChapterId: null,
      percentage: 0,
    };
  }

  const { queue, currentIndex } = op.data;
  const total = queue.length;
  const completed = currentIndex;
  const percentage = calculateQueueProgress(currentIndex, total);
  const currentChapterId = getCurrentChapterId(queue, currentIndex);

  return {
    currentIndex,
    total,
    completed,
    currentChapterId,
    percentage,
  };
});

/**
 * 选择全文生成队列
 */
export const selectFullDocGenData = createSelector(selectGlobalOp, (op) => {
  return isFullGenerationOp(op) ? op.data : { currentIndex: -1, queue: [] };
});

/**
 * 选择全文生成错误
 */
export const selectFullDocGenError = createSelector(selectGlobalOp, (globalOp) =>
  globalOp.kind === 'error' ? globalOp.error : null
);

/**
 * 判断全文生成是否被中断
 */
export const selectIsGenerationInterrupted = createSelector(selectReportContent, (state) => {
  const { kind, data } = state.globalOp;
  return kind === 'idle' && data?.type === 'full_generation' && data.currentIndex > 0;
});

// ==================== 单章节生成选择器 ====================

/**
 * 选择当前生成的章节 ID
 */
export const selectChapterRegenerationChapterId = createSelector([selectReportContent], (state) => {
  const op = state.globalOp;
  return op.kind === 'chapter_regeneration' && op.data?.type === 'chapter_regeneration' ? op.data.chapterId : null;
});

/**
 * 判断是否正在进行章节重生成
 */
export const selectIsChapterRegenerating = createSelector(
  [selectReportContent],
  (state) => state.globalOp.kind === 'chapter_regeneration'
);

// ==================== 多章节顺序生成选择器 ====================

/**
 * 选择多章节生成进度
 */
export const selectMultiChapterGenerationProgress = createSelector([selectReportContent], (state) => {
  const op = state.globalOp;

  if (op.kind !== 'multi_chapter_generation' || !op.data || op.data.type !== 'multi_chapter_generation') {
    return {
      currentIndex: 0,
      total: 0,
      completed: 0,
      failed: 0,
      currentChapterId: null,
      percentage: 0,
      failedChapters: [],
    };
  }

  const { queue, currentIndex, failedChapters } = op.data;
  const total = queue.length;
  const completed = currentIndex;
  const failed = failedChapters.length;
  const percentage = calculateQueueProgress(currentIndex, total);
  const currentChapterId = getCurrentChapterId(queue, currentIndex);

  return {
    currentIndex,
    total,
    completed,
    failed,
    currentChapterId,
    percentage,
    failedChapters,
  };
});

/**
 * 选择多章节生成队列
 */
export const selectMultiChapterGenerationQueue = createSelector(selectReportContent, (state) => {
  const op = state.globalOp;
  return op.kind === 'multi_chapter_generation' && op.data?.type === 'multi_chapter_generation' ? op.data.queue : [];
});

/**
 * 判断是否正在进行多章节生成
 */
export const selectIsMultiChapterGenerating = createSelector(
  [selectReportContent],
  (state) => state.globalOp.kind === 'multi_chapter_generation'
);

/**
 * 选择多章节生成失败的章节列表
 */
export const selectMultiChapterFailedChapters = createSelector(selectReportContent, (state) => {
  const op = state.globalOp;
  return op.kind === 'multi_chapter_generation' && op.data?.type === 'multi_chapter_generation'
    ? op.data.failedChapters
    : [];
});
