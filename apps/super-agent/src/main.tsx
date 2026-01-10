import { Fragment } from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'

// 样式懒加载
import '@wind/wind-ui/lib/index.less'
// 其他样式使用动态导入

// 应用入口
import App from './App.tsx'
import { store } from '@/store'
// import { initGlobalErrorHandlers } from '@/api/error/global-handlers'

// initGlobalErrorHandlers()

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <Provider store={store}>
      <App />
    </Provider>
  </Fragment>
)
