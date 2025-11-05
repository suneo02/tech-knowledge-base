import React, { useEffect, useState } from 'react'
import { getCorpHeaderInfo } from '../../api/companyApi'
import Table from '@wind/wind-ui-table'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import { parseQueryString } from '../../lib/utils'
import './style/CompanyNews.less'
import { useAsync } from '../../utils/api'
import { usePageTitle } from '../../handle/siteTitle'
import { getNewsInternal } from '../../api/corp/event'

function formatAdviceTime(t) {
  if (t && 'null' != t.toLowerCase()) {
    var e = t.replace(/[TZ]/g, ' '),
      t = e.split(':')
    return (e = 3 == t.length ? t[0] + ':' + t[1] : e)
  }
  return '--'
}

function CompanyNews() {
  const qsParam = parseQueryString()
  const companycode = qsParam['companycode']

  const [handleGetCorpInfo, corpInfoData] = useAsync(getCorpHeaderInfo)

  usePageTitle('PublicOpinionDetail', corpInfoData?.Data?.corp_name)
  useEffect(() => {
    handleGetCorpInfo(companycode)
  }, [])
  const [result, setResult] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [total, setTotal] = useState(0)
  const is_terminal = wftCommon.usedInClient()

  const locale = {
    emptyText: dataLoaded ? intl('132725', '暂无数据') : 'loading...',
  }
  const pageProps = {
    current: pageNo,
    pageSize: 10,
    total: total > 5000 ? 5000 : total,
    onChange: (page) => pageChange(page),
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }
  const pageChange = (page) => {
    if (window.en_access_config) {
      if (wftCommon.globalTranslating.size) return
    }
    setPageNo(page)
  }
  const columns = [
    {
      title: intl('66742', '公司舆情'),
      dataIndex: 'news',
      width: '100%',
      render: (key, data) => {
        const { title, date, emotion, tagName, siteName, mediaId, level } = data
        let tagCss = ''
        if (emotion == '负面') {
          if (tagName) {
            tagCss = 'companyNews-tag-bad'
            if (level > 2 && level < 6) {
              tagCss += level
            }
          }
        }
        return (
          <div className="companyNews-item">
            <div
              className="companyNews-title"
              onClick={() => {
                gotoNews(data)
              }}
            >
              {title}
            </div>
            {tagName ? <div className={` companyNews-tag ${tagCss} `}>{tagName}</div> : null}
            <div>
              <span className="companyNews-date">{date}</span>
              <span className="companyNews-site">{siteName}</span>
            </div>
          </div>
        )
      },
    },
  ]

  const gotoNews = (t) => {
    let url = ''
    if (is_terminal) {
      if (t.title && t.title.indexOf && t.title.indexOf('舆情数据已达最新上限') > -1) {
        url = '//SmartReaderServer/SmartReaderWeb/SmartReader/?type=23&id=!CommandParam[5109]'
      } else {
        url = '//SmartReaderServer/SmartReaderWeb/SmartReader/?type=23&id=' + t.mediaId
      }
    } else {
      url = t.url
    }
    url && window.open(url)
  }

  const fetchData = () => {
    getNewsInternal(companycode, {
      __primaryKey: companycode,
      pageNo: pageNo - 1,
      pageSize: 10,
      check: false,
    }).then(
      (res) => {
        setDataLoaded(true)
        res && res.Data && res.Data.total && setTotal(res.Data.total)
        if (res.ErrorCode == '0' && res.Data && res.Data.legalRiskEvents && res.Data.legalRiskEvents.length) {
          const data = []
          res.Data.legalRiskEvents.map((tt) => {
            const t = tt ? tt : {}
            const item = {
              title: t.title || '--',
              date: t.date ? formatAdviceTime(t.date) : '--',
              url: t.url || '',
              emotion: t.mediaRelatedInfo?.emotion || '',
              tagName: t.mediaRelatedInfo?.tagName || '',
              level: t.mediaRelatedInfo?.level || '',
              siteName: t.siteName || '',
              mediaId: t.mediaId,
            }
            data.push(item)
          })
          setResult(data)
          if (window.en_access_config) {
            const tmp = [...data]
            wftCommon.zh2en(data, (res) => {
              res.map((t, idx) => {
                t.emotion = data[idx].emotion
              })
              setResult(res)
            })
          }
        }
      },
      () => {
        setDataLoaded(true)
      }
    )
  }

  useEffect(() => {
    fetchData()
  }, [pageNo])

  return (
    <div className="companyNews-container" style={!result?.length ? { height: '50%' } : {}}>
      <Table
        key={'companynews'}
        locale={locale}
        columns={columns}
        pagination={total > 10 ? pageProps : false}
        loading={!dataLoaded}
        dataSource={result}
        bordered="dotted"
      />
    </div>
  )
}

export default CompanyNews
