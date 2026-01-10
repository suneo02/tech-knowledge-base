import React, { useEffect, useMemo } from 'react'
import type { CellRegistryProviderProps, RendererConfig, AddonRegistryConfig } from '../types'
import { globalRegistry } from '../core/registry'
import { CellRegistryContext } from './types'

export const CellRegistryProvider: React.FC<CellRegistryProviderProps> = ({
  children,
  initialRenderers = [],
  initialAddons = [],
}) => {
  useEffect(() => {
    const unregisterRenderers = (initialRenderers as RendererConfig[]).map((r) =>
      globalRegistry.registerRenderer(r.type, r.renderer, r.overwrite)
    )
    const unregisterAddons = (initialAddons as AddonRegistryConfig[]).map((a) =>
      globalRegistry.registerAddon(a.name, a.addon, a.overwrite)
    )

    return () => {
      unregisterRenderers.forEach((fn) => fn())
      unregisterAddons.forEach((fn) => fn())
    }
  }, [initialRenderers, initialAddons])

  const contextValue = useMemo(() => ({ registry: globalRegistry }), [])

  return <CellRegistryContext.Provider value={contextValue}>{children}</CellRegistryContext.Provider>
}

// 注意：为遵守 react-refresh/only-export-components，此文件仅导出组件（Provider）。
