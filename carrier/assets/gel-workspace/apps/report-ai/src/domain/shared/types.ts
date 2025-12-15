/**
 * 报告AI领域层共享类型定义
 *
 * @description 定义报告AI业务领域各模块共同使用的基础类型和接口
 */

// ==================== 报告AI业务操作类型 ====================

/**
 * 报告AI业务操作结果类型
 * @description 用于统一报告生成、章节管理、内容处理等业务操作的返回结果格式
 */
export interface ReportOperationResult<T = any> {
  /** 操作是否成功 */
  success: boolean;
  /** 操作结果数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
}

// ==================== 报告业务统计信息 ====================

/**
 * 报告业务统计信息基础接口
 * @description 用于报告生成、章节管理等业务场景的统计数据
 */
export interface ReportBusinessStats {
  /** 总数量 */
  totalCount: number;
  /** 最大层级深度（用于章节层级统计） */
  maxDepth: number;
  /** 各层级的数量统计（层级 -> 数量） */
  levelCounts: Record<number, number>;
}
