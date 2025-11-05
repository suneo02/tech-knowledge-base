import DebugPanel from '@/components/debug-panel'
import ErrorBoundary from '@/components/ErrorBoundary'
import { GlobalModalProvider } from '@/components/GlobalModalProvider'
import { store } from '@/store'
import { XProvider } from '@ant-design/x'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { primaryColor } from 'gel-ui'
import { clientInitWSID } from 'gel-util/env'
import { i18n } from 'gel-util/intl'

import Loading from '@/pages/Fallback/loading'
import { Suspense, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router'
import { useUrlLanguage } from './utils/intl/useUrlLanguage'

// 预加载关键路由
const preloadRoutes = () => {
  // 当用户停留在页面上一段时间后预加载主要路由
  const timeout = setTimeout(() => {
    import('@/pages/Chat')
    // 根据业务需求预加载其他重要组件
    import('@/pages/SuperChat')
    import('@/pages/MyFile')
    import('@/pages/SuperHome')
    import('@/pages/SuperChatHistory')
    // 预加载关键样式
    import('@/pages/Chat/index.module.less')
    import('@/components/ChatBase/index.tsx')
    import('@/components/Conversation/base')
  }, 200)

  return () => clearTimeout(timeout)
}

const App = () => {
  const isDev = import.meta.env.DEV

  // 初始化 URL 语言处理
  useUrlLanguage()

  // 根据当前语言选择 Ant Design 的语言包
  const antdLocale = useMemo(() => {
    return i18n.language === 'en-US' ? enUS : zhCN
  }, [i18n.language])

  // 初始化从终端中获取 wsid
  useEffect(() => {
    clientInitWSID()
  }, [])

  // 预加载关键路由
  useEffect(() => {
    return preloadRoutes()
  }, [])

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: primaryColor,
            },
          }}
          locale={antdLocale}
        >
          <XProvider>
            <GlobalModalProvider>
              <Suspense fallback={<Loading />}>
                <div className={`app-container ${isDev ? 'dev-mode' : ''}`}>
                  <RouterProvider router={router} />
                  {isDev && <DebugPanel />}
                </div>
              </Suspense>
            </GlobalModalProvider>
          </XProvider>
        </ConfigProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
