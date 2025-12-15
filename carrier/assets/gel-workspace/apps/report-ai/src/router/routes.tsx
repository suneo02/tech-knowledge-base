import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { PAGE_ROUTES } from '../constants/routes';

// 懒加载所有页面组件
const ChatOutline = lazy(() => import('../pages/ChatOutline').then((module) => ({ default: module.ChatOutline })));
const Home = lazy(() => import('../pages/Home').then((module) => ({ default: module.Home })));
const ReportDetail = lazy(() => import('../pages/ReportDetail').then((module) => ({ default: module.ReportDetail })));
const FileManagement = lazy(() => import('../pages/FileManagement').then((module) => ({ default: module.FileManagement })));
const Company = lazy(() => import('../pages/Company').then((module) => ({ default: module.Company })));
const NotFound = lazy(() => import('../pages/Fallback/404').then((module) => ({ default: module.NotFound })));
const MainLayout = lazy(() => import('../pages/layouts/MainLayout').then((module) => ({ default: module.MainLayout })));

/**
 * 应用路由配置
 *
 * @description 定义应用的所有路由路径和对应的组件
 * @since 1.0.0
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={PAGE_ROUTES.HOME} replace />,
      },
      {
        path: PAGE_ROUTES.CHAT.replace('/', ''),
        children: [
          {
            index: true,
            element: <ChatOutline />,
          },
          {
            path: ':chatId',
            element: <ChatOutline />,
          },
        ],
      },
      {
        path: PAGE_ROUTES.REPORT_DETAIL.replace('/', '') + '/:id',
        element: <ReportDetail />,
      },
      {
        path: PAGE_ROUTES.HOME.replace('/', ''),
        element: <Home />,
      },
      {
        path: PAGE_ROUTES.FILE_MANAGEMENT.replace('/', ''),
        element: <FileManagement />,
      },
      {
        path: PAGE_ROUTES.COMPANY.replace('/', ''),
        element: <Company />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
];
