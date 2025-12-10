import { eaglesError } from '@/api/eagles'
import { ApiResponse } from '@/api/types.ts'
import { getWsid, isTestSite } from '@/utils/env'
import { getApiPrefix, isDevDebugger, isTerminalAppPath, usedInClient } from '@/utils/env/misc'
import { localStorageManager } from '@/utils/storage'
import { Button, message, Modal, notification } from 'antd'
import axios from 'axios'
import { isEn } from 'gel-util/intl'
import qs from 'qs'
import React from 'react'
import store from '../store/store'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { vipLimitInterceptor } from './ApiInterceptor'
import global from './global'
import { buyVip, overseaTipsSimple, overVip, tryVip, updateAlert } from './globalModal'
import { logout } from './logout'
import { aesDecrypt, getMapHost, setToken } from './utils'

const needAlertCodes = [
  global.FREQUENT_ERROR,
  global.EMAIL_ALREADY_BINDING,
  global.MESSAGE_FORMAT_ERROR,
  global.SMS_SEND_VERIFY_CODE_FREQUENT_ERROR,
  global.VISA_USER_NOT_EXIST,
  global.VISA_INVALID_PASSWORD,
]

class HttpRequest {
  private queue: Record<string, boolean> = {}
  private reqList: any[] = []
  private alertTime: number = 0
  private limitContainer: HTMLDivElement | null = null

  constructor() {
    this.queue = {}
    this.reqList = []
    this.alertTime = 0
    this.limitContainer = null
  }

  alert = (info) => {
    if (new Date().getTime() - this.alertTime < 1000) {
      return
    }
    this.alertTime = new Date().getTime()
    message.destroy()
    console.warn('api: ', info)
  }

  getInsideConfig(url?, _options?) {
    const is_terminal = wftCommon.usedInClient()
    let config = null
    if (url.indexOf('/wmap/api') > -1) {
      if (!is_terminal) {
        config.headers['wind.sessionid'] = getWsid()
      }
    } else {
      const wsid = getWsid()
      const is_terminal = wftCommon.usedInClient()
      config =
        !is_terminal && wsid
          ? {
              headers: {
                languageSet: store.getState().global.language === 'en' ? 'en_US' : 'zh_CN',
                'wind.sessionid': wsid,
                'client-type': 'web',
              },
            }
          : {
              headers: {
                languageSet: store.getState().global.language === 'en' ? 'en_US' : 'zh_CN',
                'client-type': 'web',
              },
            }
    }

    return config
  }

  // 全局响应拦截器
  interceptors(instance, url, options?) {
    instance.interceptors.request.use(
      (config) => {
        const is_terminal = wftCommon.usedInClient()
        const wsid = getWsid()
        if (options['needWsid'] || (!is_terminal && wsid)) {
          config.headers['wind.sessionid'] = getWsid()
        }
        config.headers['traceId'] = Math.floor(Math.random() * 1000000000) // 后端traceId 用于查日志问题

        if (options['formType'] == 'payload') {
        } else {
          // formdata
          config.data = qs.stringify(config.data) // 转为formdata数据格式
          return config
        }
        if (config.headers['Content-Type'] === 'multipart/form-data') {
          // formdata
          config.data = qs.stringify(config.data) // 转为formdata数据格式
          return config
        }

        // 添加全局的loading
        // 队列中有请求时，显示loading界面
        if (!Object.keys(this.queue).length) {
          // 遮罩组件
          // Spin.show()
        }
        this.queue[url] = true
        // 设置cancel，token失效后全部取消
        let cancel
        // config.cancelToken = new axios.CancelToken(function (c) {
        //   cancel = c;
        // });
        // 对解密处header控制
        if (options && options.encrypt) {
          config.headers['Content-Type'] = 'application/json'
        }
        this.reqList.push({ ...config, cancel })
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      (res) => {
        delete this.queue[url]
        if (options.apiSource === 'risk') {
          // res.data.data = res.data.data.data;
          res.data.code = res.data.errorCode === 0 ? '0' : res.data.errorCode
          res.data.msg = options.cmd + ' ' + res.data.ErrorCode + ':' + res.data.ErrorMessage
        } else if (options.cmd) {
          res.data.data = res.data.Data
          res.data.code = res.data.ErrorCode
          res.data.msg = options.cmd + ' ' + res.data.ErrorCode + ':' + res.data.ErrorMessage
        }
        let { code, data, msg } = res.data
        if (!code) {
          code = res.data.ErrorCode
        }
        // if (code === global.DATA_LIMIT) {
        //   // 海外用户控制数据权限
        //   const { sceneType, applyStatus } = data;
        //   const { visaAccountId, sessionId } = JSON.parse(window.localStorage.userInfo);
        //   const host = global.PROD_ORIGINS.includes(window.location.origin) ? "https://wx.wind.com.cn" : "http://180.96.8.173";
        //   let url = `/junitedweb/sea/index.html?accountId=${visaAccountId}&languageType=1&module=superlist&terminalType=313&wind.sessionid=${sessionId}&applyStatus=${applyStatus}&returnUrl=${window.encodeURIComponent(`${window.location.origin}/superlist/`)}#/notice`;
        //   window.location.href = `${host}${url}${sceneType}`;
        //   return res.data;
        // }
        // 对需要解密的接口进行解密
        if (options && options.encrypt) {
          try {
            res.data.data = aesDecrypt(data)
          } catch (error) {
            // data = data;
          }
        }
        if (code === global.USER_LOCKED) {
          this.reqList.forEach((_item) => {
            // item.cancel("该请求已取消");
          })
          Modal.warning({
            title: msg,
            onOk: () => {
              setToken()
              localStorageManager.remove('USERINFO')
            },
          })
          return res.data
        }

        // 翻页超限处理
        vipLimitInterceptor(code)
        if (res.config.extra) {
          // nothing todo
          if (code === global.USERAGREEMENT_UPDATE || code === global.PRIVACYPOLICY_UPDATE) {
            updateAlert()
          }
        } else if (res.request.responseType === 'blob') {
          // 流文件下载，无msg
          if (res.data.type === 'application/json') {
            res.data.text().then((body) => {
              // console.log(body)
              body = JSON.parse(body)
              if (body.code === global.USE_OUT_LIMIT) {
                this.showLimitWarning()
              } else if (code === global.TRY_VIP_ALERT) {
                tryVip(msg)
              } else if (code === global.BUY_VIP_ALERT) {
                buyVip()
              } else if (code === global.OVER_VIP_ALERT) {
                overVip(msg, intl)
              } else {
                this.alert(body.msg)
              }
            })
          }
        } else if (code == global.CORP_ERROR) {
          // 脏 企业数据
          message.config({
            duration: 2,
            maxCount: 1,
          })
          message.error(intl('352913', '页面不存在，即将跳转企业库首页')) // 错误信息不弹出
          setTimeout(() => {
            message.destroy()
            wftCommon.jumpJqueryPage('SearchHome.html', true)
          }, 1950)
        } else if (code !== global.SUCCESS) {
          // console.log(code);

          if (res.data.errorCode == global.USE_FORBIDDEN_GATEWAY) {
            res.data.ErrorCode = '-10'
            code = '-10'
          }
          if (res.data.errorCode == global.USE_OUT_LIMIT_GATEWAY) {
            res.data.ErrorCode = global.USE_OUT_LIMIT
            code = global.USE_OUT_LIMIT
          }
          if (res.data.ErrorCode == global.USE_FORBIDDEN_GATEWAY) {
            res.data.ErrorCode = '-10'
            code = '-10'
          }
          if (res.data.ErrorCode == global.USE_OUT_LIMIT_GATEWAY) {
            code = global.USE_OUT_LIMIT
          }
          if (code === global.ACCESS_FORBIDDEN_OVERSEA) {
            this.showForbidOverseaWarning()
          } else if (code === global.USE_FORBIDDEN) {
            !options.noForbiddenWarning && this.showForbidWarning()
          } else if (code === global.USE_OUT_LIMIT) {
            !options.noWarning && this.showLimitWarning()
          } else if (code === global.SEARCH_RANGE_TOO_BIG || code === global.NLP_SEARCH_NO_DATA) {
            // 页面逻辑中处理
          } else if (code === global.TRY_VIP_ALERT) {
            tryVip(msg)
          } else if (code === global.BUY_VIP_ALERT) {
            buyVip()
          } else if (code === global.OVER_VIP_ALERT) {
            overVip(msg, intl)
          } else if (code === global.USERAGREEMENT_UPDATE || code === global.PRIVACYPOLICY_UPDATE) {
            updateAlert()
          } else if (needAlertCodes.includes(code)) {
            // 特殊的必要提示
            this.alert(msg)
          } else if (options.cmd == 'getshareurl') {
          } else {
            // 其他提示只打印控制台
            this.alert(msg)
            // console.log(msg)
          }
        }

        return res.data
      },
      (error) => {
        delete this.queue[url]
        if (error.response && error.response.status) {
          const errStatus = error.response.status
          const errCode = error.response.data ? error.response.data.errorCode : '-2'

          if (errStatus == '403' || errStatus == '404') {
            // 网关拦截
            if (errCode == global.USE_FORBIDDEN_GATEWAY) {
              !options.noForbiddenWarning && this.showForbidWarning()
              return {
                ErrorCode: '-10',
                data: {
                  ErrorCode: '-10',
                },
                Data: {
                  ErrorCode: '-10',
                },
              }
            } else if (errCode == global.USE_OUT_LIMIT_GATEWAY) {
              this.showLimitWarning()
              return {
                ErrorCode: global.USE_OUT_LIMIT,
                data: {
                  ErrorCode: global.USE_OUT_LIMIT,
                },
                Data: {
                  ErrorCode: global.USE_OUT_LIMIT,
                },
              }
            } else if (errCode == global.GATEWAY_403) {
              // 网关403 假403
              return {
                ErrorCode: '-2',
                data: {
                  ErrorCode: '-2',
                  ErrorMessage: '网关异常，请联系业务研发人员',
                },
                Data: {
                  ErrorCode: '-2',
                  ErrorMessage: '网关异常，请联系业务研发人员',
                },
              }
            }
          }

          if (errStatus == '403' || errStatus == '401') {
            logout()
          }
        }
        eaglesError({ error, url })
        return Promise.reject(error)
      }
    )
  }

  showForbidWarning = () => {
    // 无权使用
    if (!this.limitContainer) {
      this.limitContainer = document.createElement('div')
      this.limitContainer.classList.add('notification-container')
      document.body.appendChild(this.limitContainer)
    }
    if (this.limitContainer.style.display === 'block') {
      // 以后超限提示框
      return
    }
    notification.warning({
      message: '提示',
      closeIcon: null,
      description: '您暂无使用该功能的权限，请联系客服咨询。',
      btn: (
        <Button
          type="primary"
          onClick={() => {
            notification.destroy()
            this.limitContainer.style.display = 'none'
          }}
          data-uc-id="GLVQoZXVI"
          data-uc-ct="button"
        >
          {intl(257645)}
        </Button>
      ),
      placement: 'top',
      duration: null,
      // @ts-expect-error ttt
      getContainer: () => this.limitContainer,
    })
    this.limitContainer.style.display = 'block'
  }

  // 数据出境无权使用弹窗提示
  showForbidOverseaWarning = () => {
    overseaTipsSimple()
  }

  showLimitWarning = () => {
    // 使用超限
    if (!this.limitContainer) {
      this.limitContainer = document.createElement('div')
      this.limitContainer.classList.add('notification-container')
      document.body.appendChild(this.limitContainer)
    }
    if (this.limitContainer.style.display === 'block') {
      // 以后超限提示框
      return
    }
    notification.warning({
      message: intl(272882, '超限提示'),
      closeIcon: null,
      description: intl(272899, '该功能的使用量已超限，请联系客服咨询更多数据获取方式。'),
      btn: (
        <Button
          type="primary"
          onClick={() => {
            notification.destroy()
            this.limitContainer.style.display = 'none'
          }}
          data-uc-id="nkE5K-azcT"
          data-uc-ct="button"
        >
          {intl(257645)}
        </Button>
      ),
      placement: 'top',
      duration: null,
      // @ts-expect-error ttt
      getContainer: () => this.limitContainer,
    })
    this.limitContainer.style.display = 'block'
  }

  hideLimitWarning = () => {}

  httpErrorStatusHandle(error) {
    // 处理被取消的请求
    if (axios.isCancel(error)) {
      return false
    }
    let msg = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          msg = '接口重定向了！'
          break
        case 400:
          msg = '参数不正确！'
          break
        case 401:
          msg = '您未登录，或者登录已经超时，请先登录！'
          break
        case 403:
          msg = '您没有权限操作！'
          break
        case 404:
          msg = `请求地址出错!`
          break // 在正确域名下
        case 408:
          msg = '请求超时！'
          break
        case 409:
          msg = '系统已存在相同数据！'
          break
        case 500:
          msg = '服务器内部错误！'
          break
        case 501:
          msg = '服务未实现！'
          break
        case 502:
          msg = '网关错误！'
          break
        case 503:
          msg = 'Oops，出错了。请稍后再试！'
          break
        case 504:
          msg = '服务暂时无法访问，请稍后再试！'
          break
        case 505:
          msg = 'HTTP版本不受支持！'
          break
        default:
          msg = '异常问题，请联系管理员！'
          break
      }
    }
    if (error.message.includes('timeout')) msg = '网络请求超时！'
    if (error.message.includes('Network')) msg = window.navigator.onLine ? '服务端异常！' : '您断网了！'

    this.alert(msg)
  }

  /**
   * This is the type for the pagination information.
   * @typedef {Object} PageType
   * @property {number} CurrentPage - The current page number.
   * @property {number} PageSize - The size of each page.
   * @property {number} Records - The total number of records.
   * @property {number} TotalPage - The total number of pages.
   *
   * This is the main type for the response object.
   * @typedef {Object} ResponseType
   * @template T
   * @property {T} Data - The data object containing the various tags and information.
   * @property {number} ErrorCode - The error code indicating the status of the response.
   * @property {string} ErrorMessage - The error message if any error occurred.
   * @property {PageType} Page - The pagination information for the response.
   * @property {number} State - The state of the response.
   *
   */

  /**
   * 发送 HTTP 请求。
   * @param {Object} options - 请求的配置对象。
   * @param {String} options.url - 请求的 URL。如果未提供，将设置为空字符串。
   * @param {Boolean} [options.noWarning=false] - 是否显示超限提示。
   * @param {Boolean} [options.noForbiddenWarning=false] - 是否显示无权使用提示。
   * @param {Object} [options.data={}] - 请求的请求数据。
   * @param {String} [options.cmd=''] - 请求的命令。
   * @param {String} [options.apiSource=''] - 请求的数据来源。
   * @param {Boolean} [options.platform=false] - 是否使用平台。
   * @param {Boolean} [options.riskNew=false] - 是否使用新的风控数据。
   *  @returns {Promise<ResponseType>} 返回一个 Promise 对象，用于处理请求的结果。
   */
  request<T = any>(options): Promise<ApiResponse<T>> {
    options.url = options.url || ''
    options.noWarning = options.data?.noWarning || false // fuse等超限提示
    options.noForbiddenWarning = options.data?.noForbiddenWarning || false // 无权使用提示
    if (options.url.indexOf('/wmap/api') > -1) {
      options.url = `${getMapHost()}${options.url}`
    }

    if (options.cmd) {
      if (options.cmd.indexOf('/') > -1) {
        // restful api 没有考虑 option.cmd 为空的情况
        options.url = options.data?.__primaryKey
          ? '/Wind.WFC.Enterprise.Web/Enterprise/gel/' + options.cmd + '/' + options.data.__primaryKey
          : '/Wind.WFC.Enterprise.Web/Enterprise/gel/' + options.cmd
        if (options.data) {
          delete options.data.__primaryKey
          delete options.data.windcode
          delete options.data.windCode
          delete options.data.companycode
        }
        if (wftCommon.isDevDebugger()) {
          const cmdArr = options.cmd.split('/')
          options.url = options.url + '?api=' + cmdArr[cmdArr.length - 1]
        }
      } else {
        options.url = '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=' + options.cmd
      }
      options.data && delete options.data.accountId
    }
    if (options.apiSource === 'risk') {
      // 风控数据来源
      options.url = '/wind.risk.relay/api/external/' + options.cmd
      if (options.platform) {
        options.url = '/wind.risk.platform/api/check/' + options.cmd
      } else if (options.riskNew) {
        options.url = '/wind.risk.relay/risknews5/' + options.cmd
      }
    }

    if (options.apiSource == 'baifen') {
      options.url = window.location.protocol + '//' + window.location.host + options.url
    }

    if (isEn()) {
      if (options.url.indexOf('?') > -1) {
        options.url = options.url + '&lang=en&gelmodule=gelpc'
      } else {
        options.url = options.url + '?lang=en&gelmodule=gelpc'
      }
    } else {
      if (options.url.indexOf('?') > -1) {
        options.url = options.url + '&gelmodule=gelpc'
      } else {
        options.url = options.url + '?gelmodule=gelpc'
      }
    }
    // options.url = options.url.indexOf('http') > -1 ? options.url : 'https://180.96.8.44' + options.url;
    const instance = axios.create({
      baseURL: getApiPrefix(),
    })
    // 合并为一个对象、如果有相同的key、则覆盖
    options = Object.assign(this.getInsideConfig(options.url, options), options)
    this.interceptors(instance, options.url, options)
    return instance(options)
  }

  cancelByTag(cancelTag) {
    this.reqList.forEach((item) => {
      item.cancelTag === cancelTag && item.cancel('该请求已取消')
    })
  }

  upload(options) {
    const instance = axios.create()
    // 合并为一个对象、如果有相同的key、则覆盖
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  /***
   * 与数据查询类业务无关的逻辑，需要请求wind.ent.web的服务，如埋点等接口
   * @param {String} cmd - 具体接口，如 user-log/add?api=buryCode
   * @param {Object} data - data，如 { userLogItems: [ {}, {} ] }
   * @param {String} method - 默认post
   * @param {String} formType - payload
   */
  requestToEntWeb(cmd, data, method?, formType?) {
    const host = window.location.host
    const isTestEnvironment = isTestSite()
    // 终端内使用、终端应用内使用、开发环境使用 的域名要做手动处理，其余情况使用当前域名
    // 后端已支持在终端内直接使用当前域名访问到 wind.ent.web 服务
    const baseUrl = `https://${host}`
    const url = `${baseUrl}/wind.ent.web/${cmd}`
    const options = {
      url,
      method: method || 'post',
      data,
      formType: formType || 'payload',
      needWsid: true, // 终端内未注册serverinfo的服务，mac终端上必须自己传入wsid
    }
    return this.request(options)
  }
}

export default HttpRequest
