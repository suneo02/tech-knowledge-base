import React from 'react'
import can_use_new from '../../../assets/imgs/can-use-new.png'
import no_use_new from '../../../assets/imgs/no-use-new.png'
import { VIPFuncCfg, VIPFunctionRatings } from '../type'

/**
 * 功能打开或关闭 显示为 × 或者 √
 */
export const VIPFunctionOff: Omit<VIPFuncCfg, 'title'> & Required<Pick<VIPFuncCfg, 'title'>> = {
  title: <img src={no_use_new} />,
}
export const VIPFunctionOn: Omit<VIPFuncCfg, 'title'> & Required<Pick<VIPFuncCfg, 'title'>> = {
  title: <img src={can_use_new} />,
}

export const VIPGQCT: VIPFuncCfg = {
  title: '无限层层穿透',
  langKey: '437139',
}

export const VIPCtrl: VIPFuncCfg = {
  title: '六层穿透',
  langKey: '437157',
}

export const VIPHundredCorpDay: VIPFuncCfg = {
  title: '每天100家',
  langKey: '437137',
}
export const VIPFiveHundredCorpDay: VIPFuncCfg = {
  title: '每天500家',
  langKey: '437155',
}
export const VIPTwoThousandCorpDay: VIPFuncCfg = {
  title: '每天2,000家',
  langKey: '424979',
}

export const VIPFirstPageOnly: VIPFuncCfg = {
  title: '仅限第1页',
  langKey: '224296',
}

export const VIPLimitedTime: Omit<VIPFuncCfg, 'title'> & Required<Pick<VIPFuncCfg, 'title'>> = {
  title: '限时体验',
  langKey: '301018',
}

export const VIPNotSupportExport: VIPFuncCfg = {
  title: '不支持导出',
  langKey: '323608',
}
export const VIPSupportExport: VIPFuncCfg = {
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
export function generateVIPFuncCfg({
  free = VIPFunctionOff,
  vip = VIPLimitedTime,
  svip = VIPFunctionOn,
}: {
  free?: VIPFuncCfg
  vip?: VIPFuncCfg
  svip?: VIPFuncCfg
}): {
  [VIPFunctionRatings.FREE]: VIPFuncCfg
  [VIPFunctionRatings.VIP]: VIPFuncCfg
  [VIPFunctionRatings.SVIP]: VIPFuncCfg
} {
  return {
    [VIPFunctionRatings.FREE]: free,
    [VIPFunctionRatings.VIP]: vip,
    [VIPFunctionRatings.SVIP]: svip,
  }
}
