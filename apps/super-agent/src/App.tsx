import './App.css'

import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ConfigProvider } from 'antd'
// import '@wind/chart-builder/lib/WCBChart/style/css'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'red',
        },
        components: {
          Typography: {
            colorLink: 'var(--font-color-1)',
            colorLinkHover: 'var(--click-5)',
            colorLinkActive: 'var(--click-7)',
          },
          Table: {
            headerBorderRadius: 0,
            headerBg: 'var(--basic-13)',
          },
          Pagination: {
            borderRadius: 2,
            colorPrimary: 'var(--click-6)',
            colorPrimaryHover: 'var(--click-6)',
            colorPrimaryActive: 'var(--click-6)',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
