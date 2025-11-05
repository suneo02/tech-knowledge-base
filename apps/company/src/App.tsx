/** @format */

import { debounce } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { HashRouter as Router } from 'react-router-dom'
// 样式懒加载
import '@wind/wind-ui/dist/wind-ui.min.css'
import 'ai-ui/dist/index.css'
import 'gel-ui/dist/index.css'

import { removeAllDeprecatedStorage } from 'gel-util/storage'
import * as globalActions from './actions/global'
import { eaglesError } from './api/eagles'
import AppIntlProvider from './components/AppIntlProvider'
import {
  bankWorkBenchRoutes,
  browserRoutes,
  errorRoute,
  homeTempRoutes,
  routes,
  searchBidRoutes,
  searchHomeRoutes,
} from './config/routes'
import './index.less'
import global from './lib/global'
import store from './store/store'
import './styles/helper/index.less'
import intl, { getLang } from './utils/intl'
import { localStorageManager, localStorageSafeSet, sessionStorageManager } from './utils/storage'
import { wftCommon } from './utils/utils'

const changeLanguage = (lang) => {
  if (lang === 'zh') {
    // TODO
    window.document.title = 'Wind全球企业库'
  } else if (lang === 'en') {
    window.document.title = 'Wind Global Enterprise Library'
    window.en_access_config = true
    if (!window.document.body.className || window.document.body.className.indexOf('window-locale-en-US') == -1) {
      window.document.body.className = window.document.body.className + ' window-locale-en-US '
    }
    wftCommon.importExternalScript('./jquery.js').then(() => {
      console.warn('import $ success')
    })
  }
  store.dispatch(globalActions.setLanguage({ language: lang }))
}

// Component 注入 $translation 方法
// 非Component 需要自己 import
// @ts-expect-error
React.Component.prototype.$translation = intl
// @ts-expect-error
React.Component.prototype.intl = intl
// @ts-expect-error
window.intl = intl

// 重写 ResizeObserver方法，添加防抖，解决ERROR ResizeObserver loop limit exceeded问题
const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      someError: false,
    }
    // 切换语言
    const lang = getLang()
    // @ts-expect-error
    if (lang && lang !== this.props.global.language) {
      changeLanguage(lang)
    } else if (lang == 'en') {
      window.document.title = 'Global Enterprise Library'
      window.en_access_config = true
      if (!window.document.body.className || window.document.body.className.indexOf('window-locale-en-US') == -1) {
        window.document.body.className = window.document.body.className + ' window-locale-en-US '
      }
      wftCommon.importExternalScript('./jquery.js').then(() => {
        console.warn('import $ success')
      })
    }
    const is_terminal = wftCommon.usedInClient()
    if (is_terminal) {
      // 终端内，读用户信息，记录到window对象
      window.is_terminal = true
      window.external.ClientFunc(
        JSON.stringify({
          func: 'querydata',
          isGlobal: 1,
          name: 'terminaluserinfo',
        }),
        (res) => {
          if (res) {
            try {
              const data = JSON.parse(res)
              if (data && data.userid) {
                window.globaluserinfo4gel = data.userid
              }
            } catch (e) {}
          }
        }
      )
      // 读取wsid
      window.external.ClientFunc(
        JSON.stringify({
          func: 'querydata',
          isGlobal: 1,
          name: 'sessionid',
        }),
        (res) => {
          if (res) {
            try {
              const data = JSON.parse(res)
              if (data && data.value) {
                sessionStorageManager.set('GEL-wsid', data.value)
              }
            } catch (e) {}
          }
        }
      )
    } else {
      // 非终端内，需要接入lanxin sdk
      wftCommon.importExternalScript('./lanxinsdk.js').then(() => {
        console.warn('import lanxin success')
        const is_lanxin_terminal = localStorageManager.get('lanxin_terminal')
        if (!is_lanxin_terminal) {
          // 先尝试获取lanxin授权码，如果获取失败，则说明是web端
          window.lx.biz
            .getAuthCode({
              appId: global.NJGOV_APP_ID,
              success: (res) => {
                localStorageSafeSet('lanxin_auth_code', res?.authCode || '')
                localStorageSafeSet('lanxin_terminal', true)
              },
              error: () => {},
            })
            .catch(() => {
              localStorageManager.remove('lanxin_auth_code')
              console.warn('app runing in web...')
            })
        } else {
          localStorageManager.remove('lanxin_auth_code')
          console.warn('app runing in lanxin terminal...')
        }
      })
    }
  }

  static getDerivedStateFromError(error) {
    return { someError: error }
  }

  componentDidMount = () => {
    removeAllDeprecatedStorage()
  }

  componentDidCatch = (error, info) => {
    // TODO 预留上报错误信息日志处理
    console.warn('error: ', error)
    console.warn('errorInfo: ', info)
    eaglesError({
      error,
      info,
    })

    // @ts-expect-error
    if (this.state.someError) return
    this.setState({
      someError: error,
    })
  }

  render() {
    let pages = routes
    // @ts-expect-error
    const defalutRoute = this.props.defalutRoute
    // @ts-expect-error
    const extraProps = this.props.extraProps
    console.log('defalutRoute', defalutRoute)
    switch (defalutRoute) {
      case 'searchHome':
        pages = searchHomeRoutes
        break
      case 'searchBid':
        pages = searchBidRoutes
        break
      case 'bankWorkBench':
        pages = bankWorkBenchRoutes
        break
      case 'company':
        pages = routes
        break
      case 'browser':
        pages = browserRoutes
        break
      case 'home':
        pages = homeTempRoutes
        break
      default:
        pages = routes
        break
    }
    // if (defalutRoute && defalutRoute.indexOf('searchPlatform/') > -1) {
    //   pages = searchTempRoutes
    // }

    return (
      <div className="App" style={{ height: '100%' }}>
        <AppIntlProvider>
          {/* @ts-expect-error */}
          {!this.state.someError ? (
            <Router basename={'/'}>{renderRoutes(pages, extraProps)}</Router>
          ) : (
            <Router basename={'/'}> {renderRoutes(errorRoute)} </Router>
          )}
        </AppIntlProvider>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    global: state.global,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
