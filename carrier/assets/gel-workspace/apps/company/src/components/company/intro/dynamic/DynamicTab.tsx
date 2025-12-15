import { pointBuriedNew } from '@/api/configApi'
import { commonBuryList } from '@/api/pointBuried/config'
import { BaiFenSites } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { Spin } from '@wind/wind-ui'
import { CorpBasicInfo } from 'gel-types'
import { CorpDetailDynamicEventTypeTag, getDynamicEventInnerContent } from 'gel-ui'
import { intl } from 'gel-util/intl'
import React, { FC } from 'react'
import { DynamicTabsKey } from './type'

export const DynamicTabBar: FC<{
  companycode: string
  tabKey: DynamicTabsKey
  businessOpportunityInfo: any
  baseInfo: CorpBasicInfo
}> = ({ companycode, tabKey, businessOpportunityInfo, baseInfo }) => {
  return (
    <a
      className="risk-link"
      onClick={() => {
        if (tabKey == 'yuqing') {
          wftCommon.jumpJqueryPage('index.html#/companyNews?nosearch=1&companycode=' + companycode)
        } else if (tabKey === 'shangji') {
          const { creditOpportunities: creditOpportunitiesUrl } = BaiFenSites()
          if (businessOpportunityInfo?.more?.url && creditOpportunitiesUrl) {
            window.open(creditOpportunitiesUrl)
          } else {
            console.log(1)
          }
        } else {
          const { moduleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100276)
          pointBuriedNew(moduleId, { opActive, opEntity: describe })
          wftCommon.jumpJqueryPage(
            'index.html#/SingleCompanyDynamic?companycode=' + companycode + '&companyname=' + baseInfo.corp_name
          )
        }
      }}
      target="_blank"
      data-uc-id="7qpZe61tuDQ"
      data-uc-ct="a"
    >
      {intl('272167', '更多')}
    </a>
  )
}

export const DynamicTabPane: FC<{ mycorpeventlist: any }> = ({ mycorpeventlist }) => {
  const dynamicEvent = (e) => {
    const a = e.currentTarget.querySelector('a')
    if (a) {
      const url = a.getAttribute('href')
      wftCommon.jumpJqueryPage(url)
    }
    e.stopPropagation()
    e.preventDefault()
  }

  const showContent = (type, status, role, eachList) => {
    if (type) {
      const source_id = eachList.event_source_id
      if (type == '招投标公告' && !role) {
        // 单独处理
        return (
          <>
            <a
              className="w-link wi-link-color"
              target="_blank"
              onClick={dynamicEvent}
              href={`index.html?nosearch=1#/biddingDetail?detailid=${wftCommon.formatCont(source_id)}`}
              rel="noreferrer"
              data-uc-id="PFzIF-n2a9C"
              data-uc-ct="a"
            >
              <CorpDetailDynamicEventTypeTag
                content={wftCommon.formatCont(type)}
                data-uc-id="ouKy-vfLS2g"
                data-uc-ct="corpdetaildynamiceventtypetag"
              />
              招投标项目发布新公告
            </a>
          </>
        )
      } else {
        return (
          <>
            <CorpDetailDynamicEventTypeTag
              content={wftCommon.formatCont(type)}
              data-uc-id="xlqNseJSGi-"
              data-uc-ct="corpdetaildynamiceventtypetag"
            />
            {getDynamicEventInnerContent(type, status, role, eachList)}
          </>
        )
      }
    } else {
      return <div className="r-dynamic-event">{intl('132725', '暂无数据')}</div>
    }
  }
  return (
    <div className="dynamic-body dynamic-table">
      {!mycorpeventlist ? (
        <Spin />
      ) : mycorpeventlist && mycorpeventlist.length ? (
        mycorpeventlist.map((item, index) => (
          <div key={'dynamicevent-' + index} className="news-tips dongtai">
            <span className="date">{item.event_date}</span>
            {showContent(item.event_type, item.event_status, item.role, item)}
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
