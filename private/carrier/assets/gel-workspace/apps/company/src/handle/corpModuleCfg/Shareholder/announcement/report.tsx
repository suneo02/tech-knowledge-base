import { CorpTableCfg } from '@/types/corpDetail/index.ts'
import intl from '@/utils/intl'
import { AnnouncementColumns } from './columns.tsx'
import { AnnouncementDataCallback, AnnouncementExtraParams } from './comp.tsx'

// 企业详情/股东信息/公告披露 报告期 cfg
export const CompanyDetailShareholderAnnouncementReportCfg: CorpTableCfg = {
  enumKey: 'shareholderDisclosure',
  title: intl('312174', '公告披露'),
  cmd: '/detail/company/getnewshareholdertreport',
  downDocType: 'download/createtempfile/getnewshareholdertreport',
  modelNum: 'shareholdertReport',
  modelNumUseTotal: true,
  comment: true,
  menuClick: true,
  numHide: true,
  columns: AnnouncementColumns,

  hideWhenNumZero: true, // 统计数字为零时隐藏
  extraParams: AnnouncementExtraParams,
  dataCallback: AnnouncementDataCallback,
}
