import { ExtraOptionsMap } from './ExtraOptionsMap'
import { functionCodesMap } from './functionCodesMap'

// 所属页面ID
export enum currentPage {
  HOME = '6521', // 首页
  CHAT = '6522', // 对话
  HISTORY = '6523', // 历史
}

// 基础功能点配置类型
export type BaseFunctionConfig = {
  opEntity: string
  opActive: string
  currentPage: currentPage
}
// 条件类型：根据code判断options的类型
export type OptionsForCode<T extends keyof typeof functionCodesMap> = T extends keyof ExtraOptionsMap
  ? ExtraOptionsMap[T] & Record<string, unknown>
  : Record<string, unknown>
