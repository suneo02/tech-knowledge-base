import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

// 懒加载所有页面组件
const NotFound = lazy(() => import('@/pages/Fallback/404'))
// 注意：布局组件改为同步导入，避免 Suspense 下频繁挂载卸载导致抖动
import { PageContainer } from '@/components/layout/PageContainer'
import { Home } from '@/pages/Home'
import { Introductory } from '@/pages/Introductory'
import { Prospect } from '@/pages/Prospect'
import { Dashboard } from '@/pages/Dashboard'
import { CompanyDirectory } from '@/pages/CompanyDirectory'
import { AppSideMenu } from '@/components/layout/AppSideMenu'
import { MyFile } from '@/pages/MyFile'

// 命名导出的组件懒加载处理
// const GroupTable = lazy(() => import('@/components/GroupTable').then((module) => ({ default: module.GroupTable })))

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        // 产品要求隐藏
        element: <PageContainer enableAside={false} asideContent={<AppSideMenu />} />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'introductory',
            element: <Introductory />,
          },
          {
            path: 'prospect',
            element: <Prospect />,
          },
          {
            path: 'dashboard',
            element: <Dashboard name="dashboard" />,
          },
          {
            path: 'my-file',
            element: <MyFile />,
          },
        ],
      },
      {
        element: <PageContainer full />,
        children: [
          {
            path: 'company-directory',
            element: <CompanyDirectory name="company-directory" />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <PageContainer full />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

export default routes
