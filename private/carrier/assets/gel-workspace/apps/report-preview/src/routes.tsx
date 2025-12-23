import { lazy } from 'react'
import { Navigate, RouteObject, createHashRouter } from 'react-router'

const CreditRPPreview = lazy(() => import('./views/credit'))
const CreditRPPrint = lazy(() => import('./views/credit/print'))
const DDRPPreview = lazy(() => import('./views/dd'))
const NotFound = lazy(() => import('./views/Fallback/404'))

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/creditrp" replace />,
  },
  {
    path: '/creditrp',
    element: <CreditRPPreview />,
  },
  {
    path: '/creditrpprint',
    element: <CreditRPPrint />,
  },
  {
    path: '/ddrp',
    element: <DDRPPreview />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export const router = createHashRouter(routes)
