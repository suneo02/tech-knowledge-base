// import ArrowIcon from '../../../../assets/arrow.png'
import { Divider, Typography } from 'antd'
import React, { ReactNode } from 'react'
// import { Links } from '../../components/Links'
// import { ModuleTypeEnum } from '../../types/emun'

/** each chain info */
interface ChainItem {
  level: string // 层级
  percent: string // 百分比
  shareholderId: string // 跳转id
  shareholderName: string // 跳转企业名称
  type: 'person' | 'company' // 跳转类型
}
export default () => {
  /** 渲染单条股权链 */
  const renderChain = (chain: ChainItem[]): ReactNode => {
    if (!Array.isArray(chain)) return '--'
    if (chain.length === 1) return chain[0].percent
    return (
      <span>
        {chain.map((item, index) => {
          // let module: ModuleTypeEnum = ModuleTypeEnum.COMPANY
          // if (item?.type === 'person') module = ModuleTypeEnum.CHARACTER
          // if (item?.type === 'company') module = ModuleTypeEnum.COMPANY
          return (
            <span key={index}>
              开发中
              {/* <Links key={`links-${index + 1}`} id={item.shareholderId} label={item.shareholderName} module={module} /> */}
              {index !== chain.length - 1 ? (
                <div className="chain-item-arrow">
                  <div>
                    <div>{item.percent ? `${item.percent}%` : '--'}</div>
                    {/* <img src={ArrowIcon} alt="" /> */}
                  </div>
                </div>
              ) : null}
            </span>
          )
        })}
      </span>
    )
  }
  /** 渲染多条股权链 */
  // const renderChains = (chains: ChainItem[][] | ChainItem[]): ReactNode => {
  //   if (!Array.isArray(chains)) return '--'
  //   if (Array.isArray(chains[0])) {
  //     return (chains as ChainItem[][]).map((chain, index) => <Card>{renderChain(chain)}</Card>)
  //   } else {
  //     return renderChain(chains as ChainItem[])
  //   }
  // }

  const renderChainInfo = (chains: ChainItem[][] | ChainItem[]): ReactNode => {
    if (!Array.isArray(chains)) return '--'
    if (Array.isArray(chains[0])) {
      if (chains.length > 1) {
        return (chains as ChainItem[][]).map((chain, index) => (
          <span key={`chain-${index}`}>
            {index ? <Divider dashed style={{ marginBlock: 2 }} /> : null}
            <Typography.Text type="secondary">{index + 1}. </Typography.Text> {renderChain(chain)}
          </span>
        ))
      } else {
        return renderChain(chains[0] as ChainItem[])
      }
    } else {
      return renderChain(chains as ChainItem[])
    }
  }
  return {
    renderChainInfo,
  }
}
