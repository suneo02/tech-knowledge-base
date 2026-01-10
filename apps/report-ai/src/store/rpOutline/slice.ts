/**
 * RPOutline Redux Slice
 *
 * @description RPOutline 模块的 Redux 状态管理
 */

import { createSlice } from '@reduxjs/toolkit';
import { allReducers } from './reducers';
import { RPOutlineState } from './types';

/**
 * 创建初始状态
 */
const createInitialState = (): RPOutlineState => ({
  files: [],
});

/**
 * RPOutline Redux Slice
 */
export const rpOutlineSlice = createSlice({
  name: 'rpOutline',
  initialState: createInitialState(),
  reducers: {
    ...allReducers,
    reset: () => createInitialState(),
  },
});

// 导出 actions
export const rpOutlineActions = rpOutlineSlice.actions;

// 导出 reducer
export const rpOutlineReducer = rpOutlineSlice.reducer;
