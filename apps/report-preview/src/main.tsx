import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'

// 样式懒加载
import '@wind/wind-ui/dist/wind-ui.min.css'
import '../../../packages/gel-ui/dist/index.css'
import '../../../packages/report-preview-ui/dist/index.css'
import { App } from './APP'
import './styles/helper.less'
import './styles/reset.less'
// 应用入口

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <App />
  </Fragment>
)
