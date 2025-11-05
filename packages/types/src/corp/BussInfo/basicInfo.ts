import { CorpAreaCode } from './corpArea'
import { CorpOrganizationType } from './corpOrganizationType'
import { CorpTypeCode } from './corpTypeCode'
import { CorpTypeCodeTitle } from './corpTypeCodeTitle'

interface GbIndustry {
  industryCode: string
  industryName: string
  type: string
  windId: string
}

interface UsedName {
  orgType: string
  useFrom: string
  useTo: string
  used_name: string
  usedEnName?: string
}

export interface XxIndustry {
  industryCode: string
  industryName: string
  type: string
  windId: string
}

interface IndustryList {
  [key: string]: XxIndustry[]
}

interface CorpAnotherNameInfo {
  corpId: string
  formerName: string
  note: string
  orgType: string
  useFrom: string
  useTo: string
}

export type CorpAnotherNameList = {
  type: string
  anotherNames: CorpAnotherNameInfo[]
}[]

type CorpAnotherNameMap = Record<string, CorpAnotherNameInfo[]>

export interface CorpBasicInfo {
  abbreviation?: string
  anotherNames: null | CorpAnotherNameList | CorpAnotherNameMap
  areaCode: CorpAreaCode
  biz_reg_no: string
  bus_address?: string
  business_scope?: string
  cancel_date?: string
  configType: CorpOrganizationType
  corp_id: string
  corp_name: string
  corp_old_id?: string
  corp_type: CorpTypeCodeTitle
  corp_type_id: CorpTypeCode | number // 返回的 type code 全是数字类型
  credit_code: string
  domainCount: number
  endowment_num?: number
  employee_num?: number
  eng_name?: string
  formerNameList: string[]
  gbIndustryList: GbIndustry[]
  industryGbFold?: string
  industryWindFold?: string
  industryWindFoldCode?: string
  issue_date?: string
  legal_person_id?: string
  legal_person_name?: string
  legal_person_type?: string
  mailCount: number
  oper_period_begin?: string
  oper_period_end?: string
  org_code?: string
  overseasCorpIndustryList: {
    corpId: string
    industryCode: string
    industryName: string
    isMain: string
  }[]
  paid_in_capital?: number
  paid_in_capital_currency?: string
  paid_in_capital_currency_name?: string
  postal_address?: string
  province: string
  reg_address: string
  reg_authority?: string
  reg_capital?: number
  reg_date: string
  reg_unit?: string
  reg_unit_name?: string

  /**
   * 举办单位
   */
  organizingEntity?: string
  revokeDate?: string
  revokeOrCancelDate?: string
  scale?: string
  scaleAll?: string
  state: string
  taxIdNo?: string
  taxQualiType?: string
  telCount: number
  usednames: UsedName[]
  xxIndustryList: IndustryList
  xxIndustryListEn?: string
  registerPark?: string
  registerParkId?: string
  officePark?: string
  officeParkId?: string
  date_ppproved?: string
  entity_type?: string
  simplified_chinese?: string
  remark?: string
  act_contro_id?: string
  act_contro_name?: string
  jurisdiction?: string
  industry_gb?: string
  industry_name?: string
  brief?: string
  seIndustriesCount?: number // 战新产业数量
}
