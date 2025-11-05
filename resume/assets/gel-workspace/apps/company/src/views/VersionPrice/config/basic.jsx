import can_use_new from '../../../assets/imgs/can-use-new.png'
import no_use_new from '../../../assets/imgs/no-use-new.png'
/**
 * vip 的功能分级
 */
export const VIPFunctionRatings = {
  FREE: 'free',
  VIP: 'vip',
  SVIP: 'svip',
  OTHER: 'other',
}

/**
 * 功能打开或关闭 显示为 × 或者 √
 */
export const VIPFunctionOff = {
  title: <img src={no_use_new} />,
}
export const VIPFunctionOn = {
  title: <img src={can_use_new} />,
}

export const VIPGQCT = {
  title: '无限层层穿透',
  langKey: '437139',
}

export const VIPCtrl = {
  title: '六层穿透',
  langKey: '437157',
}

export const VIPHundredCorpDay = {
  title: '每天100家',
  langKey: '437137',
}
export const VIPFiveHundredCorpDay = {
  title: '每天500家',
  langKey: '437155',
}
export const VIPTwoThousandCorpDay = {
  title: '每天2,000家',
  langKey: '424979',
}

export const VIPFirstPageOnly = {
  title: '仅限第1页',
  langKey: '224296',
}

export const VIPLimitedTime = {
  title: '限时体验',
  langKey: '301018',
}

export const VIPNotSupportExport = {
  title: '不支持导出',
  langKey: '323608',
}
export const VIPSupportExport = {
  title: '支持导出',
  langKey: '379773',
}
/**
 * 生成vip 页面功能各等级的配置
 * @param {*} free
 * @param {*} vip
 * @param {*} svip
 * @returns
 */
export const generateVIPFuncCfg = ({ free = VIPFunctionOff, vip = VIPLimitedTime, svip = VIPFunctionOn }) => {
  return {
    [VIPFunctionRatings.FREE]: free,
    [VIPFunctionRatings.VIP]: vip,
    [VIPFunctionRatings.SVIP]: svip,
  }
}
