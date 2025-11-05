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
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>{STRINGS.HOME}</a>
          </Breadcrumb.Item>
          {items
            ? items.map((item, index) => (
                <Breadcrumb.Item key={index}>
                  <span
                    style={{
                      cursor: item.onClick ? 'pointer' : 'initial',
                    }}
                    onClick={item.onClick}
                  >
                    {item.title}
                  </span>
                </Breadcrumb.Item>
              ))
            : subTitle && (
                <Breadcrumb.Item>
                  <span
                    style={{
                      cursor: onSubClick ? 'pointer' : 'initial',
                    }}
                    onClick={onSubClick}
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
