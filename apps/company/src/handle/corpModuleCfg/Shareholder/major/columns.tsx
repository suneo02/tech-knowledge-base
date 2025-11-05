import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Tag } from '@wind/wind-ui'
import React from 'react'

import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ActCtrlTag, BeneficiaryTag, ChangeNameTag } from 'gel-ui'
import { CorpDetailNoColumn } from '../../common/columns.ts'

const TagLocal = ({ color, children }) => (
  // @ts-expect-error ttt
  <Tag size="mini" type="primary" color={color} style={{ margin: 0, marginInlineStart: '6px' }}>
    {children}
  </Tag>
)

const ShareholderNameColumn = {
  title: intl('138783', '股东名称'),
  dataIndex: 'shareholder_name',
  key: 'shareholder_name',
  width: '26%',
  align: 'left',
  render: (txt, row) => (
    <>
      <LinkByRowCompatibleCorpPerson nameKey={'shareholder_name'} idKey={'shareholder_id'} row={row} />
      {row?.benifciary ? <BeneficiaryTag /> : null}
      {row?.act_ctrl ? <ActCtrlTag ctrlType={row?.source === 'A0774' ? 'actual' : 'uncertain'} /> : null}
      {row?.nameChanged ? <ChangeNameTag /> : null}
      {row.actor?.length
        ? // fixme intl
          row.actor.map((num) => (
            <TagLocal key={num} color="color-1">
              关联方/一致行动人{num}
            </TagLocal>
          ))
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
    try {
      if (txt == null) {
        return '--'
      }
      const numStr = wftCommon.formatNumberWithLocale(txt, 2)
      if (numStr === '0') {
        return '--'
      }
      return numStr
    } catch (e) {
      console.error(e)
      return '--'
    }
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
    try {
      if (txt == null) {
        return '--'
      }
      const numStr = wftCommon.formatNumberWithLocale(txt, 2)
      if (numStr === '0') {
        return '--'
      }
      return numStr
    } catch (e) {
      console.error(e)
      return '--'
    }
  },
}

export const AnnouncementColumns = [
  CorpDetailNoColumn,
  ShareholderNameColumn,
  CountColumn,
  PercentageColumn,
  inCountColumn,
]
