import { createSelector } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

/**
 * 选择章节前端状态映射
 */
export const selectChapterStates = (state: { reportContent: ReportContentState }) => state.reportContent.chapterStates;

/**
 * 选择指定章节的前端状态
 */
export const selectChapterState = (chapterId: string) => (state: { reportContent: ReportContentState }) =>
  state.reportContent.chapterStates[chapterId];

/**
 * 选择章节锁定状态映射
 */
export const selectChapterLockedStates = createSelector([selectChapterStates], (chapterStates) => {
  const lockedStates: Record<string, boolean> = {};
  Object.entries(chapterStates).forEach(([chapterId, state]) => {
    lockedStates[chapterId] = state.locked || false;
  });
  return lockedStates;
});

/**
 * 选择指定章节是否锁定
 */
export const selectIsChapterLocked = (chapterId: string) =>
  createSelector([selectChapterStates], (chapterStates) => {
    return chapterStates[chapterId]?.locked || false;
  });

/**
 * 选择章节 epoch 映射
 */
export const selectChapterEpochs = createSelector([selectChapterStates], (chapterStates) => {
  const epochs: Record<string, number> = {};
  Object.entries(chapterStates).forEach(([chapterId, state]) => {
    if (state.epoch !== undefined) {
      epochs[chapterId] = state.epoch;
    }
  });
  return epochs;
});

/**
 * 选择指定章节的 epoch
 */
export const selectChapterEpoch = (chapterId: string) =>
  createSelector([selectChapterStates], (chapterStates) => {
    return chapterStates[chapterId]?.epoch;
  });
