import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type'
import { TCorpCategory } from '@/handle/corp/corpType/category'
import { CorpOtherInfo } from 'gel-types'

export interface CompanyBaseYProps {
  companyname: string
  companyid: string
  basicNum: ICorpBasicNumFront
  companycode: string
  companyRegDate
  company
  corpArea
  corpCategory: TCorpCategory[]
  menuClick
  singleModuleId
  singleModuleOrder?: string[] // 新增：模块顺序数组
  scrollModuleIds: any[]
  setCorpModuleReadyed
  allMenuDataObj
  corpOtherInfo: CorpOtherInfo
  refreshCorpOtherInfo: () => void
}
