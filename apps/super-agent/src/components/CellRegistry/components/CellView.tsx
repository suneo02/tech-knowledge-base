// no intl
import React, { useMemo } from 'react'
import { useCellRegistry } from '../hooks/useCellRegistry'
import type { CellViewProps, AddonUseConfig, RenderParams } from '../types'

const CellView: React.FC<CellViewProps> = (props) => {
  const registry = useCellRegistry()

  const { value, record, column, mode = 'inline', addons = [], fallback = '-' } = props

  const renderParams: RenderParams = useMemo(() => ({ value, record, column, mode }), [value, record, column, mode])

  const resolvedAddons = useMemo(() => {
    return addons.map((item) => {
      const config: AddonUseConfig = typeof item === 'string' ? { name: item, order: 100 } : { order: 100, ...item }
      return { ...config, addon: registry.getAddon(config.name) }
    })
  }, [addons, registry])

  const filteredAddons = useMemo(() => {
    return resolvedAddons
      .filter(({ addon, condition }) => {
        if (!addon) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[CellView] 未注册的 Addon，已跳过')
          }
          return false
        }
        return !condition || condition(renderParams)
      })
      .sort((a, b) => (a.order || 100) - (b.order || 100))
  }, [resolvedAddons, renderParams])

  const baseContent = useMemo(() => {
    try {
      const renderer = registry.getRenderer(column?.type)
      return renderer(renderParams)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[CellView] 渲染失败:', {
          error,
          column: column?.key ?? column?.dataIndex,
          recordId: record?.id,
          value,
        })
      }
      return fallback
    }
  }, [registry, column?.type, renderParams, fallback])

  const enhancedContent = useMemo(() => {
    return filteredAddons.reduce((node, { addon, options }) => addon!(node, renderParams, options), baseContent)
  }, [filteredAddons, baseContent, renderParams])

  return <>{enhancedContent}</>
}
// 外部比较函数：优先使用 next.shouldUpdate（若提供），否则使用内置默认逻辑
const areEqual = (prev: CellViewProps, next: CellViewProps) => {
  const fallback = (p: CellViewProps, n: CellViewProps) =>
    p.value !== n.value ||
    p.mode !== n.mode ||
    p.column !== n.column ||
    JSON.stringify(p.addons) !== JSON.stringify(n.addons)

  const fn = next.shouldUpdate ?? fallback
  return !fn(prev, next)
}

export default React.memo(CellView, areEqual)
