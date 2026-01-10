import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { formatPercentFromWftCommon } from '@/utils/WFTCommonWithType'
import { ShareRouteDetail } from 'gel-types'
import { formatPercentWithTwoDecimalWhenZero } from 'gel-util/format'
import React, { ReactNode } from 'react'

/**
 * 渲染股权路径弹窗头部
 */
export const renderRouteHeader = (headerNodes: {
  left?: ReactNode
  right?: ReactNode
  name?: ReactNode
  shareRate?: string | number
}) => {
  if (!headerNodes) {
    return null
  }
  const { left, right, name, shareRate } = headerNodes

  if (!left || !name) return null

  return (
    <div
      style={{
        display: 'flex',
        paddingBlockEnd: 12,
        marginBlockEnd: 12,
        borderBlockEnd: '1px dashed #ededed',
      }}
    >
      <div style={{ flex: 1 }}>
        <label>{left}：</label>
        <span style={{ color: '#00aec7' }}>{name}</span>
      </div>
      <div style={{ flex: 1 }}>
        <label>{right}：</label>
        <span style={{ color: '#00aec7' }}> {shareRate}</span>
      </div>
    </div>
  )
}

/**
 * 渲染股权路径内容
 */
export const renderRouteContent = (route: ShareRouteDetail[]) => {
  const c = route
  let vCount = 0
  return c.map((x, _y) => {
    let item = null
    let rate = 0
    item = x.route
    const nameL = item[0]['nodeName'] ? item[0]['nodeName'] : '--'
    const title = item?.some((r) => r.typeName)
      ? intl('478576', '决定路径')
      : `${intl('231780', '持股路径')}${++vCount}：（${intl('138459', '占比约')} ${formatPercentWithTwoDecimalWhenZero(x.ratio)}）`
    let way
    for (var j = 0; j < item.length - 1; j++) {
      if (item[j].directRatioValue && item[j].directRatioValue !== -1 && item[j].directRatioValue !== -2) {
        rate = rate ? (rate * item[j].directRatioValue) / 100 : item[j].directRatioValue
      }
      if (item[j].directRatioValue < 0) {
        console.log(item[j].directRatioValue)
      }
    }

    if (item[0]['nodeId']) {
      if (item[0]['nodeId'].length < 15) {
        way = (
          <span
            className="td-span-route-left underline wi-secondary-color wi-link-color"
            onClick={() => {
              item[0]['nodeId'] && wftCommon.linkCompany('Bu3', item[0]['nodeId'])
            }}
            data-uc-id="lFtRgjvjm"
            data-uc-ct="span"
          >
            {nameL}
          </span>
        )
      } else {
        way = <span className="td-span-route-left">{nameL}</span>
      }
    } else {
      way = nameL ? <span className="td-span-route-left">{nameL}</span> : ''
    }
    const f = []
    for (var j = 1; j < item.length; j++) {
      const nameR = item[j]['nodeName'] ? item[j]['nodeName'] : '--'
      const sRate = item[j - 1]['directRatioValue'] ? item[j - 1]['directRatioValue'] : ''
      const nodeId1 = item[j]['nodeId'] ? item[j]['nodeId'] : ''
      const name = item[j - 1]?.['typeName']

      f.push(
        <span key={j}>
          <span className="td-span-route-right">
            <b style={{ textAlign: 'center' }}>{name || formatPercentFromWftCommon(sRate)}</b>
            <i></i>
          </span>
          <span
            className="wi-secondary-color underline ctrlright wi-link-color"
            data-val={nodeId1}
            onClick={(_e) => {
              nodeId1 && wftCommon.linkCompany('Bu3', nodeId1)
            }}
            data-uc-id="r0GYWFsZ5x"
            data-uc-ct="span"
          >
            {nameR}
          </span>
        </span>
      )
    }
    return (
      <div key={_y} style={{ marginBottom: '10px' }}>
        {title}
        <br />
        {way}
        {f}
      </div>
    )
  })
}
