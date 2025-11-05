import React, { useEffect, useRef } from 'react'
import { Timeline } from '@wind/wind-ui'
import intl from '../../../utils/intl'
import queryString from 'qs'
import './progressTimeline.less'
import { wftCommon } from '../../../utils/utils'

function type2jdStage(type) {
  switch (type) {
    case '资格预审公告':
      return intl('257788', '预审阶段')
    case '公开招标公告':
      return intl('257789', '招标阶段')
    case '询价公告':
      return intl('257789', '招标阶段')
    case '竞争性谈判公告':
      return intl('257789', '招标阶段')
    case '单一来源公告':
      return intl('257789', '招标阶段')
    case '邀请招标公告':
      return intl('257789', '招标阶段')
    case '竞争性磋商公告':
      return intl('257789', '招标阶段')
    case '竞价招标公告':
      return intl('257789', '招标阶段')
    case '意向公告':
      return intl('257789', '招标阶段')
    case '中标公告':
      return intl('257808', '结果阶段')
    case '成交公告':
      return intl('257808', '结果阶段')
    case '竞价结果公告':
      return intl('257808', '结果阶段')
    case '开标公告':
      return intl('257808', '结果阶段')
    case '合同及验收公告':
      return intl('257808', '结果阶段')
    case '废标流标公告':
      return intl('257815', '废标流标')
    case '更正公告':
      return ''
    default:
      return '--'
  }
}

const ProgressTimeline = ({ dataList = [] }) => {
  let location = window.location
  let param = queryString.parse(location.search, { ignoreQueryPrefix: true })
  let detailid = param['detailid']
  const selectedRef = useRef(null)

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [detailid, dataList])

  return (
    <div className="progress-timeline">
      <Timeline>
        {dataList.map((t) => (
          <div
            key={t.detail_id}
            ref={detailid === t.detail_id ? selectedRef : null}
            className={detailid === t.detail_id ? 'timeline__selected' : ''}
          >
            <Timeline.Item>
              <p className="progress-item">{t.announcement_date ? t.announcement_date.split(' ')[0] : '--'}</p>
              <p className="progress-item">{type2jdStage(t.type)}</p>
              <p className="progress-item">
                <a
                  href={`index.html?type=bid&detailid=${t.detail_id}&from=${wftCommon.isBaiFenTerminalOrWeb() ? 'baifen' : ''}#/biddingDetail`}
                >
                  {t.type ? t.type : '--'}
                </a>
              </p>
            </Timeline.Item>
          </div>
        ))}
      </Timeline>
    </div>
  )
}

export default ProgressTimeline
