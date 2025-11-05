import { UserPackageInfoFront } from 'gel-types'

// LocalStorage 映射对象
export interface LocalStorageSchema {
  lanxin_terminal: boolean
  lanxin_auth_code: string
  globaluserpackage4gel: UserPackageInfoFront
  globaluserinfo4gel: any
  /** 用户信息-不知道干嘛的 现在只有删除逻辑，没有存逻辑，后续可以删除 */
  USERINFO: any
  /** 企业是否收藏 */
  'wind-gel-exp-user-tips': number
  gelLastUrl: string
  autoLoginInfo: any
}

export type LocalStorageKey = keyof LocalStorageSchema
export type LocalStorageValueTypes = LocalStorageSchema

// SessionStorage 映射对象
export interface SessionStorageSchema {
  /** vip弹框同意用户协议 */
  'WFT-GEL-USERAGREEMENTS': string
  'GEL-wsid': string
}
export type SessionStorageKey = keyof SessionStorageSchema
export type SessionStorageValueTypes = SessionStorageSchema

// Cookie 映射对象
export interface CookieStorageSchema {
  /** 用户 wsid */
  'wind.sessionid': string
}
export type CookieStorageKey = keyof CookieStorageSchema
export type CookieStorageValueTypes = CookieStorageSchema
