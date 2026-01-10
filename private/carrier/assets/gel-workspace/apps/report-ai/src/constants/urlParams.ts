/**
 * 报告相关 URL 参数常量配置
 *
 * @description 统一管理报告应用中所有 URL 查询参数，避免硬编码
 * @since 1.0.0
 */

/**
 * 报告 URL 查询参数键名
 */
export const RP_URL_PARAMS = {
  /** 自动生成全文标识 */
  AUTO_GENERATE: 'autoGenerate',
  /** 来源标识（用于埋点） */
  SOURCE: 'source',
} as const;

/**
 * 报告来源标识值
 */
export const RP_SOURCE_VALUES = {
  /** 来自大纲会话 */
  OUTLINE: 'outline',
  /** 来自模板 */
  TEMPLATE: 'template',
} as const;

/**
 * URL 参数类型定义
 */
export type RpUrlParamKey = (typeof RP_URL_PARAMS)[keyof typeof RP_URL_PARAMS];
export type RpSourceValue = (typeof RP_SOURCE_VALUES)[keyof typeof RP_SOURCE_VALUES];
