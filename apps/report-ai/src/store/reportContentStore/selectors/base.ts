/**
 * 基础状态选择器
 *
 * 提供对基础 Redux 状态的直接访问
 */

import { createSelector } from '@reduxjs/toolkit';
import type { ReportContentState } from '../types';

// 根选择器
export const selectReportContent = (state: { reportContent: ReportContentState }) => state.reportContent;

// 基础状态选择器
export const selectReportId = createSelector(selectReportContent, (state) => state.reportId);

export const selectReportName = createSelector(selectReportContent, (state) => state.reportInfo?.name);

export const selectReferencePriority = createSelector(
  selectReportContent,
  (state) => state.reportInfo?.referencePriority
);
export const selectChapters = createSelector(selectReportContent, (state) => state.chapters);

export const selectHydration = createSelector(selectReportContent, (state) => state.hydration);

/**
 * 当前注水任务（Redux 决策输出）
 */
export const selectCurrentHydrationTask = createSelector(selectHydration, (hydration) => hydration.currentTask);

/**
 * 当前活跃的章节操作
 */
export const selectHydrationActiveOperations = createSelector(
  selectHydration,
  (hydration) => hydration.activeOperations
);

/**
 * 最近一次章节请求记录
 */
export const selectLatestRequestedOperations = createSelector(
  selectHydration,
  (hydration) => hydration.latestRequestedOperations || {}
);

// 报告状态别名（兼容性）

/** 报告级文件列表（统一来源于 Redux） */
export const selectReportFiles = createSelector(selectReportContent, (state) => state.reportFiles || []);
