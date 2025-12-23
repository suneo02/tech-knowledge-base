import intl from '@/utils/intl'
import { AnnouncementColumns } from './columns.tsx'
import { AnnouncementDataCallback, AnnouncementExtraParams } from '../announcement/comp.tsx'
import { ICorpTableCfg } from '@/components/company/type'
import { ECorpDetailTable } from 'gel-types'

// 企业详情/股东信息/公告披露 海外、香港企业-股东信息接股票的大股东报表
export const CompanyDetailMajorShareholderCfg: ICorpTableCfg = {
  enumKey: ECorpDetailTable.ShareholderMajorShareholderDisclosure,
  title: intl('312174', '公告披露'),
  cmd: '/detail/company/getnewbigshareholder',
  downDocType: 'download/createtempfile/getnewbigshareholder',
  modelNum: 'majorShareholderCount',
  comment: true,
  menuClick: true,
  numHide: true,
  columns: AnnouncementColumns,

  hideWhenNumZero: true, // 统计数字为零时隐藏
  extraParams: AnnouncementExtraParams,
  dataCallback: AnnouncementDataCallback,
}
