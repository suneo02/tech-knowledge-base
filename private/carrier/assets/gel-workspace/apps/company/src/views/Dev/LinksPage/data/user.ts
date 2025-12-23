import { LinksModule, UserLinkEnum } from '@/handle/link'

export const UserPageData = [
  {
    title: '我的账号',
    subModule: UserLinkEnum.AccountsMine,
    module: LinksModule.USER,
  },
  {
    title: '我的收藏',
    subModule: UserLinkEnum.MyCollect,
    module: LinksModule.USER,
  },
  {
    title: '我的数据',
    subModule: UserLinkEnum.MyData,
    module: LinksModule.USER,
  },
  {
    title: '我的订单',
    subModule: UserLinkEnum.MyOrders,
    module: LinksModule.USER,
  },
  {
    title: '用户协议',
    subModule: UserLinkEnum.UserNote,
    module: LinksModule.USER,
  },
  {
    title: '隐私政策',
    subModule: UserLinkEnum.UserPolicy,
    module: LinksModule.USER,
  },
  {
    title: '免责声明',
    subModule: UserLinkEnum.Exceptions,
    module: LinksModule.USER,
  },
  {
    title: '联系我们',
    subModule: UserLinkEnum.Contact,
    module: LinksModule.USER,
  },

  {
    title: 'vip默认',
    module: LinksModule.VIP,
  },
  {
    title: 'vip国内',
    module: LinksModule.VIP,
    ifOversea: false,
  },
  {
    title: 'vip海外',
    module: LinksModule.VIP,
    ifOversea: true,
  },
]
