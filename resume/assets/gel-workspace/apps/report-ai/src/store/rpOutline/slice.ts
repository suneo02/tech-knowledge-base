/**
 * RPOutline Redux Slice
 *
 * @description RPOutline 模块的 Redux 状态管理
 */

import { createInitialProgressState } from '@/domain/outlineProgress';
import { createSlice } from '@reduxjs/toolkit';
import { allReducers } from './reducers';
import { RPOutlineState } from './types';

/**
 * 创建初始状态
 */
const createInitialState = (): RPOutlineState => ({
  files: [],
  progress: createInitialProgressState(),
  agentMessages: [],
});

/**
 * RPOutline Redux Slice
 */
export const rpOutlineSlice = createSlice({
  name: 'rpOutline',
  initialState: createInitialState(),
  reducers: allReducers,
});

// 导出 actions
export const rpOutlineActions = rpOutlineSlice.actions;

// 导出 reducer
export const rpOutlineReducer = rpOutlineSlice.reducer;
