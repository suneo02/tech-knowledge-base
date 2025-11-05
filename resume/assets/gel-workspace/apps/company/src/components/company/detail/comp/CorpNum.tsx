import React, { FC } from 'react'
import { isNil } from 'lodash'
import { ICorpTableCfg } from '@/components/company/type'
import { ICorpBasicNumFront } from '../../../../handle/corp/basicNum/type.ts'
import { TCorpDetailSubModule } from '@/handle/corp/detail/module/type.ts'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'

export const CorpModuleNumClass = 'corp-table-title-num'
export const CorpModuleNumClassChild = 'corp-table-child-num'

export const CorpModuleNum: FC<{
  className?: string
  modelNum: ICorpTableCfg['modelNum']
  numHide: ICorpTableCfg['numHide']
  basicNum: ICorpBasicNumFront
}> = ({ className = CorpModuleNumClass, numHide, modelNum, basicNum }) => {
  try {
    if (numHide === true || isNil(modelNum)) {
      return null
    }
    const numParsed = getCorpModuleNum(modelNum, basicNum)

    if (typeof numParsed !== 'number' || (typeof numParsed === 'number' && numParsed < 0)) {
      return null
    }
    return <span className={className}>{'(' + numParsed + ')'}</span>
  } catch (e) {
    console.error(e)
    return null
  }
}

export const CorpModuleNumTotal: FC<{
  className?: string
  total: number
  eachTableKey: TCorpDetailSubModule
}> = ({ total, className = CorpModuleNumClass, eachTableKey }) => {
  try {
    if (!total || total < 0) {
      return ''
    }
    let classNameParsed = className
    if (eachTableKey.indexOf('-') > -1) {
      // 子表格 与 模块大表格，字体大小不一样 区分处理
      classNameParsed = CorpModuleNumClassChild
    }
    return <span className={classNameParsed}>{'(' + total + ')'}</span>
  } catch (e) {
    console.error(e)
    return null
  }
}

export const CorpMenuNum: React.FC<{
  modelNum: number | boolean // 传入的数字
}> = ({ modelNum }) => {
  try {
    if (typeof modelNum === 'boolean') {
      return null
    }
    // 判断 modelNum 是否为数字，确保稳健性
    if (typeof modelNum !== 'number' || isNaN(modelNum)) {
      console.error('Invalid modelNum: Not a number', modelNum)
      return null
    }

    // 只有当 modelNum 大于 0 时才显示
    if (modelNum > 0) {
      const displayNum = modelNum > 99 ? '99+' : modelNum
      return <span className="menu-num">{` (${displayNum})`}</span>
    }
    // 如果小于等于 0，不显示任何内容
    return null
  } catch (error) {
    console.error('Error rendering MenuNumber component:', error)
    return null
  }
}
