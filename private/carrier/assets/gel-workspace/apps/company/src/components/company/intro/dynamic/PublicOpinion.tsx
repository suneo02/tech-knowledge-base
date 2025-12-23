import { wftCommon } from '@/utils/utils'
import { Link, Spin } from '@wind/wind-ui'
import { CorpDetailPublicSentimentTag } from 'gel-ui'
import { intl } from 'gel-util/intl'
import React, { FC } from 'react'
import { formatAdviceTime } from '../handle/misc'

export const PublicOpinionTabPane: FC<{ legalRiskEvents: any; companycode: string }> = ({
  legalRiskEvents,
  companycode,
}) => {
  const newsopen = (item) => {
    const id = item.mediaId
    const title = item.title
    if (id) {
      const url = 'http://SmartReaderServer/SmartReaderWeb/SmartReader/?type=23&id=' + id + '&fav=1'
      if (window.external && window.external.ClientFunc) {
        window.external.ClientFunc(
          JSON.stringify({
            func: 'command',
            isGlobal: 1,
            cmdid: '29979',
            url: url,
            title: title || '',
            disableuppercase: 1,
          })
        )
      } else {
        window.open(url, '_newTab' + new Date().valueOf())
      }
    } else {
      window.open(item.url)
    }
  }
  return (
    <div className="dynamic-body">
      {!legalRiskEvents ? (
        !companycode ? (
          <div
            style={{
              textAlign: 'center',
              lineHeight: '90px',
              color: '#999',
            }}
          >
            {intl('132725', '暂无数据')}
          </div>
        ) : (
          <Spin />
        )
      ) : legalRiskEvents && legalRiskEvents.length ? (
        legalRiskEvents.map((item, index) => (
          <div key={'legaldiv-' + index} className="news-tips">
            <span className="date">{formatAdviceTime(item.releaseTime).split(' ')[0]}</span>
            {item.mediaRelatedInfo && item.mediaRelatedInfo.tagName ? (
              <CorpDetailPublicSentimentTag
                emotion={item.mediaRelatedInfo.emotion}
                level={item.mediaRelatedInfo.level}
                content={item.mediaRelatedInfo.tagName}
                data-uc-id="9YS-hvobG7A"
                data-uc-ct="corpdetailpublicsentimenttag"
              />
            ) : null}
            <Link
              // @ts-expect-error ttt
              title={item.title}
              target="_blank"
              onClick={() => newsopen(item)}
              data-uc-id="NOX5tEvomu"
              data-uc-ct="link"
            >
              {wftCommon.formatCont(item.title)}
            </Link>
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
