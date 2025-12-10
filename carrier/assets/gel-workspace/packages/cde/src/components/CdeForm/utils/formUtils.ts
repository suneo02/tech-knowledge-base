import { CDEFormConfigItem } from '../types'
import { preprocessFilterItem } from './preprocess'

/**
 * 从筛选器配置数组中构建 antd Form 所需的 `initialValues` 对象。
 *
 * **何时使用此函数：**
 * 当您需要根据筛选器组件的 **静态配置** (例如，每个筛选项的 `defaultValue` 或 `initialValue`)
 * 来初始化表单时，请使用此函数。这通常在表单首次加载且没有用户保存的值时使用。
 *
 * **与 `useNormalizedValues` 的区别：**
 * - `buildInitialValuesFromConfig`：从 **配置** 生成初始值。
 * - `useNormalizedValues`：处理和规范化 **已有的值** (例如，从 API 加载的已保存筛选器)。
 *
 * 此函数主要解决了 `defaultValue` 仅在 UI 组件层面生效，但未被 antd Form 状态管理捕获的问题，
 * 通过此函数可以确保这些默认值正确注册到 Form 实例中。
 *
 * @param config 筛选表单的配置数组 (`FilterConfigItem[]`)
 * @returns antd form 的 `initialValues` 所需的对象
 *
 * @example
 * const filterConfig = [
 *   { itemId: 'status', component: 'Select', defaultValue: 'active' },
 *   { itemId: 'tags', component: 'TagsInput', initialValue: ['important'] },
 *   {
 *     itemId: 'price_range',
 *     composition: [
 *       { componentKey: 'min', component: 'InputNumber', defaultValue: 0 },
 *       { componentKey: 'max', component: 'InputNumber', defaultValue: 100 }
 *     ]
 *   }
 * ];
 * const initialValues = buildInitialValuesFromConfig(filterConfig);
 * // initialValues 将是:
 * // {
 * //   status: { value: 'active' },
 * //   tags: { value: ['important'] },
 * //   price_range: { min: 0, max: 100 }
 * // }
 */
export const buildInitialValuesFromConfig = (config: CDEFormConfigItem[]): Record<string, any> => {
  const initialValues: Record<string, any> = {}

  for (const originalItem of config) {
    const item = preprocessFilterItem(originalItem)

    if (item.composition) {
      const compositeInitialValue: Record<string, any> = {}
      for (const comp of item.composition) {
        if (comp.defaultValue !== undefined) {
          compositeInitialValue[comp.componentKey] = comp.defaultValue
        }
      }

      if (Object.keys(compositeInitialValue).length > 0) {
        initialValues[item.itemId] = { ...initialValues[item.itemId], ...compositeInitialValue }
      }
    } else {
      let valueToSet
      if (originalItem.initialValue !== undefined) {
        valueToSet = originalItem.initialValue
      } else if (item.defaultValue !== undefined) {
        valueToSet = item.defaultValue
      }
      if (valueToSet !== undefined) {
        initialValues[item.itemId] = { value: valueToSet }
      }
    }
  }

  return initialValues
}
