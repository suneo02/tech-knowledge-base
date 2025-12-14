/**
 * 应用路由常量配置
 *
 * @description 统一管理应用中所有路由路径，避免硬编码
 * @since 1.0.0
 */

/**
 * 应用页面路由枚举
 */
export const PAGE_ROUTES = {
  /** 根路径 */
  ROOT: '/',
  /** 首页 - 开始新报告 */
  HOME: '/home',
  /** 文件管理页面 */
  FILE_MANAGEMENT: '/file-management',
  /** 企业库页面 */
  COMPANY: '/company',
  /** 聊天页面 */
  CHAT: '/chat',
  /** 报告详情页面 */
  REPORT_DETAIL: '/reportdetail',
} as const;

/**
 * 动态路由生成器
 */
export const createRoute = {
  /** 带参数的聊天页面路由 */
  chat: (chatId: string) => `${PAGE_ROUTES.CHAT}/${chatId}`,
  /** 带参数的报告详情路由 */
  reportDetail: (id: string) => `${PAGE_ROUTES.REPORT_DETAIL}/${id}`,
} as const;

/**
 * 路由常量类型定义
 */
export type RoutePath = typeof PAGE_ROUTES[keyof typeof PAGE_ROUTES];
export type DynamicRouteCreator = typeof createRoute[keyof typeof createRoute];