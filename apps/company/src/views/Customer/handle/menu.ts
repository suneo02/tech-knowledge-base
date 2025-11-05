import { PageLocation } from 'gel-util/misc'
import { usePageTitle } from '../../../handle/siteTitle'
import intl from '../../../utils/intl'

// 所有可能的菜单key类型
// 包括普通菜单项和特殊处理菜单项(collect和userpolicy)
export type TCustomerMenuKey =
  | 'myaccounts'
  | 'collect' // 特殊处理：跳转到收藏页面
  | 'mylist'
  | 'myorders'
  | 'usernote'
  | 'userpolicy' // 隐私政策
  | 'exceptions'
  | 'contact'
  | 'bindphone'

// 页面标题映射，不包含collect因为它会跳转到其他页面
export const customerMenuPageMap: Omit<Record<TCustomerMenuKey, PageLocation>, 'collect'> = {
  myaccounts: 'UserCenterAccount',
  mylist: 'UserCenterData',
  myorders: 'UserCenterOrders',
  usernote: 'UserCenterAgreement',
  userpolicy: 'UserCenterPrivacy',
  exceptions: 'UserCenterDisclaimer',
  contact: 'UserCenterContact',
  bindphone: null,
}

export const useCustomerPageTitle = (key: TCustomerMenuKey): void => {
  usePageTitle(customerMenuPageMap[key])
}

// 可以作为当前菜单的key类型
// 排除了需要特殊处理的'userpolicy'和'collect'
// 因为这两种菜单项不会成为当前显示的菜单
export type TCurrentMenuKey = Exclude<TCustomerMenuKey, 'userpolicy' | 'collect'>

// 基础菜单属性
// 所有菜单都具有的公共属性
export type TBaseCustomerMenu = {
  name: string // 菜单显示名称
  buryId: number // 埋点ID
}

// 普通菜单类型
// 可以作为当前菜单显示的菜单项
// 这些菜单项会更新URL和currentMenu状态
export type TCurrentMenu = TBaseCustomerMenu & {
  key: TCurrentMenuKey
}

// 特殊菜单类型
// 包括需要特殊处理的菜单项
// 这些菜单项不会更新currentMenu状态，而是触发特定行为
export type TSpecialMenu = TBaseCustomerMenu & {
  key: 'userpolicy' | 'collect'
}

// 完整的菜单类型
// 联合类型包含了所有可能的菜单项
// 在handleSelect中会根据menu.key的不同执行不同的处理逻辑
export type TCustomerMenu = TCurrentMenu | TSpecialMenu

export const customerMenus: TCustomerMenu[] = [
  {
    key: 'myaccounts',
    name: intl('20976', '我的账号'),
    buryId: 922602101046,
  },
  {
    key: 'collect',
    name: intl('14896', '我的收藏'),
    buryId: 922602101048,
  },
  {
    key: 'mylist',
    name: intl('141995', '我的数据'),
    buryId: 922602101059,
  },
  {
    key: 'myorders',
    name: intl('153389', '我的订单'),
    buryId: 922602101060,
  },
  {
    key: 'usernote',
    name: intl('209659', '用户协议'),
    buryId: 922602101061,
  },
  {
    key: 'userpolicy',
    name: intl('242146', '隐私政策'),
    buryId: 922602101062,
  },
  {
    key: 'exceptions',
    name: intl('23348', '免责声明'),
    buryId: 922602101064,
  },
  {
    key: 'contact',
    name: intl('26588', '联系我们'),
    buryId: 922602101064,
  },
  {
    key: 'bindphone',
    name: window.en_access_config ? 'Bind Account' : '绑定手机',
    buryId: 922602101064,
  },
]
