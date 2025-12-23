/**
 * 报告内容管理 Store 工厂
 * 每个 ReportEditor 实例使用独立的 store
 *
 * 任务0.1：报告级 RTK Store 工厂 & Provider
 * - 支持同页挂载多份报告，互不串线
 * - 支持独立卸载，不影响其他实例
 */

import { isDev } from '@/utils';
import { configureStore } from '@reduxjs/toolkit';
import { rpContentSlice } from './slice';

/**
 * 创建报告内容管理的独立 store 实例
 *
 * @returns 配置好的 Redux store 实例
 */
export const createReportContentStore = () => {
  return configureStore({
    reducer: {
      reportContent: rpContentSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 忽略这些 action types 的序列化检查
          ignoredActions: ['reportContent/setChapters', 'reportContent/updateChapter'],
        },
      }),
    // 开发环境下启用 Redux DevTools，生产环境下禁用
    devTools: isDev,
  });
};

export type ReportContentStore = ReturnType<typeof createReportContentStore>;
export type ReportContentDispatch = ReportContentStore['dispatch'];
export type ReportContentState = ReturnType<ReportContentStore['getState']>;
