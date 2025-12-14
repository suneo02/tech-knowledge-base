/**
 * Hydration Reducers (重构后 - 最精简版)
 *
 * @description
 * Redux 决策层：根据事件设置 currentTask（告诉 Hook 要做什么）
 * Hook 执行层：读取 currentTask，执行编辑器操作
 *
 * 核心改进：
 * - Redux 负责决策（设置任务类型）
 * - Hook 负责执行（读取任务，操作编辑器）
 * - 移除不必要的 epoch 跟踪
 */

import { HydrationTask } from '@/types/report';
import { PayloadAction } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

export const hydrationReducers = {
  /**
   * 设置注水任务（Redux 决策）
   *
   * @description 根据不同事件设置对应的注水任务
   * Hook 层会读取此任务并执行
   */
  setHydrationTask: (state: ReportContentState, action: PayloadAction<HydrationTask>) => {
    state.hydration.currentTask = action.payload;
  },

  /**
   * 完成注水任务（Hook 执行后回写）
   *
   * @description Hook 执行成功后调用，重置任务为 idle
   */
  completeHydrationTask: (
    state: ReportContentState,
    action: PayloadAction<{
      taskType: HydrationTask['type'];
    }>
  ) => {
    // 重置任务为 idle
    state.hydration.currentTask = { type: 'idle' };

    // 如果是初始化任务，清空 Draft 并设置编辑器状态
    if (action.payload.taskType === 'full-init' || action.payload.taskType === 'full-rehydrate') {
      state.documentDraft = null;
    }
  },
};
