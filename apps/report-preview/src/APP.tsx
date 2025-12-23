import { router } from '@/routes'
import { store } from '@/store'
import { Spin } from '@wind/wind-ui'
import { DebugPanel, ErrorBoundary, IntlEnsure } from 'gel-ui'
import { clientInitWSID } from 'gel-util/env'
import { Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { GlobalTranslationIndicator } from './components/GlobalTranslationIndicator'
import { isDev, isStaging } from './utils'

export const App = () => {
  // 初始化从终端中获取 wsid
  useEffect(() => {
    clientInitWSID()
  }, [])

  return (
    <ErrorBoundary>
      {isDev || isStaging ? <DebugPanel /> : null}
      <IntlEnsure>
        <Provider store={store}>
          <GlobalTranslationIndicator />
          <Suspense fallback={<Spin spinning={true} />}>
            <RouterProvider router={router} />
          </Suspense>
        </Provider>
      </IntlEnsure>
    </ErrorBoundary>
  )
}
