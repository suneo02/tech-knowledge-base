import Loading from '@/pages/Fallback/loading'
import { Suspense } from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import routes from './routes'

// 包装路由组件，添加 Suspense
const wrapRouteComponent = (routes: RouteObject[]): RouteObject[] =>
  routes.map((route) => {
    const wrappedRoute = {
      ...route,
      element: route.element ? <Suspense fallback={<Loading />}>{route.element}</Suspense> : undefined,
    }
    if (route.children) {
      wrappedRoute.children = wrapRouteComponent(route.children)
    }
    return wrappedRoute
  })

// 创建路由实例
export const router = createHashRouter(wrapRouteComponent(routes))

export default router
