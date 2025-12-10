/**
 * @author 张文浩<suneo@wind.com.cn>
 * @description 版本价格场景表格组件 - 单个场景的价格对比表格
 */

import React, { FC } from 'react'
import intl from '../../../utils/intl'
import { VIPFuncCfgScene } from '../type'
import { PriceTableNormalRow } from './PriceTableNormalRow'
import { PriceTableOtherRow } from './PriceTableOtherRow'

interface VersionPriceSceneTableProps {
  /** 场景内容配置数组 */
  sceneContentCfg: VIPFuncCfgScene
  /** 场景标题配置 */
  sceneTitleCfg: {
    langKey: string
    title: string
  }
  /** 元素ID */
  id: string
  /** CSS类名 */
  className: string
  /** 是否隐藏VIP列 */
  ifHideVip?: boolean
}

/**
 * 版本价格场景表格组件
 * 渲染单个场景的价格对比表格，包含标题和功能对比行
 */
export const VersionPriceSceneTable: FC<VersionPriceSceneTableProps> = ({
  sceneContentCfg,
  sceneTitleCfg,
  id,
  className,
  ifHideVip,
}) => {
  return (
    <>
      <div className={`tit-price ${className}`} id={id}>
        <span className="after-tit-price">{intl(sceneTitleCfg.langKey, sceneTitleCfg.title)}</span>
      </div>
      <table className="price-table-con">
        <tbody>
          {sceneContentCfg.map((funcCfg, idx) => {
            if (funcCfg.other) {
              return <PriceTableOtherRow key={idx} funcCfg={funcCfg} index={idx} />
            } else {
              return <PriceTableNormalRow key={idx} funcCfg={funcCfg} index={idx} ifHideVip={ifHideVip} />
            }
          })}
        </tbody>
      </table>
    </>
  )
}
