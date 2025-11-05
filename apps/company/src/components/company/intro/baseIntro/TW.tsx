import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Row } from '@wind/wind-ui'
import React from 'react'
import { BaseCorpIntroProps, CorpIntroItem } from './common'

export const TWCorpIntro: React.FC<BaseCorpIntroProps> = ({ headerInfo, companybaseInfo }) => {
  return (
    <>
      <Row>
        <CorpIntroItem title={intl('6228', '公司编号')} value={companybaseInfo.biz_reg_no} />
        <CorpIntroItem title={intl('35779', '注册资本')} value={wftCommon.formatMoney(headerInfo.reg_capital)} />
      </Row>

      <Row>
        <CorpIntroItem title={intl('', '代表人')} value={headerInfo.legal_person_name} />
        <CorpIntroItem title={intl('138860', '成立日期')} value={wftCommon.formatTime(companybaseInfo.reg_date)} />
      </Row>

      <Row>
        <CorpIntroItem title={intl('259200', '公司地址')} value={headerInfo.address} span={24} />
      </Row>
    </>
  )
}
