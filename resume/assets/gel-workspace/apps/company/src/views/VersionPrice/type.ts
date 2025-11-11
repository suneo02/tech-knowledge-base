/**
 * vip 的功能分级
 */
export enum VIPFunctionRatings {
  FREE = 'free',
  VIP = 'vip',
  SVIP = 'svip',
  OTHER = 'other',
}

export type VIPFuncCfg = {
  title?: React.ReactNode
  customNode?: React.ReactNode
  type?:  'ContactManager'
  langKey?: string
  colspan?: number
  rowspan?: number
  hide?: boolean
}

export type VIPFuncCfgScene = {
  function: VIPFuncCfg
  [VIPFunctionRatings.FREE]?: VIPFuncCfg
  [VIPFunctionRatings.VIP]?: VIPFuncCfg
  [VIPFunctionRatings.SVIP]?: VIPFuncCfg
  other?: VIPFuncCfg
}[]
