// 类型导出
export * from './types'

// 组件导出
export { CellRegistryProvider } from './context'
export { default as CellView } from './components/CellView'

// Hook 导出
export { useLocalCellRender } from './hooks/useLocalCellRender'
export { useCellRender } from './hooks/useCellRender'
export { useCellRegistry } from './hooks/useCellRegistry'

// 常量导出
export { RendererTypes } from './types'
export { STRINGS } from './constants'

// 顶层注册封装（便于直接调用与统一卸载）
import { globalRegistry } from './core/registry'
import type { CellRenderer, CellAddon } from './types'

const _unregisterRenderers = new Map<string, () => void>()
const _unregisterAddons = new Map<string, () => void>()

export const registerRenderer = (type: string, renderer: CellRenderer, overwrite = false) => {
  const fn = globalRegistry.registerRenderer(type, renderer, overwrite)
  _unregisterRenderers.set(String(type), fn)
  return fn
}

export const unregisterRenderer = (type: string) => {
  const fn = _unregisterRenderers.get(String(type))
  if (fn) fn()
}

export const registerAddon = (name: string, addon: CellAddon, overwrite = false) => {
  const fn = globalRegistry.registerAddon(name, addon, overwrite)
  _unregisterAddons.set(String(name), fn)
  return fn
}

export const unregisterAddon = (name: string) => {
  const fn = _unregisterAddons.get(String(name))
  if (fn) fn()
}