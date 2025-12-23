/**
 * RPOutline 进度状态选择器
 *
 * @description 进度状态相关的选择器
 */

import { createSelector } from '@reduxjs/toolkit';
import { selectRPOutlineState } from './base';

// === 进度状态选择器 ===
export const selectProgress = createSelector([selectRPOutlineState], (rpOutline) => rpOutline.progress);

export const selectProgressSteps = createSelector([selectProgress], (progress) => progress.steps);

export const selectCurrentStep = createSelector([selectProgress], (progress) => progress.currentStep);

export const selectOverallProgress = createSelector([selectProgress], (progress) => progress.overallProgress);

export const selectIsProgressCompleted = createSelector([selectProgress], (progress) => progress.isCompleted);

export const selectHasProgressFailed = createSelector([selectProgress], (progress) => progress.hasFailed);
