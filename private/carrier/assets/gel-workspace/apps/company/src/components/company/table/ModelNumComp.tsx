import {
  CorpModuleNum,
  CorpModuleNumClassChild,
  CorpModuleNumTotal,
} from '@/components/company/detail/comp/CorpNum.tsx'

import { CorpBasicNumFront, CorpTableCfg } from '@/types/corpDetail'
import { TCorpDetailSubModule } from 'gel-types'
import React, { FC, ReactNode } from 'react'

/**
 * 企业详情表格统计数字智能展示组件（高阶组件）
 *
 * 功能：根据配置自动选择合适的数字展示组件
 * 使用场景：表格组件内部使用，自动处理各种数字展示逻辑
 *
 * 决策逻辑（优先级从高到低）：
 * 1. 如果 numHide=true，不显示任何数字
 * 2. 如果 modelNumUseTotal=true，使用 CorpModuleNumTotal（显示 total）
 * 3. 如果提供了 compDefault，使用自定义组件
 * 4. 如果 modelNum 是有效的 basicNum 键，使用 CorpModuleNum（从 basicNum 获取）
 * 5. 默认使用 CorpModuleNumTotal（显示 total）
 *
 * 特点：
 * - 封装了数字展示的所有逻辑判断
 * - 支持多种数据源（total、basicNum、自定义）
 * - 自动应用子表格样式
 *
 * @param total - 表格数据总数
 * @param eachTableKey - 表格唯一标识
 * @param modelNum - basicNum 中的键名（可选）
 * @param modelNumUseTotal - 是否强制使用 total
 * @param compDefault - 自定义数字组件（可选）
 * @param numHide - 是否隐藏数字
 * @param basicNum - 企业基础统计数据对象
 */
export const CorpTableModelNum: FC<{
  total: number
  eachTableKey: TCorpDetailSubModule
  modelNum: CorpTableCfg['modelNum'] | undefined
  modelNumUseTotal: CorpTableCfg['modelNumUseTotal']
  compDefault: ReactNode | null | undefined
  numHide: boolean | undefined
  basicNum: CorpBasicNumFront
}> = ({ total, eachTableKey, compDefault, numHide, modelNum, modelNumUseTotal, basicNum }) => {
  // 1. 如果配置了隐藏，不显示
  if (numHide) {
    return null
  }
  // 2. 如果配置了使用 total，显示 total
  if (modelNumUseTotal) {
    return <CorpModuleNumTotal total={total} eachTableKey={eachTableKey} />
  }
  // 3. 如果提供了自定义组件，使用自定义组件
  if (compDefault) {
    return compDefault
  }
  // 4. 如果 modelNum 是字符串，并且存在于 basicNum 中，从 basicNum 获取数字
  if (modelNum && typeof modelNum === 'string' && modelNum in basicNum) {
    return (
      <CorpModuleNum className={CorpModuleNumClassChild} modelNum={modelNum} numHide={numHide} basicNum={basicNum} />
    )
  }
  // 5. 默认显示 total
  return <CorpModuleNumTotal total={total} eachTableKey={eachTableKey} />
}
