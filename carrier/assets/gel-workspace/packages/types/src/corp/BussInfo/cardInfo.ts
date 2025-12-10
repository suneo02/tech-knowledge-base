import { CorpAreaCode } from './corpArea'
import { CorpTypeCode } from './corpTypeCode'

export interface CorpCardInfo {
  address: string
  areaCode: CorpAreaCode
  brief: string
  bus_address: string
  cancel_date: string
  corp_id: string
  corp_name: string
  corp_nameTrans?: string
  corp_nameAITransFlag?: boolean
  corp_old_id?: string
  corp_update_time?: string
  emailCount: number
  email_add: string
  eng_name: string
  ent_log: string
  ent_log_v: string
  former_name: {
    corpId: string
    formerName: string
    note: string
    orgType: string
    useFrom: string
    useTo: string
  }[]
  legal_person_id: string
  legal_person_name: string
  legal_person_type: string
  logoThumbnail: string
  official_web: string
  province: string
  reg_address: string
  reg_capital: number
  reg_date: string
  reg_unit: string
  state: string
  tel: string
  telCount: number
  treeId: string
  typeCode: CorpTypeCode
  typeName: string
  websiteCount: number
}
