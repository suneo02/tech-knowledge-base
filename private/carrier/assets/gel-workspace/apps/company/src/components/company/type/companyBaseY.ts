import { CorpArea } from '@/handle/corp/corpArea'
import { TCorpCategory } from '@/handle/corp/corpType/category'
import { IState } from '@/reducers/type'
import { CorpBasicNumFront } from '@/types/corpDetail'
import { CorpMenuSimpleData } from '@/views/Company/menu'
import { CorpOtherInfo, TCorpDetailSubModule } from 'gel-types'

export type CorpTreeMenuClick = (menuData: string[] | string, e: { selected: boolean; _reRender?: boolean }) => void

export interface CompanyBaseYProps {
  companyname: string
  corpNameIntl?: string
  companyid: string
  basicNum: CorpBasicNumFront
  companycode: string
  companyRegDate
  company: IState['company']
  corpArea: CorpArea | undefined
  corpCategory: TCorpCategory[]
  menuClick: CorpTreeMenuClick
  singleModuleId: string | undefined
  singleModuleOrder?: TCorpDetailSubModule[] // 新增：模块顺序数组
  scrollModuleIds: string[]
  setCorpModuleReadyed: (moduleIds: string[]) => void
  allMenuDataObj: Record<string, CorpMenuSimpleData>
  corpOtherInfo: CorpOtherInfo
  refreshCorpOtherInfo: () => void
}

export interface CompanyBaseProps {
  companyname: string | undefined
  corpNameIntl: string | undefined
  companyid: string | undefined
  basicNum: CorpBasicNumFront
  companycode: string | undefined
  companyRegDate: string | undefined
  company: IState['company']
  corpArea: CorpArea | undefined
  corpCategory: TCorpCategory[]
  menuClick: CorpTreeMenuClick
  singleModuleId: string | undefined
  singleModuleOrder?: TCorpDetailSubModule[]
  scrollModuleIds: IState['company']['scrollModuleIds']
  setCorpModuleReadyed: (moduleIds: string[]) => void
  allMenuDataObj: Record<string, CorpMenuSimpleData>
  corpOtherInfo: CorpOtherInfo
  refreshCorpOtherInfo: () => void
}
