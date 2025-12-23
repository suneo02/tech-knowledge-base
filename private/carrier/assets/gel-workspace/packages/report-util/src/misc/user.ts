import { UserPackageFlags, UserPackageInfo } from 'gel-types'

/**
 * 解析用户包信息数据
 * @param {Object} userData - 要解析的原始数据
 * @return {Object} - 包含解析后的用户权限标志的对象
 */
export function parseUserPackageInfo(userData: UserPackageInfo | undefined): UserPackageFlags {
  // 初始化标志
  var flags: UserPackageFlags = {
    isVip: false,
    isSvip: false,
    isEp: false,
    isBs: false,
    isOverseas: false,
    isAgree: false,
    accountName: '',
  }

  // 如果数据无效，返回空标志
  if (!userData) {
    return flags
  }

  var userData = userData
  var isBuy = userData.isBuy
  flags.isAgree = userData.isAgree
  flags.accountName = userData.accountName || ''

  // 解析包类型
  var type = userData.packageName || ''
  if (type == 'EQ_APL_GEL_SVIP') {
    flags.isVip = true
    flags.isSvip = true
  }
  if (type == 'EQ_APL_GEL_VIP') {
    flags.isVip = true
  }
  if (type == 'EQ_APL_GEL_EP') {
    flags.isEp = true
    flags.isVip = true
  }
  if (type == 'EQ_APL_GEL_BS') {
    flags.isBs = true
  }

  // 终端用户默认拥有VIP/SVIP权限
  if (isBuy) {
    flags.isVip = true
    flags.isSvip = true
  }

  flags.isOverseas = userData.isForeign
  if (Number(userData.region) !== 0) {
    // ip 境外
    flags.isOverseas = true
  }
  return flags
}
