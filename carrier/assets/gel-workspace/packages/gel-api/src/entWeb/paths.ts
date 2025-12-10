import { EntWebApiResponse } from './types'

export type EaglesName = 'WFT PC' | 'WFT APP' | 'WECHAT' | 'GEL APP' | 'WEB PC' | 'WEB APP'

/**
 * entWeb API 路径映射
 * key 是具体接口 cmd 值，如 'user-log/add'
 */
export type entWebApiPathMap = {
  'user-log/add': {
    data: {
      userLogItems: Array<Record<string, unknown>>
    }
    response: EntWebApiResponse<{
      success: boolean
    }>
  }
  // 上报错误
  'openapi/eaglesLog': {
    data: {
      reason: string
      name: EaglesName
    }
  }
  // 其他 entWeb API 路径和类型定义
  // 可以根据实际 API 继续添加
}

/**
 * entWeb API 配置
 */
export const entWebApiCfg: Partial<Record<keyof entWebApiPathMap, Record<string, unknown>>> = {
  // 可以在这里添加特定 API 的默认配置
}
