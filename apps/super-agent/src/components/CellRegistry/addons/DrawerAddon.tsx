import React from 'react'
import type { CellAddon, RenderParams } from '@/components/CellRegistry'
import DrawerWrapper from './DrawerAddonView'

// 一个可注册的 Drawer 增强器：仅在调用方注册后生效
export const drawerAddon: CellAddon = (node: React.ReactNode, params: RenderParams): React.ReactNode => {
  return React.createElement(DrawerWrapper, { baseNode: node, params })
}