import { isEn } from 'gel-util/intl'
import { LinkModule, UserLinkParamEnum } from 'gel-util/link'

export interface UserMenuItem {
  id: number | string
  zh: string
  en?: string
  url?:
    | {
        module: LinkModule
        params?: Record<string, unknown>
      }
    | string
  onClick?: () => void
  hideInWeb?: boolean
  hideInTerminal?: boolean
}

export const UserMenusRaw: UserMenuItem[] = [
  {
    id: 20977,
    zh: '我的账户',
    url: {
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.AccountsMine,
      },
    },
  },
  {
    id: 14896,
    zh: '我的收藏',
    url: {
      module: LinkModule.COMPANY_DYNAMIC,
      params: {
        keyMenu: 1,
        nosearch: 1,
      },
    },
  },
  {
    id: 141995,
    zh: '我的数据',
    url: {
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.MyData,
      },
    },
  },
  {
    id: 153389,
    zh: '我的订单',
    url: {
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.MyOrders,
      },
    },
  },
  {
    id: 452995,
    zh: '用户协议',
    url: {
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.UserNote,
      },
    },
  },
  {
    id: 26588,
    zh: '联系我们',
    url: {
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.Contact,
      },
    },
  },
  // {
  //   // FIXME 多语言中新增
  //   id: -1,
  //   zh: '绑定手机',
  //   url: {
  //     module: LinkModule.USER_CENTER,
  //     params: {
  //       type: UserLinkParamEnum.AccountsMine,
  //     },
  //   },
  // },
  {
    id: '',
    zh: isEn() ? 'Help Center' : '帮助中心',
    url: '//UnitedWebServer/helpcenter/helpCenter/redirect/document?id=30',
    hideInWeb: true,
  },
  {
    id: 21828,
    zh: '退出登录',
    url: 'windLogin.html',
    hideInTerminal: true,
  },
]
