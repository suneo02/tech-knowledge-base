export interface IFuncMenuItem {
  id: string
  zh: string
  url: string | null
  css?: string
  hot?: boolean
  new?: boolean
  icon?: string
  // 自定义跳转方法，如果不提供则使用默认的url跳转
  buryFunc?: () => void
  navigate?: (item: IFuncMenuItem) => void
  desc?: string
  disabled?: boolean
}

export interface IFuncMenuGroup {
  id: string | number
  zh: string
  list: IFuncMenuItem[]
}
