import intl from '@/utils/intl'
import React from 'react'

import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { ActCtrlTag, BeneficiaryTag, ChangeNameTag, RelatedPartyTag } from 'gel-ui'
import { CorpDetailNoColumn } from '../../common/columns.ts'

const ShareholderNameColumn = {
  title: intl('138783', '股东名称'),
  dataIndex: 'shareholder_name',
  key: 'shareholder_name',
  width: '26%',
  align: 'left',
  render: (_txt, row) => (
    <>
      <LinkByRowCompatibleCorpPerson nameKey={'shareholder_name'} idKey={'shareholder_id'} row={row} />
      {row?.benifciary ? <BeneficiaryTag /> : null}
      {row?.act_ctrl ? <ActCtrlTag ctrlType={row?.source === 'A0774' ? 'actual' : 'uncertain'} /> : null}
      {row?.nameChanged ? <ChangeNameTag /> : null}
      {row.actor?.length
        ? // fixme intl
          row.actor.map((num) => <RelatedPartyTag key={num} num={num} />)
        : null}
    </>
  ),
}

export const CountColumn = {
  title: intl('32505', '持股数量'),
  dataIndex: 'number',
  align: 'right',
  width: '22%',
  render: (txt) => {
    return wftCommonType.formatMoney(txt)
  },
}
const PercentageColumn = {
  title: intl('337815', '占总股本比例（%）'),
  dataIndex: 'proportion',
  align: 'right',
  width: '22%',
  render: (txt) => {
    //格式化百分比
    if (parseFloat(txt)) {
      return parseFloat(txt).toFixed(2) + '%'
    } else {
      return '--'
    }
  },
}

export const AnnouncementColumns = [CorpDetailNoColumn, ShareholderNameColumn, CountColumn, PercentageColumn]
