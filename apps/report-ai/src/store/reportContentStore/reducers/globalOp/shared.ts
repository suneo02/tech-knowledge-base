/**
 * GlobalOp 共享工具函数
 *
 * 提供 GlobalOp 状态设置的通用逻辑
 */

import type { GlobalOperationKind } from '@/types/report';
import type { ReportContentState } from '../../types';

/**
 * 设置 GlobalOp 为指定状态
 */
export function setGlobalOp(
  state: ReportContentState,
  kind: GlobalOperationKind,
  options?: {
    operationId?: string;
    data?: any;
    error?: string | null;
  }
): void {
  state.globalOp = {
    kind,
    startedAt: kind === 'idle' ? null : Date.now(),
    operationId: options?.operationId,
    data: options?.data || null,
    error: options?.error || null,
  };
}

/**
 * 设置 GlobalOp 为 idle
 */
export function setGlobalOpToIdle(state: ReportContentState): void {
  setGlobalOp(state, 'idle');
}

/**
 * 设置 GlobalOp 为 error（保留原有时间戳和 operationId）
 */
export function setGlobalOpToError(state: ReportContentState, error: string): void {
  state.globalOp = {
    kind: 'error',
    startedAt: state.globalOp.startedAt,
    operationId: state.globalOp.operationId,
    data: state.globalOp.data,
    error,
  };
}

/**
 * 设置 GlobalOp 为 server_loading
 */
export function setGlobalOpToServerLoading(state: ReportContentState): void {
  setGlobalOp(state, 'server_loading');
}
