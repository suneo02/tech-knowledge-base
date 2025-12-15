import { wftCommon } from '@/utils/utils'
import { Spin } from '@wind/wind-ui'
import { CorpDetailDynamicEventTypeTag } from 'gel-ui'
import { intl } from 'gel-util/intl'
import React, { FC } from 'react'

export const BusinessOpportunitiesTabPane: FC<{ businessOpportunityInfo: any }> = ({ businessOpportunityInfo }) => {
  return (
    <div className="dynamic-body dynamic-table">
      {!businessOpportunityInfo ? (
        <Spin />
      ) : businessOpportunityInfo.list?.length ? (
        businessOpportunityInfo.list.map((item, index) => (
          <div key={'dynamicevent-' + index} className="news-tips dongtai">
            <span className="date">{wftCommon.formatTime(item.date)}</span>
            <CorpDetailDynamicEventTypeTag
              content={wftCommon.formatCont(item.tagName)}
              data-uc-id="UdoXLXL9yiA"
              data-uc-ct="corpdetaildynamiceventtypetag"
            />
            <a
              className="w-link wi-link-color"
              target="_blank"
              href={item.url}
              rel="noreferrer"
              data-uc-id="8XRyxMa_GW4"
              data-uc-ct="a"
            >
              {item.tagContent}
            </a>
          </div>
        ))
      ) : (
        <div
          style={{
            textAlign: 'center',
            lineHeight: '90px',
            color: '#999',
          }}
        >
          {intl('132725', '暂无数据')}
        </div>
      )}
    </div>
  )
}
