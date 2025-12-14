/**
 * @author 张文浩<suneo@wind.com.cn>
 * @description 价格表普通行组件 - 用于渲染标准的价格表行
 */

import React, { FC } from 'react'
import { VIPFunctionRatings } from '../type'
import { VersionPriceTableTD } from './VersionPriceTableTD'

interface PriceTableNormalRowProps {
  /** 功能配置对象 */
  funcCfg: any
  /** 行索引 */
  index: number
  /** 是否隐藏VIP列 */
  ifHideVip?: boolean
}

/**
 * 价格表普通行组件
 * 渲染包含免费版、VIP版、SVIP版功能对比的标准表格行
 */
export const PriceTableNormalRow: FC<PriceTableNormalRowProps> = ({ funcCfg, index, ifHideVip }) => {
  return (
    <tr key={index}>
      <VersionPriceTableTD config={funcCfg.function} />
      <VersionPriceTableTD
        config={funcCfg[VIPFunctionRatings.FREE]}
        width="240"
        align="center"
      />
      {!ifHideVip && (
        <VersionPriceTableTD
          config={funcCfg[VIPFunctionRatings.VIP]}
          width="240"
          align="center"
          className="color-vip"
        />
      )}
      {funcCfg[VIPFunctionRatings.SVIP].hide ? null : (
        <VersionPriceTableTD
          config={funcCfg[VIPFunctionRatings.SVIP]}
          width="240"
          align="center"
          className="color-svip"
          rowspan={funcCfg[VIPFunctionRatings.SVIP].rowspan}
        />
      )}
    </tr>
  )
}
