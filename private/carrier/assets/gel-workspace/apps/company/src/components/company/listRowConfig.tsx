/** @format */
import { base } from '@/handle/corpModuleCfg/base/base.tsx'
import { buss } from '@/handle/corpModuleCfg/buss/buss.tsx'
import { bussRisk } from '@/handle/corpModuleCfg/bussRisk/bussRisk.tsx'
import { finance } from '@/handle/corpModuleCfg/finance/finance.tsx'
import { financialDataPrimary } from '@/handle/corpModuleCfg/finance/financialData.tsx'
import { history } from '@/handle/corpModuleCfg/history/history.tsx'
import { ip } from '@/handle/corpModuleCfg/ip/ip.tsx'
import { corpListInformation } from '@/handle/corpModuleCfg/qualification/listInformation'
import { qualifications } from '@/handle/corpModuleCfg/qualification/qualifications.tsx'
import { corpSelectList } from '@/handle/corpModuleCfg/qualification/selectList'
import { risk } from '@/handle/corpModuleCfg/risk/risk.tsx'
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { IpoBusinessData } from './IpoBusinessData'
import { PrivateFundData } from './PrivateFundData'
import { PublishFundData } from './PublishFundData'

export const listRowConfig: CorpPrimaryModuleCfg[] = [
  base,
  IpoBusinessData,
  PublishFundData,
  PrivateFundData,
  finance,
  financialDataPrimary,
  buss,
  qualifications,
  ip,
  risk,
  bussRisk,
  history,
]

// 上海工商联 仅展示 以下模块 且不做vip控制
export const shficRowConfig: CorpPrimaryModuleCfg[] = [
  { showShareholder: base.showShareholder },
  {
    selectList: {
      ...corpSelectList,
      notVipTitle: '',
      notVipTips: '',
    },
  },
  {
    listInformation: {
      ...corpListInformation,
      notVipTitle: '',
      notVipTips: '',
    },
  },
]

export const corpModuleCfgIIP: CorpPrimaryModuleCfg[] = [
  base,
  IpoBusinessData,
  PublishFundData,
  PrivateFundData,
  buss,
  ip,
  history,
]
