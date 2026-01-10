import './App.css'

import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ConfigProvider } from 'antd'
import { DEFAULT_WIND_THEME } from './theme'
import { CellRegistryProvider } from '@/components/CellRegistry'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useEffect } from 'react'
import { fetchUserInfo, useAppDispatch } from './store'

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])
  return (
    <ConfigProvider theme={{ ...DEFAULT_WIND_THEME }}>
      <CellRegistryProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </CellRegistryProvider>
    </ConfigProvider>
  )
}

export default App
