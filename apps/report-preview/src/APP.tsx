import { router } from '@/routes'
import { store } from '@/store'
import { Spin } from '@wind/wind-ui'
import { ErrorBoundary } from 'gel-ui'
import { clientInitWSID } from 'gel-util/env'
import { Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { GlobalTranslationIndicator } from './components/GlobalTranslationIndicator'

export const App = () => {
  // 初始化从终端中获取 wsid
  useEffect(() => {
    clientInitWSID()
  }, [])

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <GlobalTranslationIndicator />
        <Suspense fallback={<Spin spinning={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </ErrorBoundary>
  )
}
