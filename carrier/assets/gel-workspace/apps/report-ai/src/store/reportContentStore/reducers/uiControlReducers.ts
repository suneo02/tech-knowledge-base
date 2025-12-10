/**
 * UI Control Reducers
 *
 * 管理UI控制层操作：
 * - 编辑器状态管理
 * - 全局生成状态
 * - 消息管理
 * - 全局只读状态
 */

import { MessageParsedReportContent } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { PayloadAction } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

export const uiControlReducers = {
  /**
   * 设置消息
   */
  setParsedRPContentMessages: (
    state: ReportContentState,
    action: PayloadAction<MessageInfo<MessageParsedReportContent>[]>
  ) => {
    state.parsedRPContentMessages = action.payload;
  },
};
