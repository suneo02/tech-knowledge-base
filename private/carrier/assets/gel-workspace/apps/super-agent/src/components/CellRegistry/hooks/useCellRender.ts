import { useCallback } from 'react'
import { useCellRegistry } from './useCellRegistry'
import type { CellAddon, CellRenderer, RenderParams, UseCellRenderOptions } from '../types'

// 兼容性：提供 renderCell / register* 能力供 DrawerAddon 等使用
// 说明：api-types 仅用于类型兼容，实际实现依赖 registry。

// 选项类型改为从 types 导入，保持文档与代码一致

export const useCellRender = () => {
  const registry = useCellRegistry()

  const renderCell = useCallback(
    (params: RenderParams, options?: UseCellRenderOptions) => {
      const renderer = registry.getRenderer(params.column?.type)
      let node = renderer(params)

      const addonConfigs = options?.addons ?? []
      addonConfigs
        .map((item) => (typeof item === 'string' ? { name: item, order: 100 } : { order: 100, ...item }))
        .map((cfg) => ({ ...cfg, addon: registry.getAddon(cfg.name) }))
        .filter(({ addon, condition }) => !!addon && (!condition || condition(params)))
        .sort((a, b) => (a.order || 100) - (b.order || 100))
        .forEach(({ addon, options }) => {
          node = (addon as CellAddon)(node, params, options)
        })

      return node
    },
    [registry]
  )

  const registerRenderer = useCallback((type: string, renderer: CellRenderer, overwrite?: boolean) => {
    return registry.registerRenderer(type, renderer, !!overwrite)
  }, [registry])

  const registerAddon = useCallback((name: string, addon: CellAddon, overwrite?: boolean) => {
    return registry.registerAddon(name, addon, !!overwrite)
  }, [registry])

  const resolveRenderer = useCallback((type?: string) => registry.getRenderer(type), [registry])

  return { renderCell, registerRenderer, registerAddon, resolveRenderer }
}
