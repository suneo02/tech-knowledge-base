import intl from '@/utils/intl'
import queryString from 'qs'
import React, { useEffect } from 'react'
import { pointBuriedGel } from '../../api/configApi'
import Tables from '../../components/detail/singleTable'
import rows from './columnsConfig'
import styles from './styles/index.module.less'
import useAnnualReportDetail from './useAnnualReportDetail'
import { usePageTitle } from '../../handle/siteTitle'
import { useTranslateService } from '../../hook'

const AnnualDetail = () => {
  const location = window.location
  const param = queryString.parse(location.search, { ignoreQueryPrefix: true })
  const { data, loading } = useAnnualReportDetail()
  const [dataIntl] = useTranslateService(data, true, true)
  usePageTitle('AnnualReportDetail', [dataIntl.baseinfo?.company_name, `${param['year']}${intl('138658', '年度报告')}`])

  useEffect(() => {}, [pointBuriedGel('922602100845', '企业年报', 'yearReportDetail')])
  if (dataIntl.baseinfo) {
    window.company_name = dataIntl.baseinfo.company_name
  }
  return (
    <div className={styles.annualDetail}>
      <div className={styles.titleReport}>
        <span id="reportYear">{String(param['year'])}</span>
        <span>{intl('138658', '年度报告')}</span>
      </div>
      {Object.keys(rows).map((i) => {
        return (
          <div className={styles.eachDiv} key={i}>
            <Tables
              title={rows[i].name}
              horizontal={rows[i].horizontal}
              info={dataIntl[i]}
              isLoading={loading}
              columns={rows[i].columns}
              data-uc-id="DE7p_i9BAs"
              data-uc-ct="tables"
            />
          </div>
        )
      })}
    </div>
  )
}

export default AnnualDetail
