import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Row } from '@wind/wind-ui'
import React from 'react'
import { BaseCorpIntroProps, CorpIntroItem } from './common'

export const HKCorpIntro: React.FC<BaseCorpIntroProps> = ({ headerInfo, companybaseInfo }) => {
  const getEngName = () => {
    return headerInfo.eng_name || companybaseInfo.eng_name
  }

  return (
    <>
      <Row>
        <CorpIntroItem title={intl('448329', '公司英文名')} value={getEngName()} span={24} />
      </Row>

      <Row>
        <CorpIntroItem title={intl('6228', '公司编号')} value={companybaseInfo.biz_reg_no} />
        <CorpIntroItem title={intl('138860', '成立日期')} value={wftCommon.formatTime(companybaseInfo.reg_date)} />
      </Row>

      <Row>
        <CorpIntroItem title={intl('438015', '公司地址')} value={headerInfo.address} span={24} />
      </Row>
    </>
  )
}
