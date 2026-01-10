import { useEffect } from 'react'
import { useCellRegistry } from './useCellRegistry'
import type { RendererConfig, AddonRegistryConfig } from '../types'

export const useLocalCellRender = (renderers: RendererConfig[] = [], addons: AddonRegistryConfig[] = []) => {
  const registry = useCellRegistry()

  useEffect(() => {
    const unregisterRenderers = (renderers || []).map((r) => registry.registerRenderer(r.type, r.renderer, r.overwrite))
    const unregisterAddons = (addons || []).map((a) => registry.registerAddon(a.name, a.addon, a.overwrite))
    return () => {
      unregisterRenderers.forEach((fn) => fn())
      unregisterAddons.forEach((fn) => fn())
    }
  }, [registry, renderers, addons])

  return {
    resolveRenderer: (type?: string) => registry.getRenderer(type),
  }
}
