/**
 * 报告模块共享类型定义
 *
 * @description 提取共享类型，避免 detail.ts 和 outline.ts 之间的循环依赖
 */

/**
 * 报告 ID 标识符
 */
export interface ReportIdIdentifier {
  reportId: string
}
