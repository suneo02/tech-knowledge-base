import { RPFileStatus } from 'gel-api';

/**
 * 文件状态判断工具函数
 *
 * @description
 * 提供文件状态的业务逻辑判断，主要用于状态轮询和界面展示控制。
 * 配合 useFileStatusPolling Hook 使用，判断是否需要继续轮询文件状态。
 *
 * @see [../../../docs/shared/file-status-polling.md](../../../docs/shared/file-status-polling.md) - 文件状态轮询设计文档
 * @see [../../../hooks/useFileStatusPolling.ts](../../../hooks/useFileStatusPolling.ts) - 智能状态轮询实现
 * @see [../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md](../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 */

/**
 * 判断文件状态是否可能继续变化（用于轮询/更新）
 * - 可变状态：UPLOADED、OUTLINE_PARSED
 * - 不可变状态：其余状态都是解析结束，可能是成功或失败
 *
 * @param status - 文件状态
 * @returns 是否为可变状态（需要轮询）
 */
export function isReportFileStatusMutable(status?: RPFileStatus): boolean {
  if (status === undefined) return false;
  return status === RPFileStatus.UPLOADED || status === RPFileStatus.OUTLINE_PARSED;
}

/**
 * 判断是否解析成功（终止态）
 *
 * @param status - 文件状态
 * @returns 是否为完成状态
 */
export function isReportFileStatusFinished(status?: RPFileStatus): boolean {
  return status === RPFileStatus.FINISHED;
}
