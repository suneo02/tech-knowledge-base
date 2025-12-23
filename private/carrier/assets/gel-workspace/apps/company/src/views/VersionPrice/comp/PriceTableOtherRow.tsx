/**
 * @author 张文浩<suneo@wind.com.cn>
 * @description 价格表其他行组件 - 用于渲染特殊的其他类型行
 */

import React, { FC } from 'react'
import { VIPFuncCfgScene } from '../type'
import './PriceTableOtherRow.less'
import { VersionPriceTableTD } from './VersionPriceTableTD'

interface PriceTableOtherRowProps {
  /** 功能配置对象 */
  funcCfg: VIPFuncCfgScene[number]
  /** 行索引 */
  index: number
}

/**
 * 价格表其他行组件
 * 渲染包含特殊样式的表格行，通常用于跨列显示
 */
export const PriceTableOtherRow: FC<PriceTableOtherRowProps> = ({ funcCfg, index }) => {
  return (
    <tr className="price-table-other-row" key={index}>
      <VersionPriceTableTD config={funcCfg.function} />
      <VersionPriceTableTD config={funcCfg.other} colspan={3} align="center" />
    </tr>
  )
}
