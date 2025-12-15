/**
 * AI 对话配置类型定义
 *
 * 包含 AI 输出内容和技术配置的类型定义
 * 注意：ChatInputContext 已移动到 input.ts
 */

// 导入现有的具体类型定义
import type { WithDPUList, WithRAGList } from 'gel-api'

/**
 * AI 输出内容接口 - 包含 AI 生成的引用和关联数据
 *
 * 设计说明：这些字段是 AI 输出的结果，不属于用户的业务元数据
 */
export interface AIOutputContent extends Partial<WithRAGList>, Partial<WithDPUList> {
  /** 子问题列表 - AI 拆解的子问题 */
  subQuestion?: string[]

  /** 实体信息 - AI 识别的实体 */
  entities?: any[]

  /** 图表数据 - AI 生成的图表 */
  chartData?: any[]

  /** 扩展 AI 输出字段 */
  [key: string]: unknown
}
