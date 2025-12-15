/**
 * RPOutline 基础选择器
 *
 * @description 基础状态选择器和通用选择器
 */

import { hasOutlineByAgentMessages } from '@/domain/chat/outline';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../type';

// === 基础选择器 ===
export const selectRPOutlineState = (state: RootState) => state.rpOutline;

// === 原始消息选择器 ===
export const selectRPOutlineAgentMessages = createSelector(
  [selectRPOutlineState],
  (rpOutline) => rpOutline.agentMessages
);

// === 大纲状态选择器（衍生状态）===
export const selectHasOutline = createSelector([selectRPOutlineAgentMessages], (parsedMessages) =>
  hasOutlineByAgentMessages(parsedMessages)
);
