import { getPrefixUrl, handleAppendUrlPath } from '../handle'

export const UserLinkEnum = {
  AccountsMine: 'myaccounts', // 我的账号
  MyCollect: 'companyDynamic', // 我的收藏
  MyData: 'mylist', // 我的数据
  MyOrders: 'myorders', // 我的订单
  UserNote: 'usernote', // 用户协议
  UserPolicy: 'userpolicy', // 隐私政策
  Exceptions: 'exceptions', // 免责声明
  Contact: 'contact', // 联系我们
}

/**
 * 拼接用户中心 url 根据 submodule
 */
export const getUserLinkBySubModule = ({ subModule, params, env }) => {
  if (!subModule) {
    return null
  }
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )

  baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
  if (subModule === UserLinkEnum.MyCollect) {
    baseUrl.hash = `#/${subModule}` // 设置哈希值
  } else {
    // TODO 此处待优化，query参数不能放在 hash 后面，但是页面的链接解析也有问题，此处和页面的链接解析需要一同更改
    baseUrl.hash = `#/customer?type=${subModule}` // 设置哈希值
  }
  baseUrl.search = new URLSearchParams(params).toString()

  return baseUrl.toString()
}
