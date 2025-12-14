import { Form } from 'antd'

import React, { Suspense, useCallback } from 'react'
import CompositeFilter from '../components/CompositeFilter'
import { ExtraItems } from '../components/ExtraItems'
import { componentMap } from '../registry'
import { CDEFormConfigItem } from '../types'
import { preprocessFilterItem } from '../utils/preprocess'

// DevErrorDisplay 的懒加载逻辑移回主组件
const DevErrorDisplay =
  process.env.NODE_ENV !== 'production' ? React.lazy(() => import('../dev/DevErrorDisplay')) : () => null

/**
 * @author Calvin
 * @description 自定义 Hook，专用于渲染筛选表单中的各个筛选条件项。
 * 它不管理表单的整体状态，而是提供一系列根据配置（FilterConfigItem）动态渲染 UI 的函数。
 * 核心导出 `renderFilterItemWithExtra` 函数，作为渲染单个筛选条件的统一入口。
 * @returns {{renderFilterItemWithExtra: (item: FilterConfigItem) => React.ReactNode}}
 */
export const useFilterItemRenderer = () => {
  /**
   * @description 渲染筛选条件项的标签文本。
   * @param {FilterConfigItem} item - 筛选条件项的配置对象。
   * @returns {string} 标签文本。
   */
  const renderLabel = useCallback((item: CDEFormConfigItem) => {
    return item.itemName
  }, [])

  /**
   * @description 渲染单个基础（非组合）的筛选条件组件。
   * 此函数会根据 `processedItem.itemType` 从 `componentMap` 注册表中查找对应的UI组件。
   * 它会自动使用 Ant Design 的 `Form.Item` 包裹组件，以便与表单进行状态同步。
   * 注意：若组件自身定义了 `hasOwnFormItem` 为 true，则不会被 `Form.Item` 再次包裹。
   * @param {FilterConfigItem} processedItem - 经过预处理的配置对象。
   * @param {FilterConfigItem} originalItem - 原始的配置对象，用于获取 `itemId` 等元数据。
   * @returns {React.ReactNode} 渲染后的 React 节点，或在组件未注册时返回 null 或开发时错误提示。
   */
  const renderBasicItem = useCallback(
    (processedItem: CDEFormConfigItem, originalItem: CDEFormConfigItem) => {
      const Component = componentMap[processedItem.itemType as keyof typeof componentMap]
      if (process.env.NODE_ENV !== 'production' && !Component) {
        return (
          <Suspense fallback={null}>
            <DevErrorDisplay
              type="unregistered-component"
              itemType={processedItem.itemType}
              originalItemType={originalItem.itemType}
            />
          </Suspense>
        )
      }
      if (!Component) {
        console.warn(`Component of type '${processedItem.itemType}' is not registered.`)
        return null
      }

      if ((Component as any).hasOwnFormItem) {
        return (
          <Form.Item key={originalItem.itemId} name={originalItem.itemId} noStyle>
            <Component {...processedItem} label={renderLabel(originalItem)} />
          </Form.Item>
        )
      }
      return (
        <Form.Item key={originalItem.itemId} name={originalItem.itemId} label={renderLabel(originalItem)}>
          <Component {...processedItem} />
        </Form.Item>
      )
    },
    [renderLabel]
  )

  /**
   * @description 渲染组合类型的筛选条件组件。
   * 组合组件由多个基础组件构成（例如，下拉框 + 输入框）。
   * 它利用 `CompositeFilter` 组件来管理和展示这些内部组件。
   * @param {FilterConfigItem} item - 组合项的整体配置对象。
   * @param {any} compositionConfig - 包含 `composition` 数组的配置，定义了内部组件。
   * @returns {React.ReactNode} 渲染后的组合组件。
   */
  const renderCompositionItem = useCallback(
    (item: CDEFormConfigItem, compositionConfig: any) => {
      if (
        process.env.NODE_ENV !== 'production' &&
        (item.itemType === '0' || item.itemType === '10') &&
        !compositionConfig.composition?.some((c: any) => c.itemType === 'cascader' && (c.options as any[])?.length)
      ) {
        return (
          <Suspense fallback={null}>
            <DevErrorDisplay type="missing-options-tree" itemName={item.itemName} itemType={item.itemType} />
          </Suspense>
        )
      }
      const finalComposition = compositionConfig.composition?.map((comp: any) => ({
        ...comp,
        ...(item[comp.componentKey] as Record<string, unknown>),
      }))
      return (
        <Form.Item key={item.itemId} name={item.itemId} label={renderLabel(item)}>
          <CompositeFilter composition={finalComposition || []} />
        </Form.Item>
      )
    },
    [renderLabel]
  )

  /**
   * @description 渲染单个筛选条件项的内部核心函数（不包括 `extraConfig` 的处理）。
   * 这是渲染逻辑的分发器：
   * 1. 对传入的配置 `item` 进行预处理（`preprocessFilterItem`）。
   * 2. 判断预处理后的配置是否为组合类型，如果是，则调用 `renderCompositionItem`。
   * 3. 否则，调用 `renderBasicItem` 渲染基础组件。
   * @param {FilterConfigItem} item - 筛选条件项的原始配置。
   * @returns {React.ReactNode} 渲染后的 React 节点。
   */
  const renderFilterItem = useCallback(
    (item: CDEFormConfigItem) => {
      const processedItem = preprocessFilterItem(item)
      if (processedItem.composition) {
        return renderCompositionItem(item, processedItem)
      }
      // Fallback for legacy static composition
      if (item.itemType === 'composite' && item.composition) {
        return renderCompositionItem(item, item)
      }
      return renderBasicItem(processedItem, item)
    },
    [renderBasicItem, renderCompositionItem]
  )

  /**
   * @description 渲染一个完整的筛选条件项，并处理其可能存在的联动子项（extraConfig）。
   * 这是从外部调用的主渲染函数。
   * 它首先调用 `renderFilterItem` 渲染主筛选条件，
   * 然后，如果配置中 `hasExtra` 为 true 且 `extraConfig` 存在，则会渲染 `ExtraItems` 组件，
   * `ExtraItems` 会监听主项值的变化，并动态渲染其关联的子筛选条件。
   * @param {FilterConfigItem} item - 筛选条件项的完整配置。
   * @returns {React.ReactNode} 包含主筛选器和可能的联动筛选器的 React 节点。
   */
  const renderFilterItemWithExtra = useCallback(
    (item: CDEFormConfigItem) => {
      const mainItem = renderFilterItem(item)
      if (!item.hasExtra || !item.extraConfig?.length) {
        return mainItem
      }
      return (
        <React.Fragment key={item.itemId}>
          {mainItem}
          <ExtraItems parentItem={item} renderFilterItem={renderFilterItem} />
        </React.Fragment>
      )
    },
    [renderFilterItem]
  )

  return {
    renderFilterItemWithExtra,
  }
}
