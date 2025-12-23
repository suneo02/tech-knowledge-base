import { ExtraOptionsMap } from './ExtraOptionsMap'
import { functionCodesMap } from './functionCodesMap'

// 条件类型：根据code判断options的类型
export type OptionsForCode<T extends keyof typeof functionCodesMap> = T extends keyof ExtraOptionsMap
  ? ExtraOptionsMap[T] & Record<string, unknown>
  : Record<string, unknown>
