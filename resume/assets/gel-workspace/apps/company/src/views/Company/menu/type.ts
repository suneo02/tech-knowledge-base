import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type.ts'
import { TCorpDetailModuleValue, TCorpDetailSubModule } from '@/handle/corp/detail/module/type.ts'

export interface ICorpMenuData {
  key: string // 菜单项名称
  title: string // 菜单显示文本
  children?: {
    key: string // 子菜单项名称（可选）
    title: string // 子菜单显示文本
    titleStr?: string // 子菜单文字描述字符串（可选）
    titleNum?: string | number | undefined // 子菜单编号（可选）
    parentMenuKey?: string | undefined // 父级菜单键名（可选）
  }[]
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
