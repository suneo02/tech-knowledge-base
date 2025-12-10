import { getEvaluationDetail } from '@/api/singleDetail.ts'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { isNil } from 'lodash'
import queryString from 'qs'
import { default as React, useEffect, useState } from 'react'
import Tables from '../../components/detail/table'
import intl from '../../utils/intl'
import './index.less'
import { evaluationDetailRows } from './rows'

function EvaluationDetail(_props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const breadCrumb = (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span
          className="last-rank"
          onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
          data-uc-id="mMSv0r9RD_"
          data-uc-ct="span"
        >
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{intl('216400', '询价评估')}</span>
      </div>
    </div>
  )

  const location = window.location
  const param = queryString.parse(location.search, { ignoreQueryPrefix: true })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getEvaluationDetail({
          reportName: param['reportName'],
          __primaryKey: param['id'],
        })
        if (res && Number(res.ErrorCode) === 0) {
          const data = res.Data || res.data || {}
          if (!isNil(data)) {
            setData(res.Data || res.data)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="evaluation-detail">
      {breadCrumb}
      {
        <Tables
          info={data}
          isLoading={loading}
          // @ts-expect-error ttt
          rows={evaluationDetailRows[param['dataType'] || '1']}
          title={intl('216400')}
        />
      }
    </div>
  )
}

export default EvaluationDetail
