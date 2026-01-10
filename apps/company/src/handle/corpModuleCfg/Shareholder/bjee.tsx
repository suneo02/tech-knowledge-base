import intl from '@/utils/intl'
import { AnnouncementDataCallback, AnnouncementExtraParams } from './announcement/comp.tsx'

import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { CorpTableCfg } from '@/types/corpDetail/index.ts'
import { ColumnProps } from '@wind/wind-ui-table'
import { ActCtrlTag, BeneficiaryTag } from 'gel-ui'
import { formatNumber, formatPercent } from 'gel-util/format'
import { t } from 'gel-util/intl'
import React from 'react'
import { CorpDetailNoColumn } from '../common/columns.ts'

const ShareholderNameColumn: ColumnProps = {
  title: intl('138783', '股东名称'),
  dataIndex: 'shareholder_name',
  key: 'shareholder_name',
  width: '50%',
  align: 'left',
  render: (_txt, row) => (
    <>
      <LinkByRowCompatibleCorpPerson nameKey={'shareholder'} row={row} />
      {row?.benifciary ? <BeneficiaryTag intl={t} /> : null}
      {row?.actContrl ? <ActCtrlTag ctrlType={'actual'} intl={t} /> : null}
    </>
  ),
}

export const CountColumn: ColumnProps = {
  title: intl('32505', '持股数量'),
  dataIndex: 'number',
  align: 'right',
  width: '26%',
  render: (txt, _row) => {
    return formatNumber(txt)
  },
}
const PercentageColumn: ColumnProps = {
  title: intl('448875', '持股比例（%）'),
  dataIndex: 'percentage',
  align: 'right',
  width: '26%',
  render: (txt, _row) => formatPercent(txt),
}

// 企业详情/股东信息/公示信息- 来源北交所
export const CompanyDetailBJEEShareholderCfg: CorpTableCfg = {
  enumKey: 'shareholderMajorShareholderDisclosure',
  title: intl('0', '公示信息'),
  cmd: '/detail/company/getShareholderByBJEE',
  downDocType: 'download/createtempfile/getShareholderByBJEE',
  modelNum: 'bjeeShareholdersCount',
  comment: true,
  menuClick: true,
  columns: [CorpDetailNoColumn, ShareholderNameColumn, CountColumn, PercentageColumn],

  hideWhenNumZero: true, // 统计数字为零时隐藏
  extraParams: AnnouncementExtraParams,
  dataCallback: AnnouncementDataCallback,
}
