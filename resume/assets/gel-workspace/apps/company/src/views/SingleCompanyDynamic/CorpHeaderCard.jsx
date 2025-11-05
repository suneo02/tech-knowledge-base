import { Card, Tag, Tooltip } from '@wind/wind-ui'

import { wftCommon } from '../../utils/utils'
import './CorpHeaderCard.less'
import CompanyLink from '../../components/company/CompanyLink'
import intl from '../../utils/intl'

const CorpHeaderCard = (props) => {
  const { data = {} } = props
  const { corp_name, corp_id, state, ent_log, legal_person_name, legal_person_id, reg_capital, reg_unit, reg_date } = data
  let url = ent_log
  if (wftCommon.isDevDebugger()) {
    url += `?wind.sessionid=${wftCommon.getwsd()}`
  }
  return (
    <Card className="CorpHeaderCard">
      <div className="content">
        <Tooltip  title={<img width="140" src={url} />}>
          <img className="logo" src={url} alt="" width={56} height={56} />
        </Tooltip>

        <div>
          <div style={{ display: 'flex' }} className="dynamic-company-name">
            <CompanyLink name={corp_name} id={corp_id} />
            <Tag className="stateCompany">{state}</Tag>
          </div>

          <p className="text-company-survey">
            <span>
              {intl('138733', '法人')}：{legal_person_name}
            </span>
            <span>
              {intl('35779', '注册资本')}：{wftCommon.formatMoneyTemp(reg_capital, [4, reg_unit])}
            </span>
            <span>
              {intl('261893', '成立日期')}：{wftCommon.formatTime(reg_date)}
            </span>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CorpHeaderCard
