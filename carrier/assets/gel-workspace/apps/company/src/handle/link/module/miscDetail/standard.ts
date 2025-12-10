import { GelHashMap, getPrefixUrl, handleAppendUrlPath, LinksModule, TLinkOptionsCommon } from '@/handle/link'
import { ValuesOf } from '../../../../types/misc.ts'

/**
 * 枚举值不能随便改，有 JSON 文件可能硬编码
 */
export enum EStandard {
  INDUSTRY = 'industry',
  NATION_PLAN = 'nationPlan',
  NATION = 'nation',
  GROUP = 'group',
  LOCAL = 'local',
}

/**
 * url 参数 map
 */
export const STANDARD_URL_PARAM_MAP = {
  [EStandard.INDUSTRY]: 'standardDataIndustry',
  [EStandard.NATION_PLAN]: 'standardPlan',
  [EStandard.NATION]: 'standardDataCountry',
  [EStandard.LOCAL]: 'standardLocal',
  [EStandard.GROUP]: 'standardGroup',
}

/**
 * value 是 后端传递的
 */
export const STANDARD_LEVEL_MAP = {
  [EStandard.INDUSTRY]: '行业标准',
  [EStandard.NATION_PLAN]: '国家标准计划',
  [EStandard.NATION]: '国家标准',
  [EStandard.LOCAL]: '地方标准',
  [EStandard.GROUP]: '团体标准',
}

export const getStandardEnumByLevel = (level: ValuesOf<typeof STANDARD_LEVEL_MAP>) => {
  // 查找对应的枚举值
  const eStandard = Object.values(EStandard).find((e) => STANDARD_LEVEL_MAP[e] === level)
  // 如果找到了对应的枚举值
  if (eStandard) {
    return eStandard
  } else {
    console.error('~ standard level error', level)
  }
}

export type TStandardDetailUrlProps = {
  id: string
  standardLevelCode: string
  type: EStandard
} & Pick<TLinkOptionsCommon, 'params' | 'env'>
export const getStandardDetailByUrl = ({ id, params, standardLevelCode, type, env }: TStandardDetailUrlProps) => {
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )
  baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)

  if (!id || !type || !standardLevelCode) {
    return null
  }
  baseUrl.hash = GelHashMap[LinksModule.STANDARD_DETAIL]
  baseUrl.search = new URLSearchParams({
    entityNumber: id,
    type: STANDARD_URL_PARAM_MAP[type],
    standardLevelCode,
    ...params,
  }).toString()

  return baseUrl.toString()
}
