// 环境配置
import { TGelEnv } from '@/env'

export interface EnvConfig {
  prefixPath?: string
  htmlPath?: string
  origin?: string
}

// 模块基础配置
export interface BaseModuleConfig {
  hash: string
  prefixPath?: string // 前缀路径
  htmlPath?: string // 默认html路径
  envConfig?: Partial<Record<TGelEnv, EnvConfig>> // 环境配置，不同环境作不同的覆盖
  customGenerate?: (config: BaseModuleConfig) => string
  appendParamsToHash?: boolean // 是否将查询参数附加到hash后面而不是作为URL的search部分
  hashPathParam?: string // 用于在hash中添加路径段的参数名，如 'chatId'
}
