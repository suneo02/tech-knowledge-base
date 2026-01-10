import { CorpBasicNumFront } from '@/types/corpDetail'
import { ReactNode } from 'react'

export interface CorpDetailNodeCfgCommon {
  title?: string
  modelNum?: keyof CorpBasicNumFront | Array<keyof CorpBasicNumFront> | true | undefined
  modelNumStr?: ReactNode
  modelNumUseTotal?: true // 是否使用总数 展示
  hideTitle?: boolean
  hideWhenNumZero?: boolean
  numHide?: boolean // 是否隐藏统计数字展示
}

export interface CprpDetailNodeVipCfg {
  notVipTitle: ReactNode
  notVipTips: ReactNode
}
