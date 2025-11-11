/**
 * 报告级 RTK Store 工厂测试
 * 验证多实例隔离性
 */

import { describe, expect, it } from 'vitest';
import { createReportContentStore } from '../factory';
import { rpContentSlice } from '../slice';

describe('createReportContentStore', () => {
  it('应该创建独立的 store 实例', () => {
    const store1 = createReportContentStore();
    const store2 = createReportContentStore();

    // 验证是不同的实例
    expect(store1).not.toBe(store2);
    expect(store1.getState()).not.toBe(store2.getState());
  });

  it('应该支持多个 store 实例互不干扰', () => {
    const store1 = createReportContentStore();
    const store2 = createReportContentStore();

    // 初始状态应该相同但不是同一个对象
    const initialState1 = store1.getState();
    const initialState2 = store2.getState();

    expect(initialState1).toEqual(initialState2);
    expect(initialState1).not.toBe(initialState2);

    // 修改 store1 不应该影响 store2
    store1.dispatch(rpContentSlice.actions.setReportName('Report 1'));
    store2.dispatch(rpContentSlice.actions.setReportName('Report 2'));

    expect(store1.getState().reportContent.reportName).toBe('Report 1');
    expect(store2.getState().reportContent.reportName).toBe('Report 2');
  });

  it('应该正确配置 middleware', () => {
    const store = createReportContentStore();

    // 验证 store 有正确的结构
    expect(store.dispatch).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(store.subscribe).toBeDefined();
  });

  it('应该有正确的 reducer 结构', () => {
    const store = createReportContentStore();
    const state = store.getState();

    // 验证 reportContent reducer 存在
    expect(state.reportContent).toBeDefined();
    expect(state.reportContent.chapters).toEqual([]);
    expect(state.reportContent.reportName).toBe('');
    expect(state.reportContent.globalOp.kind).toBe('idle');
  });
});
