/**
 * 报告生成进度计算工具
 *
 * 职责：
 * - 计算报告生成进度
 * - 处理报告生成进度相关的状态转换
 * - 提供报告生成进度计算相关的纯函数工具
 */

/**
 * 报告生成进度信息接口
 */
export interface ReportGenerationProgressInfo {
  /** 当前索引 */
  currentIndex: number;
  /** 已完成数量 */
  completed: number;
  /** 总数量 */
  total: number;
  /** 完成百分比 */
  percentage: number;
  /** 当前章节ID */
  currentChapterId?: string;
}

/**
 * 检查是否为最后一个报告章节
 *
 * @param currentIndex 当前索引
 * @param totalLength 总长度
 * @returns 是否为最后一个
 *
 * @example
 * ```typescript
 * const isLast = isLastReportChapter(4, 5) // true
 * const isNotLast = isLastReportChapter(3, 5) // false
 * ```
 */
export const isLastReportChapter = (currentIndex: number, totalLength: number): boolean => {
  return currentIndex === totalLength - 1;
};

/**
 * 计算报告生成进度回调参数
 *
 * @param progress 进度信息
 * @returns 进度回调参数
 *
 * @example
 * ```typescript
 * const callbackParams = calculateReportGenerationProgressCallback(progress)
 * // { current: 3, total: 5 }
 * ```
 */
export const calculateReportGenerationProgressCallback = (progress: ReportGenerationProgressInfo) => {
  return {
    current: progress.currentIndex + 1,
    total: progress.total,
  };
};
