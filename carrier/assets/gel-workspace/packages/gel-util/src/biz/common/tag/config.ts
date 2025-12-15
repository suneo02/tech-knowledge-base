import { TagsModule } from './module'
import { TagColors, TagSizes, TagTypes } from './type'

/**
 * 基础配置类型
 */
type ConfigBase = {
  color: TagColors
  type: TagTypes
  size?: TagSizes
}

/**
 * 带有固定内容的标签配置
 */
type ContentConfig = {
  content: string
  contentIntl: string
}

/**
 * 标签配置类型
 */
export type TagCfgByModule = ConfigBase | (ConfigBase & ContentConfig)

/**
 * 默认配置：大多数标签都是 color-2、secondary 类型和 large 尺寸
 */
const defaultConfig: ConfigBase = {
  color: 'color-2',
  type: 'secondary',
  size: 'large',
}

/**
 * 特殊颜色配置：只列出与默认配置不同的标签
 */
interface ColorConfig {
  color: TagColors
}

const specialColorConfig: Record<string, ColorConfig> = {
  [TagsModule.COMPANY_PRODUCT]: { color: 'color-1' },
  [TagsModule.RISK]: { color: 'color-4' },
  [TagsModule.RANK_DICT]: { color: 'color-5' },
  [TagsModule.ULTIMATE_BENEFICIARY]: { color: 'color-3' },
  [TagsModule.ACTUAL_CONTROLLER_GROUP]: { color: 'color-1' },
  [TagsModule.RELATED_PARTY]: { color: 'color-1' },
  [TagsModule.IS_CHANGE_NAME]: { color: 'color-3' },
  [TagsModule.TENDER_LOSER]: { color: 'color-3' },
  [TagsModule.CORP_INDUSTRY]: { color: 'color-8' },
  [TagsModule.BRAND_STATE]: { color: 'color-7' },
  [TagsModule.BID_TYPE]: { color: 'color-1' },
  [TagsModule.BID_TYPE_IN_SEARCH]: { color: 'color-3' },
  [TagsModule.BID_ATTACHMENT_IN_SEARCH]: { color: 'color-3' },
  [TagsModule.AREA]: { color: 'color-5' },
}

const contentConfig: Record<string, ContentConfig> = {
  [TagsModule.ULTIMATE_BENEFICIARY]: {
    content: '最终受益人',
    contentIntl: '138180',
  },
  [TagsModule.IS_CHANGE_NAME]: {
    content: '已更名',
    contentIntl: '349497',
  },
  [TagsModule.TENDER_WINNER]: {
    content: '中标',
    contentIntl: '257676',
  },
  [TagsModule.TENDER_LOSER]: {
    content: '未中标',
    contentIntl: '454814',
  },
}

/**
 * 获取标签配置的函数
 * @param module 标签模块
 * @returns 标签配置
 */
export function getTagConfig(module: TagsModule): TagCfgByModule {
  const config = { ...defaultConfig }

  // 应用特殊颜色配置
  if (module in specialColorConfig) {
    Object.assign(config, specialColorConfig[module])
  }

  // 应用内容配置
  if (module in contentConfig) {
    Object.assign(config, contentConfig[module])
  }

  return config
}
