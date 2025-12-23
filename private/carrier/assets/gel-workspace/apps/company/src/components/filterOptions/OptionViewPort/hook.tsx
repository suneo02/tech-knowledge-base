import { getCDEItemOptionLabel } from 'cde'
import { CDEFilterItem } from 'gel-api/*'
import { isEn } from 'gel-util/intl'
import { isArray } from 'lodash'
import { useMemo } from 'react'

/**
 * @function create_itemOption_value_label_map
 * @description 递归遍历筛选器选项树，生成一个扁平化的叶子节点数组。
 * 这个函数用于将层级结构的 `itemOption` 转换为一个一维数组，方便后续根据 value 查找 label。
 * @param {CDEFilterItem['itemOption']} itemOption - 要遍历的筛选选项数组。
 * @returns {Array<CDEFilterItem['itemOption'][number]>} 返回一个只包含叶子节点（即没有子节点的 item）的扁平数组。
 */
const create_itemOption_value_label_map = (itemOption): CDEFilterItem['itemOption'][number][] => {
  if (!itemOption || !itemOption.length) return []
  let obj = []
  itemOption.map((i) => {
    // 如果当前节点还有子节点，则递归遍历
    if (i.itemOption) {
      let res = create_itemOption_value_label_map(i.itemOption)
      obj = [...obj, ...res]
    } else {
      // 如果是叶子节点，则直接添加到结果数组中
      obj.push(i)
    }
  })
  return obj
}

/**
 * 从 item 中递归根据 value 递归找到一个项
 */
export const findCDEItemOptionByValue = (
  options: CDEFilterItem['itemOption'],
  value: string
): CDEFilterItem['itemOption'][number] | undefined => {
  for (const item of options) {
    if (item.value === value) {
      return item
    }
    if (item.itemOption) {
      const found = findCDEItemOptionByValue(item.itemOption, value)
      if (found) {
        return found
      }
    }
  }
  return undefined
}
/**
 * @function dateFormat
 * @description 根据当前语言环境格式化日期字符串（YYYYMMDD -> YYYY年MM月DD日）。
 * @param {string} dataString - 'YYYYMMDD' 格式的日期字符串。
 * @returns {string} 格式化后的日期字符串。
 */
const dateFormat = (dataString) => {
  if (!dataString) {
    return ''
  }
  // 英文环境下直接返回原始字符串
  if (isEn()) {
    return dataString
  }
  return `${dataString.substring(0, 4)}年${dataString.substring(4, 6)}月${dataString.substring(6, 8)}日`
}

const getItemValuesByInfoLabels = (info: CDEFilterItem, value: string[]) => {
  try {
    let itemOptions = []
    let values = []

    // 1. 处理配置中预定义的 itemOption
    if (info && info.itemOption && info.itemOption.length > 0) {
      // 普通选项直接映射 这个是第一层级的，后续层级会根据 value 的值，去 value_labels 中查找 label
      itemOptions = info.itemOption.map((item) => {
        values.push(item.value)
        return {
          label: item.name,
          value: item.value,
        }
      })

      if (value && isArray(value)) {
        // 2. 处理已选中的值 (value)，将不在预定义选项中的值作为自定义项添加
        value?.forEach((valItem) => {
          // 如果当前选中值不在预定义选项的值列表中
          if (!values.includes(valItem)) {
            // 处理日期类型的自定义值
            if (info.selfDefine && info.itemRemark === '年月日') {
              let dateArr = valItem.split('-')
              dateArr[0] = dateArr[0] && dateFormat(dateArr[0])
              dateArr[1] = dateArr[1] && dateFormat(dateArr[1])
              itemOptions.push({
                label: dateArr.join('-'),
                value: valItem,
                status: 1, // 标记为自定义
              })
            } else {
              let label = info.selfDefine ? valItem + (info.itemRemark ? info.itemRemark : '') : valItem
              if (info.multiCbx) {
                const item = findCDEItemOptionByValue(info.itemOption, valItem)
                if (item) {
                  label = getCDEItemOptionLabel(item)
                }
              }
              // 处理普通的自定义值
              itemOptions.push({
                label,
                value: valItem,
                status: 1, // 标记为自定义
              })
            }
          }
        })
      } else {
        console.error('value is not an array', value, info)
      }

      // 3. 处理没有预定义选项，但允许自定义日期的情况
    } else if (info && info.selfDefine && info.itemRemark === '年月日') {
      if (value && isArray(value)) {
        value?.forEach((item) => {
          if (!values.includes(item)) {
            if (info.selfDefine && info.itemRemark === '年月日') {
              let dateArr = item.split('-')
              dateArr[0] = dateArr[0] && dateFormat(dateArr[0])
              dateArr[1] = dateArr[1] && dateFormat(dateArr[1])
              itemOptions.push({
                label: dateArr.join('-'),
                value: item,
                status: 1, // 标记为自定义
              })
            }
          }
        })
      } else {
        console.error('value is not an array', value, info)
      }
    }
    return {
      itemOptions,
      values,
    }
  } catch (error) {
    console.error('error', error)
    return {
      itemOptions: [],
      values: [],
    }
  }
}
/**
 * @hook useOptionViewportItemOption
 * @description 一个自定义 Hook，用于处理和转换筛选器选项，以便在 `OptionViewport` 组件中展示。
 * 它的主要作用是：
 * 1. 从配置中提取基础的选项列表。
 * 2. 将当前已选中的、但不在基础选项列表中的值（即自定义值）也一并处理，并格式化它们的标签。
 * 3. 支持多种自定义类型，如日期范围、多级复选框、带单位的自定义输入等。
 * @param {CDEFilterItem} info - 单个筛选器的完整配置信息。
 * @param {string[]} value - 当前筛选器已选中的值的数组。
 * @returns {{ itemOptions: Array<{label: string, value: any, status?: number}>, values: any[] }}
 *          - `itemOptions`: 最终用于在视口中渲染的选项列表，包含了原始选项和格式化后的自定义选项。
 *          - `values`: 从原始配置中提取出的所有选项的 value 列表。
 */
export const useOptionViewportItemOption = (info: CDEFilterItem, value: string[] | undefined) => {
  // 使用 useMemo 缓存最终处理好的选项列表和原始值列表
  // 依赖项包括筛选器配置(info)、已选值(value)和叶子节点映射(value_labels)
  const { itemOptions, values } = useMemo(() => {
    return getItemValuesByInfoLabels(info, value)
  }, [info, value])
  return {
    itemOptions,
    values,
  }
}
