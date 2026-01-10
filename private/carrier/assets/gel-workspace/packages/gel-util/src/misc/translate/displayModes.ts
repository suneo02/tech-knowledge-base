/**
 * 全局显示模式
 * - 模式：
 *   - 'origin' 仅原始（所有位置）
 *   - 'only-data' 主要位置允许翻译（官方/TRANS/AI），其余位置仅原始
 */
export type DisplayMode = 'origin' | 'only-data'

export const DEFAULT_DISPLAY_MODE: DisplayMode = 'only-data'

/**
 * 是否允许在当前位置/模式下使用 AI 翻译
 * 三类主要位置（搜索结果、详情顶部卡片、图谱中心节点）
 */
export const shouldAllowAIForMain = (mode: DisplayMode): boolean => {
  return mode === 'only-data'
}
