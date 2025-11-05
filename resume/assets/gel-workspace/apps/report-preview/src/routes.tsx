import { Navigate, RouteObject, createHashRouter } from 'react-router'

import CreditRPPreview from './views/credit'
import CreditRPPrint from './views/credit/print'
import DDRPPreview from './views/dd'
import NotFound from './views/Fallback/404'

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
