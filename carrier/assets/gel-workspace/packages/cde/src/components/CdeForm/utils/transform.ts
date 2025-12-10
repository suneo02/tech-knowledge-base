import { isEmpty } from 'gel-util/common'
import { CDEFormConfigItem, CDEFormBizValues, CDEFormValues } from '../types'
import { FilterType } from '../types/enum'

/**
 * @description 将筛选器配置数组转换为以 itemId 为键的 Map，以便快速查找。
 * @param {FilterConfigItem[]} config - 筛选器配置数组。
 * @returns {Map<string, FilterConfigItem>} - itemId到配置项的映射。
 */
const createConfigMap = (config: CDEFormConfigItem[]): Map<string, CDEFormConfigItem> => {
  const map = new Map<string, CDEFormConfigItem>()
  const traverse = (items: CDEFormConfigItem[]) => {
    items.forEach((item) => {
      map.set(String(item.itemId), item)
      if (item.extraConfig?.length) {
        traverse(item.extraConfig)
      }
      if (item.composition?.length) {
        traverse(item.composition as any[])
      }
    })
  }
  traverse(config)
  return map
}

const DEFAULT_LOGIC = 'any'

/**
 * @description 将 Ant Design 表单的 raw values 转换为结构化的筛选条件数组。
 * @param {FilterFormValues} formValues - 从 onValuesChange 或 form.getFieldsValue() 获取的原始表单值。
 * @param {FilterConfigItem[]} config - 完整的筛选器配置数组。
 * @returns {any[]} - 转换后的结构化数组。
 */
export const transformFormValues = (formValues: CDEFormValues, config: CDEFormConfigItem[]): CDEFormBizValues[] => {
  const configMap = createConfigMap(config)
  const result: CDEFormBizValues[] = []

  for (const itemId in formValues) {
    if (Object.prototype.hasOwnProperty.call(formValues, itemId)) {
      const formValue = formValues[itemId]
      const configItem = configMap.get(itemId)
      const { itemField, itemName, logicOption, confidence, itemType } = configItem || {}

      const logic = itemType === FilterType.LOGICAL_KEYWORD ? DEFAULT_LOGIC : logicOption

      // 仅处理有值且在配置中存在的项
      if (!isEmpty(formValue) && !isEmpty(formValue.value) && configItem) {
        const defaultItem: CDEFormBizValues = {
          itemId,
          field: itemField || '',
          title: itemName || '',
          logic: formValue.logic || logic,
          value: Array.isArray(formValue.value) ? formValue.value : [formValue.value],
        }
        if (confidence) defaultItem.confidence = confidence

        result.push(defaultItem)
      }
    }
  }
  return result
}
