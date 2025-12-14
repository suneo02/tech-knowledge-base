/**
 * 菜单配置常量
 *
 * @description 定义应用中的菜单项配置
 * @since 1.0.0
 */

import { PAGE_ROUTES } from './routes';

/**
 * 菜单项配置类型
 */
export interface MenuItemType {
  key: string;
  path: string;
  label: string;
  iconKey?: string;
}

/**
 * 主导航菜单配置
 */
export const MAIN_MENU_ITEMS: MenuItemType[] = [
  {
    key: 'file',
    path: PAGE_ROUTES.FILE_MANAGEMENT,
    label: '文件管理',
    iconKey: 'file',
  },

  {
    key: 'home',
    path: PAGE_ROUTES.HOME,
    label: '开始新报告',
    iconKey: 'file',
  },
] as const;

/**
 * 图标键枚举
 */
export const ICON_KEYS = {
  FILE: 'file',
  HOME: 'home',
  COMPANY: 'company',
} as const;

/**
 * 获取菜单项的工具函数
 */
export const getMenuItemByKey = (key: string): MenuItemType | undefined => {
  return MAIN_MENU_ITEMS.find((item) => item.key === key);
};

/**
 * 根据路径获取菜单项
 */
export const getMenuItemByPath = (path: string): MenuItemType | undefined => {
  return MAIN_MENU_ITEMS.find((item) => item.path === path);
};
