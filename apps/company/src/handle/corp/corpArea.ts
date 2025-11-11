import { CorpAreaCode } from 'gel-types'

/**
 * 前端自己维护的 海外国家 枚举
 */
export type TCorpArea =
  | 'america'
  | 'canada'
  | 'singapore'
  | 'japan'
  | 'korea'
  | 'england'
  | 'Germany'
  | 'France'
  | 'Italy'
  | 'tha'
  | 'vie'
  | 'nzl'
  | 'lux' // 卢森堡
  | 'india'
  | 'malaysia'
  | 'russia'
  | 'other'
  | ''
export const TCorpAreaCodeMap: Partial<Record<CorpAreaCode, TCorpArea>> = {
  '180401': 'america',
  '180402': 'canada',
  '180101': 'singapore',
  '180102': 'japan',
  '180114': 'korea',
  '180201': 'england',
  '180202': 'Germany',
  '180203': 'France',
  '180204': 'Italy',
  '180120': 'tha',
  '180104': 'vie',
  '180602': 'nzl',
  '180205': 'lux',
  '180111': 'india',
  '180117': 'malaysia',
  '180235': 'russia',
}

export function getOverSea(areaCode: CorpAreaCode): TCorpArea | '' {
  try {
    const area = ''
    if (areaCode[0] + areaCode[1] !== '18') {
      return area
    }

    // 又大写，又小写，又缩写，真的人才 吐槽by Calvin

    // 如果 code 存在 map 中，直接返回
    if (TCorpAreaCodeMap[areaCode]) {
      return TCorpAreaCodeMap[areaCode]
    }
    return 'other'
  } catch (e) {
    console.error(e)
    return ''
  }
}
