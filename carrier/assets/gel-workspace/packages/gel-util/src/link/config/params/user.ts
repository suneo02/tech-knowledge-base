import { LinkModule } from '@/link/config/linkModule'
import { CommonLinkParams } from './common'

export enum UserLinkParamEnum {
  AccountsMine = 'myaccounts', // 我的账号
  MyData = 'mylist', // 我的数据
  MyOrders = 'myorders', // 我的订单
  UserNote = 'usernote', // 用户协议
  UserPolicy = 'userpolicy', // 隐私政策
  Exceptions = 'exceptions', // 免责声明
  Contact = 'contact', // 联系我们
}
// 定义每个模块的参数接口
export interface UserLinkParams {
  [LinkModule.USER_CENTER]: {
    type: UserLinkParamEnum
  } & CommonLinkParams
}
