import intl from '../../utils/intl'
import React, { FC } from 'react'
import styles from './index.module.less'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Breadcrumb } from '@wind/wind-ui'
import { hashParams } from '@/utils/links'

const PREFIX = 'bread-crumb'
const STRINGS = {
  HOME: intl('19475', '首页'),
}

export type BreadCrumbItemDef = {
  title: string
  onClick?: () => void
}

export type BreadCrumbProps = {
  width?: string
} & (
  | {
      subTitle?: string
      onSubClick?: () => void
      items?: never
    }
  | {
      items: BreadCrumbItemDef[]
      subTitle?: never
      onSubClick?: never
    }
)

const BreadCrumb: FC<BreadCrumbProps> = ({ subTitle, onSubClick, width = '1280px', items }) => {
  const showBreadCrumb = hashParams().getParamValue('showBreadCrumb')
  if (showBreadCrumb === 'false') {
    return null
  }
  return (
    <div className={styles[PREFIX]}>
      <div className={styles[`${PREFIX}-content`]} style={{ width }}>
        <Breadcrumb separator=">" data-uc-id="URW-4CslJy" data-uc-ct="breadcrumb">
          <Breadcrumb.Item data-uc-id="qEp2Fba7os" data-uc-ct="breadcrumb">
            <a onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))} data-uc-id="FX_dxGSsBk" data-uc-ct="a">
              {STRINGS.HOME}
            </a>
          </Breadcrumb.Item>
          {items
            ? items.map((item, index) => (
                <Breadcrumb.Item key={index} data-uc-id="qyuoox2jTp" data-uc-ct="breadcrumb" data-uc-x={index}>
                  <span
                    style={{
                      cursor: item.onClick ? 'pointer' : 'initial',
                    }}
                    onClick={item.onClick}
                    data-uc-id="cdLjfVoawX"
                    data-uc-ct="span"
                  >
                    {item.title}
                  </span>
                </Breadcrumb.Item>
              ))
            : subTitle && (
                <Breadcrumb.Item data-uc-id="cc55M1yYrS" data-uc-ct="breadcrumb">
                  <span
                    style={{
                      cursor: onSubClick ? 'pointer' : 'initial',
                    }}
                    onClick={onSubClick}
                    data-uc-id="jgPnMV8pET"
                    data-uc-ct="span"
                  >
                    {subTitle}
                  </span>
                </Breadcrumb.Item>
              )}
        </Breadcrumb>
      </div>
    </div>
  )
}

export default BreadCrumb
