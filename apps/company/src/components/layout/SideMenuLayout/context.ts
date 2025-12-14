import { createContext, useContext } from 'react'
import { MenuItemProps, MenuParams } from './types'

export interface MenuContextType {
  activeItem: MenuItemProps // 此参数判断当前的激活key
  globalParams: MenuParams
  menuCache: any
  // params: MenuParams
  // updateParams: (params: MenuParams) => void
  updateActiveItem: (key: MenuParams) => void
  updateGlobalParams: (params: MenuParams) => void
  updateMenuCache: (cache: { params: MenuParams; templateChildren: MenuItemProps[] }) => void
}

export const MenuContext = createContext<MenuContextType>({
  activeItem: {} as MenuItemProps,
  globalParams: {},
  menuCache: {},
  // params: {},
  // updateParams: () => {},
  updateActiveItem: () => {},
  updateGlobalParams: () => {},
  updateMenuCache: () => {},
})

export const useMenuContext = () => useContext(MenuContext)
