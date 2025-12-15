import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'

// 样式懒加载
import '@wind/wind-ui/dist/wind-ui.min.css'
import 'ai-ui/dist/index.css'
import 'cde/dist/index.css'
import 'gel-ui/dist/index.css'
import 'indicator/dist/index.css'
// 其他样式使用动态导入
import('./index.less')
import('./styles/global.less')

// 应用入口
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <App />
  </Fragment>
)
