/**
 * RPOutline 基础状态 Reducers
 *
 * @description 处理基础状态管理和消息同步
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { RPOutlineState } from '../types';

export const baseReducers = {
  // === 批量更新 ===
  batchUpdate: (state: RPOutlineState, action: PayloadAction<Partial<RPOutlineState>>) => {
    Object.assign(state, action.payload);
  },
};
