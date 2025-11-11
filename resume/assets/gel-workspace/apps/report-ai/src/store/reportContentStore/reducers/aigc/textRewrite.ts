/**
 * 文本改写 Reducers
 *
 * 使用 globalOp 状态机管理文本改写状态
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 */

import type { SelectionSnapshot } from '@/types/editor';
import { PayloadAction } from '@reduxjs/toolkit';
import type { ReportContentState } from '../../types';
import { GlobalOpHelper } from './shared';

/**
 * 开始文本改写的 payload
 */
export interface StartTextRewritePayload {
  snapshot: SelectionSnapshot;
  correlationId: string;
  chapterId: string;
  taskType: string;
}

export const textRewriteReducers = {
  /**
   * 开始文本改写
   */
  startTextRewrite: (state: ReportContentState, action: PayloadAction<StartTextRewritePayload>) => {
    const { snapshot, correlationId, chapterId, taskType } = action.payload;

    state.globalOp = {
      kind: 'text_rewrite',
      startedAt: Date.now(),
      operationId: correlationId,
      data: {
        type: 'text_rewrite',
        snapshot,
        correlationId,
        chapterId,
        taskType,
      },
      error: null,
    };
  },

  /**
   * 完成文本改写
   */
  completeTextRewrite: (state: ReportContentState) => {
    if (!GlobalOpHelper.validateKind(state, 'text_rewrite')) return;
    GlobalOpHelper.setIdle(state);
  },

  /**
   * 标记文本改写失败
   */
  failTextRewrite: (state: ReportContentState, action: PayloadAction<{ code: string; message: string }>) => {
    if (!GlobalOpHelper.validateKind(state, 'text_rewrite')) return;
    GlobalOpHelper.setError(state, `[${action.payload.code}] ${action.payload.message}`);
  },

  /**
   * 取消文本改写
   */
  cancelTextRewrite: (state: ReportContentState) => {
    if (!GlobalOpHelper.validateKind(state, 'text_rewrite')) return;
    GlobalOpHelper.setIdle(state);
  },

  /**
   * 重置文本改写
   */
  resetTextRewrite: (state: ReportContentState) => {
    const { kind } = state.globalOp;
    if (kind === 'text_rewrite' || kind === 'error') {
      GlobalOpHelper.setIdle(state);
    }
  },
};
