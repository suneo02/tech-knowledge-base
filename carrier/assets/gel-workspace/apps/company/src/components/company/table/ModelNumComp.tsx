import {
  CorpModuleNum,
  CorpModuleNumClassChild,
  CorpModuleNumTotal,
} from '@/components/company/detail/comp/CorpNum.tsx'
import { ICorpTableCfg } from '@/components/company/type'

import React, { FC, ReactNode } from 'react'
import { ICorpBasicNumFront } from '../../../handle/corp/basicNum/type.ts'
import { TCorpDetailSubModule } from 'gel-types'

/**
 * 企业详情 table 统计数字展示组件
 * @param param0
 * @returns
 */
export const CorpTableModelNum: FC<{
  total: number
  eachTableKey: TCorpDetailSubModule
  modelNum: ICorpTableCfg['modelNum'] | undefined
  modelNumUseTotal: ICorpTableCfg['modelNumUseTotal']
  compDefault: ReactNode | null | undefined
  numHide: boolean | undefined
  basicNum: ICorpBasicNumFront
}> = ({ total, eachTableKey, compDefault, numHide, modelNum, modelNumUseTotal, basicNum }) => {
  if (numHide) {
    return null
  }
  if (modelNumUseTotal) {
    return <CorpModuleNumTotal total={total} eachTableKey={eachTableKey} />
  }
  if (compDefault) {
    return compDefault
  }
  // 如果 modelNum 是字符串，并且存在于 basicNum 中，则返回 CorpModuleNum 组件
  if (modelNum && typeof modelNum === 'string' && modelNum in basicNum) {
    return (
      <CorpModuleNum className={CorpModuleNumClassChild} modelNum={modelNum} numHide={numHide} basicNum={basicNum} />
    )
  }
  return <CorpModuleNumTotal total={total} eachTableKey={eachTableKey} />
}
