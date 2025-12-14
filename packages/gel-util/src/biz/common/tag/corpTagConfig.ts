import { CorpTagType } from 'gel-api'
import { TagColors, TagTypes } from './type'

type CorpTagCfg = {
  color: TagColors
  type: TagTypes
}

/**
 * 默认配置：大多数标签都是 color-2 和 secondary 类型
 */
const defaultConfig: CorpTagCfg = {
  color: 'color-2',
  type: 'secondary',
}

/**
 * 特殊颜色配置：只列出与默认配置不同的标签
 */
const specialColorConfig: Partial<Record<CorpTagType, Partial<CorpTagCfg>>> = {
  SPECIAL_LIST: { color: 'color-5' },
  LIST: { color: 'color-5' },
  PRODUCT_WORD: { color: 'color-1' },
  RISK: { color: 'color-4' },
  INDUSTRY: { color: 'color-8' },
  FAKE_NATION_CORP: { color: 'color-4' },
}

/**
 * 根据标签类型获取标签配置
 * @param type 标签类型
 * @returns 标签配置（颜色和类型）
 */
export function getCorpTagConfig(type: CorpTagType): CorpTagCfg {
  // 如果是特殊颜色配置，合并默认配置和特殊颜色
  if (type in specialColorConfig) {
    return {
      ...defaultConfig,
      ...specialColorConfig[type],
    }
  }
  // 否则返回默认配置
  return { ...defaultConfig }
}
