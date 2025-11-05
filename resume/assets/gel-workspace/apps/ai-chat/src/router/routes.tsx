import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

// 懒加载所有页面组件
const Chat = lazy(() => import('@/pages/Chat'))
const NotFound = lazy(() => import('@/pages/Fallback/404'))
const MainLayout = lazy(() => import('@/pages/layouts/MainLayout'))
const SuperLayout = lazy(() => import('@/pages/layouts/SuperLayout'))
const SuperHome = lazy(() => import('@/pages/SuperHome'))
const SuperChat = lazy(() => import('@/pages/SuperChat'))
const SuperChatHistory = lazy(() => import('@/pages/SuperChatHistory'))
const EmbedChat = lazy(() => import('@/pages/EmbedChat'))
const VisTablePage = lazy(() => import('@/pages/VisTable'))
const MyFilePage = lazy(() => import('@/pages/MyFile'))
const CreditsHome = lazy(() => import('@/pages/Credits'))

// 命名导出的组件懒加载处理
const GroupTable = lazy(() => import('@/components/GroupTable').then((module) => ({ default: module.GroupTable })))

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: 'super',
        element: <SuperLayout />,
        children: [
          {
            index: true,
            element: <SuperHome />,
          },
          {
            path: 'history',
            element: <SuperChatHistory />,
          },
          {
            path: 'my-file',
            element: <MyFilePage />,
          },
        ],
      },
      // SuperChat单独作为路由，不使用SuperLayout
      {
        path: 'super/chat/:conversationId',
        element: <SuperChat />,
      },
      {
        path: 'chat',
        children: [
          {
            index: true,
            element: <Chat />,
          },
        ],
      },
    ],
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
  {
    path: 'demo',
    element: <VisTablePage tableId="demo-table-id" />,
  },
  {
    path: 'group',
    element: <GroupTable />,
  },
  {
    path: 'credits',
    element: <CreditsHome />,
  },
]

export default routes
