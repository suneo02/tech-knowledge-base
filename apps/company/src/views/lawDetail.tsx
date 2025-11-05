import queryString from 'qs'
import React, { useEffect, useState } from 'react'
import { getLegalDetail } from '../api/lawDetailApi'
import CourtAnnouncement from '../components/lawDetail/courtAnnouncement'
import CourtSession from '../components/lawDetail/courtsession'
import Discredit from '../components/lawDetail/discredit'
import ExecutePerson from '../components/lawDetail/executedperson'
import Highconsume from '../components/lawDetail/highconsume'
import Judgment from '../components/lawDetail/judgment'
import ReachingAnnouncement from '../components/lawDetail/ReachingAnnouncement'
import intl from '../utils/intl'

import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { useTranslateService } from '../hook'
import './lawDetail.less'

function LawDetail(props) {
  const [reportName, setReportName] = useState(null)
  const [data, setData] = useState(null)
  const [dataIntl] = useTranslateService(data, true, true)

  const [loading, setLoading] = useState(true)

  const LawsuitRisks = {
    CourtSession: {
      // 开庭公告
      component: <CourtSession info={dataIntl} isLoading={loading} />,
    },
    Discredit_V1: {
      // 失信被执行人
      component: <Discredit info={dataIntl} isLoading={loading} />,
    },
    ExecutedPerson_V1: {
      // 被执行人
      component: <ExecutePerson info={dataIntl} isLoading={loading} />,
    },
    CourtAnnouncement: {
      // 法院公告
      component: <CourtAnnouncement info={dataIntl} isLoading={loading} />,
    },
    RestrictHighConsume_V1: {
      // 限制高消费
      component: <Highconsume info={dataIntl} isLoading={loading} />,
    },
    Judgment: {
      // 裁判文书
      component: <Judgment info={dataIntl} isLoading={loading} />,
    },
    ReachingAnnouncement: {
      //送达公告
      component: <ReachingAnnouncement info={dataIntl} isLoading={loading} />,
    },
  }

  const lawName = {
    CourtSession: {
      // 开庭公告
      name: intl('138657', '开庭公告'),
    },
    Discredit_V1: {
      // 失信被执行人
      name: intl('283600', '失信被执行人'),
    },
    ExecutedPerson_V1: {
      // 被执行人
      name: intl('138592', '被执行人'),
    },
    CourtAnnouncement: {
      // 法院公告
      name: intl('138226', '法院公告'),
    },
    RestrictHighConsume_V1: {
      // 限制高消费
      name: intl('209064', '限制高消费'),
    },
    Judgment: {
      // 裁判文书
      name: intl('138731', '裁判文书'),
    },
    ReachingAnnouncement: {
      //送达公告
      name: intl('204947', '送达公告'),
    },
  }

  const breadCrumb = wftCommon.isBaiFenTerminalOrWeb() ? null : (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span className="last-rank" onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{reportName ? lawName[reportName].name : '--'}</span>
      </div>
    </div>
  )

  useEffect(() => {
    const fetchData = async () => {
      const { location } = props.history
      const param = queryString.parse(location.search, { ignoreQueryPrefix: true })
      setReportName(param['reportName'])

      try {
        const res = await getLegalDetail(param['id'], param['reportName'])
        if (res && Number(res.ErrorCode) === 0) {
          const responseData = res.Data || res.data
          setData(responseData)
        }
      } catch (error) {
        console.error('Failed to fetch legal detail:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="law-detail">
      {breadCrumb}
      {reportName ? LawsuitRisks[reportName].component : null}
    </div>
  )
}

export default LawDetail
