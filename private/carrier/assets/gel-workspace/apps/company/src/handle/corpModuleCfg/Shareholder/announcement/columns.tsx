import intl from '@/utils/intl'
import React from 'react'

import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { ColumnProps } from '@wind/wind-ui-table'
import { ActCtrlTag, BeneficiaryTag, ChangeNameTag, RelatedPartyTag } from 'gel-ui'
import { t } from 'gel-util/intl'
import { CorpDetailNoColumn } from '../../common/columns.ts'

const ShareholderNameColumn: ColumnProps = {
  title: intl('138783', '股东名称'),
  dataIndex: 'shareholder_name',
  key: 'shareholder_name',
  width: '26%',
  align: 'left',
  render: (_txt, row) => (
    <>
      <LinkByRowCompatibleCorpPerson nameKey={'shareholder_name'} idKey={'shareholder_id'} row={row} />
      {row?.benifciary ? <BeneficiaryTag intl={t} /> : null}
      {row?.act_ctrl ? <ActCtrlTag ctrlType={row?.source === 'A0774' ? 'actual' : 'uncertain'} intl={t} /> : null}
      {row?.nameChanged ? <ChangeNameTag intl={t} /> : null}
      {row.actor?.length
        ? // fixme intl
          row.actor.map((num) => <RelatedPartyTag key={num} num={num} intl={t} />)
        : null}
    </>
  ),
}

export const CountColumn: ColumnProps = {
  title: intl('32505', '持股数量'),
  dataIndex: 'number',
  align: 'right',
  width: '22%',
  render: (txt) => {
    return wftCommonType.formatMoney(txt)
  },
}
const PercentageColumn: ColumnProps = {
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

export const AnnouncementColumns: ColumnProps[] = [
  CorpDetailNoColumn,
  ShareholderNameColumn,
  CountColumn,
  PercentageColumn,
]
