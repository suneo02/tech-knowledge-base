import { LocalStorageKey } from './type'

/**
 * @file 所有废弃的 storage key，需要在用户电脑删除
 */

type NoLocalStorageKeys<T extends readonly string[]> = {
  [P in keyof T]: T[P] extends LocalStorageKey ? never : T[P]
}

function defineDeprecatedKeys<T extends readonly string[]>(keys: T & NoLocalStorageKeys<T>): T {
  return keys
}

export const DeprecateStorageKeys = defineDeprecatedKeys([
  // 招标查询
  'searchBidQueryText',
  'searchBidSubjectName',
  'searchBidPurchaseCompany',
  'searchBidWinCompany',
  'searchbidWinnerCompany',

  // 招聘查询
  'searchJobQueryText',

  // 首页人物、企业、关系搜索
  'homePeopleHistory',
  'homeCompanyHistory',
  'homeRelationHistory',

  // 首页榜单名录
  'feturedHistory',

  // 首页商标查询
  'brandHistory',
  // 首页专利查询
  'patentHistory',

  // 顶部主搜索
  'historyCom',
] as const)

/**
 * 删除所有废弃的local storage
 */
export const removeAllDeprecatedStorage = () => {
  DeprecateStorageKeys.forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove deprecated storage key: ${key}`, error)
    }
  })
}
