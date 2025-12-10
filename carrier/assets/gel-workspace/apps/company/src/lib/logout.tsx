import { isStaging } from '@/utils/env'
import { localStorageManager, sessionStorageManager } from '@/utils/storage'
import { WindSessionHeader, isWebTest } from 'gel-util/env'
import { loginByToken } from '../api/userApi'
import { apiGetPublicKey } from '../components/HeaderHasUser/UserInfoMenu/BindContactModal/api'
import { wftCommon } from '../utils/utils'
import global from './global'
import { encryptData } from './utils'
// import { getPrefixUrl, getUrlByLinkModule, LinksModule } from '@/handle/link'

// 用于跟踪 logout 状态的变量
let isLoggingOut = false
let logoutPromise: Promise<void> | null = null

/**
 * 403/401 登出逻辑处理
 * @returns Promise<void> 登出/自动登录/不处理的 Promise
 */
export const logout = async () => {
  // 如果已经在进行登出操作，直接返回现有的 Promise
  if (isLoggingOut && logoutPromise) {
    return logoutPromise
  }

  const is_terminal = wftCommon.usedInClient()
  const is_dev = wftCommon.isDevDebugger()
  // 终端内，不处理
  if (is_terminal || is_dev) return

  // 设置登出状态
  isLoggingOut = true

  // 创建新的 logout Promise
  logoutPromise = new Promise<void>((resolve) => {
    // web 登出或自动登录
    // 1 先清除本地wsid
    localStorage.removeItem(WindSessionHeader)
    // 403后不需要跳转登录首页的页面判断
    const noNeedSessionMatch = global.ACCESS_PASS_403.filter((page) =>
      new RegExp(page, 'gi').test(window.location.href)
    )
    if (!noNeedSessionMatch?.length) {
      setTimeout(async () => {
        const gelLastUrl = window.location.href.replace(window.location.origin, '')
        localStorageManager.set('gelLastUrl', gelLastUrl)

        try {
          // 读取autoLoginInfo，尝试自动登录
          const autoLoginInfo = localStorageManager.get('autoLoginInfo')
          if (autoLoginInfo) {
            if (autoLoginInfo.userId && autoLoginInfo.token) {
              const res = await apiGetPublicKey()
              if (res.ErrorCode == '0' && res.Data) {
                const data = encryptData(
                  {
                    userId: autoLoginInfo.userId,
                    token: autoLoginInfo.token,
                    loginType: autoLoginInfo.loginType,
                  },
                  res.Data
                )
                const loginRes = await loginByToken({ data: data, publicKey: res.Data, version: '2.0' })
                if (loginRes.ErrorCode == global.SUCCESS && loginRes.Data?.wsid && loginRes.Data?.isSucceed) {
                  localStorage.setItem(WindSessionHeader, loginRes.Data?.wsid)
                  setTimeout(() => {
                    window.location.reload()
                  }, 100)
                } else {
                  gotoLogin()
                }
              }
            } else {
              gotoLogin()
            }
          } else {
            gotoLogin()
          }
        } catch (e) {
          gotoLogin()
        } finally {
          // 重置登出状态
          isLoggingOut = false
          logoutPromise = null
          resolve()
        }
      }, 100)
    } else {
      // 重置登出状态
      isLoggingOut = false
      logoutPromise = null
      resolve()
    }
  })

  return logoutPromise
}

/**
 * 跳转登录页
 */
export const gotoLogin = () => {
  const is_lanxin_terminal = window.localStorage.getItem('lanxin_terminal')
  if (is_lanxin_terminal && window.lx) {
    // 如果是nj政务平台接入，则跳转至nj政务平台session自动登录页面
    window.location.href = '../Company/index.html#/authCheck'
    return
  }
  // 如果是staging环境，则不跳转
  if (isStaging) {
    return
  }
  if (isWebTest()) {
    window.location.href = `${window.location.protocol}//${window.location.host}/wind.ent.web/gel/windLogin.html`
  } else {
    window.location.href = `${window.location.protocol}//${window.location.host}/web/windLogin.html`
  }
  return
}

// 南京政务平台接入-登录
export const loginFromLanxin = async (params) => {
  const VERSION = '2.0' // 隐私协议版本

  const encryptLoginData = (publicKey) => {
    const loginInfo = {
      njgovCode: params.njgovCode,
      loginType: 'njgov',
      version: VERSION,
    }
    return encryptData(loginInfo, publicKey)
  }

  try {
    // 获取公钥
    const authRes = await apiGetPublicKey()
    if (!authRes || authRes.ErrorCode !== '0') {
      throw new Error('获取公钥失败')
    }

    // 加密登录数据
    const publicKey = authRes.Data
    const data = encryptLoginData(publicKey)

    // 登录请求
    const loginRes = await loginByToken({ data, publicKey, version: VERSION })

    if (loginRes.ErrorCode == global.SUCCESS && loginRes.Data?.wsid && loginRes.Data?.isSucceed) {
      const { wsid } = loginRes.Data
      if (wsid) {
        sessionStorageManager.set('GEL-wsid', wsid)
      }
      return loginRes.Data
    } else {
      throw new Error(loginRes.Data?.message || '登录失败')
    }
  } catch (error) {
    return null
  }
}
