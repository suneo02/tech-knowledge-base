/**
 * RPOutline 基础状态 Reducers
 *
 * @description 处理基础状态管理和消息同步
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { RPOutlineState, SetRawMessagesPayload } from '../types';

export const baseReducers = {
  // === 原始消息管理 ===
  setAgentMessages: (state: RPOutlineState, action: PayloadAction<SetRawMessagesPayload>) => {
    state.agentMessages = action.payload.rawMessages;
  },

  // === 批量更新 ===
  batchUpdate: (state: RPOutlineState, action: PayloadAction<Partial<RPOutlineState>>) => {
    Object.assign(state, action.payload);
  },
};
