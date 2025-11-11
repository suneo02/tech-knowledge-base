import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'

import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ActCtrlTag, BeneficiaryTag, ChangeNameTag, RelatedPartyTag } from 'gel-ui'
import { formatNumber } from 'gel-util/format'
import { t } from 'gel-util/intl'
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
      {row?.benifciary ? <BeneficiaryTag intl={t} /> : null}
      {row?.act_ctrl ? <ActCtrlTag ctrlType={row?.source === 'A0774' ? 'actual' : 'uncertain'} intl={t} /> : null}
      {row?.nameChanged ? <ChangeNameTag intl={t} /> : null}
      {row.actor?.length
        ? // fixme intl
          row.actor.map((num) => <RelatedPartyTag num={num} intl={t} />)
        : null}
    </>
  ),
}

export const CountColumn = {
  title: intl('106222', '直接持股数量'),
  dataIndex: 'number',
  align: 'right',
  width: '22%',
  render: (txt) => {
    return formatNumber(txt, {
      decimalPlaces: 0,
      useThousandSeparator: true,
    })
  },
}
const PercentageColumn = {
  title: intl('420033', '占已发行普通股比例（%）'),
  dataIndex: 'proportion',
  align: 'right',
  width: '22%',
  render: (txt) => wftCommon.formatPercent(txt),
}

const inCountColumn = {
  title: intl('106223', '间接持股数量'),
  dataIndex: 'indirectNumber',
  align: 'right',
  width: '22%',
  render: (txt) => {
    return formatNumber(txt, {
      decimalPlaces: 0,
      useThousandSeparator: true,
    })
  },
}

export const AnnouncementColumns = [
  CorpDetailNoColumn,
  ShareholderNameColumn,
  CountColumn,
  PercentageColumn,
  inCountColumn,
]
