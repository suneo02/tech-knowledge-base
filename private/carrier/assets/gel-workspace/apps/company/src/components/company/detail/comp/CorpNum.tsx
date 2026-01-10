import { isNil } from 'lodash'
import React, { FC } from 'react'

import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { CorpBasicNumFront, CorpTableCfg } from '@/types/corpDetail'
import { TCorpDetailSubModule } from 'gel-types'

// 样式类名常量
export const CorpModuleNumClass = 'corp-table-title-num' // 模块级别数字样式（16px，较大）
export const CorpModuleNumClassChild = 'corp-table-child-num' // 子表格级别数字样式（14px，较小）

/**
 * 企业详情模块数字展示组件
 *
 * 功能：从 basicNum 中根据 modelNum 键获取对应的统计数字并展示
 * 使用场景：企业详情页面的模块标题后显示统计数字，如 "股东信息 (5)"
 *
 * 特点：
 * - 通过 modelNum 键从 basicNum 对象中动态获取数字
 * - 支持自定义样式类名
 * - 自动处理异常情况（隐藏、无效值等）
 * - 格式：(数字)
 *
 * @param className - 自定义样式类名，默认为 CorpModuleNumClass
 * @param modelNum - basicNum 中的键名，用于获取对应的统计数字
 * @param numHide - 是否隐藏数字
 * @param basicNum - 企业基础统计数据对象
 */
export const CorpModuleNum: FC<{
  className?: string
  modelNum: CorpTableCfg['modelNum']
  numHide: CorpTableCfg['numHide']
  basicNum: CorpBasicNumFront
}> = ({ className = CorpModuleNumClass, numHide, modelNum, basicNum }) => {
  try {
    // 如果配置了隐藏或没有提供 modelNum，不显示
    if (numHide === true || isNil(modelNum)) {
      return null
    }

    // 从 basicNum 中获取对应的数字
    const numParsed = getCorpModuleNum(modelNum, basicNum)

    // 只有当数字有效且非负时才显示
    if (typeof numParsed !== 'number' || (typeof numParsed === 'number' && numParsed < 0)) {
      return null
    }
    return <span className={className}>{'(' + numParsed + ')'}</span>
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * 企业详情表格总数展示组件
 *
 * 功能：直接展示传入的 total 数字
 * 使用场景：表格标题后显示当前表格的数据总数，如 "历史股东 (10)"
 *
 * 特点：
 * - 直接使用传入的 total 值，不需要从 basicNum 中获取
 * - 根据 tableKey 自动判断是主表格还是子表格，应用不同的样式
 * - 主表格（无 '-'）：使用较大字体（16px）
 * - 子表格（含 '-'）：使用较小字体（14px）
 * - 格式：(数字)
 *
 * @param className - 自定义样式类名，默认为 CorpModuleNumClass
 * @param total - 要显示的总数
 * @param eachTableKey - 表格的唯一标识，用于判断是否为子表格
 */
export const CorpModuleNumTotal: FC<{
  className?: string
  total: number
  eachTableKey: TCorpDetailSubModule
}> = ({ total, className = CorpModuleNumClass, eachTableKey }) => {
  try {
    // 只有当 total 有效且为正数时才显示
    if (!total || total < 0) {
      return ''
    }
    let classNameParsed = className
    // 子表格的 key 包含 '-'，如 'shareholder-history'
    // 子表格与模块大表格字体大小不一样，需要区分处理
    if (eachTableKey.indexOf('-') > -1) {
      classNameParsed = CorpModuleNumClassChild
    }
    return <span className={classNameParsed}>{'(' + total + ')'}</span>
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * 企业详情左侧菜单数字展示组件
 *
 * 功能：在左侧导航菜单中显示模块的数据数量
 * 使用场景：企业详情页面左侧树形菜单，如 "股东信息 (5)"
 *
 * 特点：
 * - 直接接收数字值，不需要从 basicNum 中获取
 * - 超过 99 显示为 "99+"
 * - 只显示大于 0 的数字
 * - 格式：空格 + (数字)，如 " (5)" 或 " (99+)"
 * - 使用 menu-num 样式类（灰色，较小字体）
 *
 * @param modelNum - 要显示的数字，或 boolean 类型（boolean 时不显示）
 */
export const CorpMenuNum: React.FC<{
  modelNum: number | boolean // 传入的数字
}> = ({ modelNum }) => {
  try {
    // 如果是 boolean 类型，不显示
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
      // 超过 99 显示为 "99+"
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
