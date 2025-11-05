/**
 * 企业详情 基本信息 统计数字
 */

import { CorpBasicNumBoolFlag } from './common'

export interface CorpBasicNumBaseInfo {
  vietnamCorpIndustryNum: number // 越南企业所属行业

  businessregisterCount: number // 股东信息-工商登记
  shareholdertReport: CorpBasicNumBoolFlag // 股东信息-公告披露-定期
  shareholdertUnregular: CorpBasicNumBoolFlag // 股东信息-公告披露-非定期
  majorShareholderCount: number // 股东信息-公告披露-大股东
  bjeeShareholdersCount: number // 股东信息-公示信息-来源北交所

  actualcontrollerPublishCount: number // 实际控制人-公告披露
  actualcontrollerCalcCount: number // 实际控制人-疑似实控人
  shareholder_change_num: number // 股东变更
  new_branch_num: number // 分支机构

  e_holdingEnterprise_count: 0 | 1 // 控股企业（0-无；1-有）

  foreign_invest_num: number // 对外投资
  beneficialOwner: number // 受益所有人
  beneficialNaturalPerson: number // 受益自然人
  beneficialInstitutions: number // 受益机构
  lastNotice: number // 主要人员-最新公示
  industrialRegist: number // 主要人员-工商登记
  coreteam_num: number // 核心团队
  group_main_num: number // 集团系-主体公司
  group_membercorp_num: number // 集团系-成员公司
  headerquarters_num: number // 总公司
  competitor: number // 竞争对手
  change_record_num: number // 工商变更
  tax_payer_num: number // 纳税人信息

  shareholder_contribution_num: number // 企业公示-股东及出资
  share_change_num: number // 企业公示-股权变更
  annual_num: number // 企业年报
}
