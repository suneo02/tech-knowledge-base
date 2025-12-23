import { LocaleProvider } from '@wind/wind-ui'
import enUSui from '@wind/wind-ui/lib/locale-provider/en_US'
import { client } from '@wind/windjs'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { I18nextProvider } from 'gel-ui'
import { i18n, imlCn, imlEn } from 'gel-util/intl'
import React from 'react'
import intl, { getLang, getLocale } from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { init as monitorInit, WindMonitorProvider } from '@wind/wind-monitor-client'

// @ts-ignore
const monitorClient = (window.monitorClient = monitorInit({
  appName: 'Wind.WFC.Enterprise.Web.Font',
  monitorBehavior: true,
  circleMark: true,
}))

let locale
let localUI

// 终端多语言设置修改时会触发 ServerFunc(func = NotifyLocaleChanged)
// 使用 addServerFunc 避免直接覆盖 window.ServerFunc 导致冲突
client.addServerFunc('NotifyLocaleChanged', () => {
  // console.log('NotifyLocaleChanged', params);
  window.location.reload()
})

function init() {
  let lang = getLang(getLocale())
  switch (lang) {
    case 'en':
      locale = 'en-US'
      localUI = enUSui
      dayjs.locale('en')
      break
    case 'zh':
    default:
      lang = 'zh'
      locale = 'zh-CN'
      localUI = null
      dayjs.locale('zh-cn')
      break
  }

  const locales = {
    'zh-CN': imlCn,
    'en-US': imlEn,
  }

  // 异步载入多语言文件(记得注释上面import的多语言资源)
  return intl.init({
    currentLocale: locale,
    locales,
    commonLocaleDataUrls: {
      // index.html相对的路径
      en: 'assets/js/react-intl-universal/en.js',
      zh: 'assets/js/react-intl-universal/zh.js',
    },
  })
}

const promiseInit = init()

class AppIntlProvider extends React.Component<{ children: React.ReactNode }, { initDone: boolean }> {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
    }
  }

  componentDidMount() {
    // 若lang资源文件要异步加载，则加载的时机会变迟,intl.get尽量不要在声明中直接调用
    promiseInit.then(() => {
      wftCommon.initIntl()
      this.setState({
        initDone: true,
      })
    })
  }

  render() {
    if (!this.state.initDone) {
      return null
    }
    return (
      <WindMonitorProvider client={monitorClient}>
        {/* @ts-expect-error */}
        <I18nextProvider i18n={i18n}>
          {/* @ts-expect-error */}
          <LocaleProvider locale={localUI}>{this.props.children}</LocaleProvider>
        </I18nextProvider>
      </WindMonitorProvider>
    )
  }
}

export default AppIntlProvider
