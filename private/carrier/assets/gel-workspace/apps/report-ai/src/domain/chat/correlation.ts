/**
 * 关联ID工具
 */

/**
 * 生成唯一的关联ID，用于追踪章节操作生命周期
 */
export const generateCorrelationId = () => `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * 生成唯一的关联ID（用于文本改写）
 */
export function generateTextRewriteCorrelationId(): string {
  return `text_rewrite_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
