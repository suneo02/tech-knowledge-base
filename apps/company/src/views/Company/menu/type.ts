import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type.ts'
import { TCorpDetailModuleValue, TCorpDetailSubModule } from 'gel-types'

export interface CorpMenuData {
  key: string // 菜单项名称
  title: string // 菜单显示文本
  titleStr?: string // 菜单文字描述字符串（可选）
  titleNum?: string | number | undefined // 菜单编号（可选）
  parentMenuKey?: string | undefined // 父级菜单键名（可选）
  children?: CorpMenuData[]
}

export type ICorpMenuModuleCfg = {
  hide?: boolean
  title: string
  numArr: Array<Array<keyof ICorpBasicNumFront> | keyof ICorpBasicNumFront | true>
  showList: TCorpDetailSubModule[]
  showName: string[]
  fnList?: any
}

export type ICorpMenuModuleCfgNew = {
  hide?: boolean
  title: string
  children: {
    countKey: Array<keyof ICorpBasicNumFront> | keyof ICorpBasicNumFront | true
    showModule: TCorpDetailSubModule
    showName: string
  }[]
}
export type ICorpMenuCfg = Partial<Record<TCorpDetailModuleValue, ICorpMenuModuleCfg>>
