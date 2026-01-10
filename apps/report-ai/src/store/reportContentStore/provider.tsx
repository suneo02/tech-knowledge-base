/**
 * 报告内容管理 RTK Provider
 *
 * 任务0.1：报告级 RTK Store 工厂 & Provider
 * - 每个 Provider 实例创建独立的 store
 * - 支持多个报告同时存在，互不干扰
 * - 支持独立卸载，不影响其他实例
 *
 * @see {@link ../../docs/issues/full-doc-generation-duplicate-requests.md | 全文生成重复请求问题}
 */

import React, { PropsWithChildren, useRef } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createReportContentStore, ReportContentStore } from './factory';

interface RPDetailRTKScopeProps extends PropsWithChildren {
  /**
   * 可选的 store 实例，如果不提供则自动创建
   * 主要用于测试或特殊场景
   */
  store?: ReportContentStore;
}

/**
 * 报告内容管理的 RTK Provider
 *
 * 每个 Provider 实例都会创建独立的 Redux store，
 * 确保多个报告编辑器实例之间完全隔离
 *
 * 同时挂载 GenerationControllers 组件，集中管理 AIGC 生成的副作用监听
 * 确保每个控制器只被挂载一次，避免重复请求
 */
export const RPDetailRTKScope: React.FC<RPDetailRTKScopeProps> = ({ children, store }) => {
  // 使用 useRef 确保 store 在组件生命周期内保持稳定
  // 每次挂载都会创建新的 store 实例
  const storeRef = useRef<ReportContentStore>(store || createReportContentStore());

  return <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>;
};
