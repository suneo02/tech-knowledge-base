import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

// 懒加载所有页面组件
const Chat = lazy(() => import('@/pages/Chat'))
const NotFound = lazy(() => import('@/pages/Fallback/404'))
// 注意：布局组件改为同步导入，避免 Suspense 下频繁挂载卸载导致抖动
import MainLayout from '@/pages/layouts/MainLayout'
import ProgressGuardDemoPage from '@/pages/ProgressGuardDemo'
const SuperLayout = lazy(() => import('@/pages/layouts/SuperLayout'))
const SuperHome = lazy(() => import('@/pages/SuperHome'))
const SuperChatHistory = lazy(() => import('@/pages/SuperChatHistory'))
const EmbedChat = lazy(() => import('@/pages/EmbedChat'))
const MyFilePage = lazy(() => import('@/pages/MyFile'))
const CreditsHome = lazy(() => import('@/pages/Credits'))

// 命名导出的组件懒加载处理
// const GroupTable = lazy(() => import('@/components/GroupTable').then((module) => ({ default: module.GroupTable })))

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        element: <MainLayout full />,
        children: [
          { index: true, element: <Navigate to="/super" replace /> },
          {
            path: 'super',
            element: <SuperLayout />,
            children: [
              { index: true, element: <SuperHome /> },
              { path: 'history', element: <SuperChatHistory /> },
              { path: 'my-file', element: <MyFilePage /> },
            ],
          },
          { path: 'super/chat/:conversationId', element: <ProgressGuardDemoPage /> },
        ],
      },
    ],
  },
  // 防止 AI chat 与 super 路由冲突
  { path: 'chat', children: [{ index: true, element: <Chat /> }] },
  // credits 作为顶层路由，避免与无路径布局路由竞争匹配导致的重复挂载
  {
    path: 'credits',
    element: <MainLayout />,
    children: [{ index: true, element: <CreditsHome /> }],
  },
  // 添加嵌入式聊天路由，无需嵌套在MainLayout中
  {
    path: 'embed-chat',
    element: <EmbedChat />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
