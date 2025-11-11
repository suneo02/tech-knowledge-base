// 个体工商户 自定义模块
import { IpoBusinessData, PrivateFundData, PublishFundData } from '@/components/company/listRowConfig.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import { base } from '@/handle/corpModuleCfg/base/base.tsx'
import { buss } from '@/handle/corpModuleCfg/buss/buss.tsx'
import { history } from '@/handle/corpModuleCfg/history/history.tsx'
import { ip } from '@/handle/corpModuleCfg/ip/ip.tsx'

export const corpModuleCfgIIP: ICorpPrimaryModuleCfg[] = [
  base,
  IpoBusinessData,
  PublishFundData,
  PrivateFundData,
  buss,
  ip,
  history,
]
