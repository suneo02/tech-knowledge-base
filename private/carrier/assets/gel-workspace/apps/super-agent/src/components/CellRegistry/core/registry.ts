import type { CellRenderer, CellAddon, CellType } from '../types'
import { RendererTypes } from '../types'
import React from 'react'
import { createStockCodeAwareMarkdownRenderer } from '@/utils/md'
import { isDev } from '@/utils/env'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

class CellRegistry {
  private renderers = new Map<CellType | string, CellRenderer>()
  private addons = new Map<string, CellAddon>()

  constructor() {
    this.initDefaultRenderers()
    this.injectDebugApi()
  }

  // 初始化默认渲染器
  private initDefaultRenderers() {
    // 默认渲染器（直接显示值）
    this.renderers.set(RendererTypes.DEFAULT, ({ value }) => String(value ?? '-'))

    // 通用数字渲染器（千分位）
    this.renderers.set(RendererTypes.NUMBER, ({ value }) => {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value ?? '-')
      return num.toLocaleString()
    })

    // 整数渲染器（四舍五入 + 千分位）
    this.renderers.set(RendererTypes.INTEGER, ({ value }) => {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value ?? '-')
      return Math.round(num).toLocaleString()
    })

    // 浮点数渲染器（保留2位小数）
    this.renderers.set(RendererTypes.FLOAT, ({ value }) => {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value ?? '-')
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })

    // 百分比渲染器（保留2位小数 + %）
    this.renderers.set(RendererTypes.PERCENT, ({ value }) => {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value ?? '-')
      return `${(num * 100).toFixed(2)}%`
    })

    // Markdown 渲染器（带股票代码链接增强）
    this.renderers.set(RendererTypes.MARKDOWN, ({ value }) => {
      const source = typeof value === 'string' ? value : String(value ?? '')
      const html = createStockCodeAwareMarkdownRenderer(isDev).render(source)
      return React.createElement('div', { dangerouslySetInnerHTML: { __html: html } })
    })
  }

  // 注册渲染器（返回卸载函数）
  registerRenderer(type: CellType | string, renderer: CellRenderer, overwrite = false): () => void {
    const key = String(type)
    const existing = this.renderers.get(key)
    if (existing && !overwrite) {
      console.warn(`[CellRegistry] 渲染器 "${key}" 已存在，需设置 overwrite: true 覆盖`)
      return () => {}
    }
    this.renderers.set(key, renderer)
    return () => {
      if (existing) {
        this.renderers.set(key, existing)
      } else {
        this.renderers.delete(key)
      }
    }
  }

  // 注册 Addon（返回卸载函数）
  registerAddon(name: string, addon: CellAddon, overwrite = false): () => void {
    const existing = this.addons.get(name)
    if (existing && !overwrite) {
      console.warn(`[CellRegistry] Addon "${name}" 已存在，需设置 overwrite: true 覆盖`)
      return () => {}
    }
    this.addons.set(name, addon)
    return () => {
      if (existing) {
        this.addons.set(name, existing)
      } else {
        this.addons.delete(name)
      }
    }
  }

  // 获取渲染器（未找到时使用默认，并在开发环境告警）
  getRenderer(type?: CellType | string): CellRenderer {
    const key = String(type ?? RendererTypes.DEFAULT)
    const renderer = this.renderers.get(key)
    if (!renderer) {
      if (isDev) {
        console.warn(`[CellRegistry] 未找到渲染器: ${key}，使用默认渲染器`)
      }
      return this.renderers.get(RendererTypes.DEFAULT)!
    }
    return renderer
  }

  // 获取 Addon
  getAddon(name: string): CellAddon | undefined {
    return this.addons.get(name)
  }

  // 注入调试 API（开发环境）
  private injectDebugApi() {
    if (!isDev) return
    window.__CELL_REGISTRY_DEBUG__ = {
      // 与组件文档一致的命名
      getRegisteredRenderers: () => Array.from(this.renderers.keys()),
      getRegisteredAddons: () => Array.from(this.addons.keys()),
      clearAll: () => {
        this.renderers.clear()
        this.addons.clear()
        this.initDefaultRenderers()
      },
      version: '1.1.0',
    }
  }
}

export const globalRegistry = new CellRegistry()
