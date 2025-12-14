import { Suspense } from 'react';
import { createHashRouter, RouteObject } from 'react-router-dom';
import { Loading } from '../pages/Fallback/loading';
import { routes } from './routes';

/**
 * 包装路由组件，添加 Suspense
 *
 * @description 为所有路由组件添加 Suspense 包装，提供加载状态
 * @param routes - 原始路由配置数组
 * @returns 包装后的路由配置数组
 */
const wrapRouteComponent = (routes: RouteObject[]): RouteObject[] =>
  routes.map((route) => {
    const wrappedRoute = {
      ...route,
      element: route.element ? <Suspense fallback={<Loading />}>{route.element}</Suspense> : undefined,
    };
    if (route.children) {
      wrappedRoute.children = wrapRouteComponent(route.children);
    }
    return wrappedRoute;
  });

/**
 * 创建路由实例
 *
 * @description 使用 HashRouter 创建路由实例，并包装所有路由组件
 */
export const router = createHashRouter(wrapRouteComponent(routes));
