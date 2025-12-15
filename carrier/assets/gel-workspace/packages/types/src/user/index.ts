export type UserPackageName =
  | 'EQ_APL_GEL_FORTRAIL'
  | 'EQ_APL_GEL_SVIP'
  | 'EQ_APL_GEL_FORSTAFF'
  | 'EQ_APL_GEL_EP'
  | 'EQ_APL_GEL_VIP'
  | 'EQ_APL_GEL_BS'

/**
 * 用户套餐信息响应
 */
export interface UserPackageInfo {
  /** 账户名称 */
  accountName: string
  /** 套餐名称 */
  packageName: UserPackageName
  /** 套餐名称列表 */
  packageNameList: UserPackageName[]
  /** 过期日期 YYYYMMDD */
  expireDate: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 终端类型 */
  terminalType: string
  /** 是否购买 */
  isBuy: boolean
  /** 是否境外 */
  isForeign: boolean
  /** 是否同意 */
  isAgree: boolean
  /** 是否试用 */
  isTrailed: boolean
  /** 是否安全 */
  isSafe: boolean
  /**
   * ip
   *
   * 0 - 国内大陆
   * 1 - 港澳台
   * 2 - 海外
   * 其余 - 找不到 ip 归属地
   */
  region: number
  /** 是否有企业账号 */
  hasCompGeAcc: boolean
}

export interface UserPackageFlags {
  isVip: boolean
  isSvip: boolean
  isEp: boolean
  isBs: boolean
  isOverseas: boolean
  isAgree: boolean
  accountName: string
}

/**
 * 前端使用 的用户信息，做过了精简
 */
export type UserPackageInfoFront = Omit<UserPackageInfo, 'packageNameList'>
