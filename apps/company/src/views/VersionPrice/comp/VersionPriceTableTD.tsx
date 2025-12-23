/**
 * @author 张文浩<suneo@wind.com.cn>
 * @description 版本价格表格单元格组件 - 通用表格单元格，支持多种类型
 */

import { ContactManagerButton } from '@/components/company/ContactManager/ContactManagerButton'
import { HKInfoQueryAggreBtn } from '@/components/company/HKCorp/info/modal/HKInfoQueryAggre'
import React, { FC, isValidElement } from 'react'
import intl from '../../../utils/intl'
import { VIPFuncCfg } from '../type'

interface VersionPriceTableTDProps {
  /** 单元格宽度 */
  width?: string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** CSS类名 */
  className?: string
  /** 跨列数 */
  colspan?: number
  /** 跨行数 */
  rowspan?: number
  /** config */
  config?: VIPFuncCfg
}

/**
 * 版本价格表格单元格组件
 * 根据type属性渲染不同类型的单元格内容
 */
export const VersionPriceTableTD: FC<VersionPriceTableTDProps> = ({
  config,
  width,
  align,
  className,
  colspan,
  rowspan,
}) => {
  const { langKey, title, type ,customNode } = config || {}
  let content: React.ReactNode = JSON.stringify(title)

  // 根据类型渲染不同的内容
  if (customNode) {
    content = customNode
  }  else if (type === 'ContactManager') {
    content = <ContactManagerButton title={title} />
  } else if ((typeof langKey === 'string' || typeof langKey === 'number') && typeof title === 'string') {
    content = intl(langKey, title)
  } else if (isValidElement(title)) {
    content = title
  }

  return (
    <td width={width} align={align} className={className} colSpan={colspan} rowSpan={rowspan ? rowspan : 1}>
      {content}
    </td>
  )
}
