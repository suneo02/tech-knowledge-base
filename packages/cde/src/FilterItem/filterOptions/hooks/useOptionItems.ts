/**
 * 选项处理钩子
 * 用于处理和转换选项列表，添加通用选项如"不限"和"自定义"
 */

import { CDEFilterOptionSingle } from 'gel-api'
import { intl } from 'gel-util/intl'

/**
 * 选项项目接口
 * @interface OptionItem
 * @property {string} name - 选项显示名称
 * @property {string} value - 选项值
 */
export interface OptionItem {
  name: string
  value: string
}

/**
 * 选项处理钩子的属性接口
 * @interface UseOptionItemsProps
 * @property {CDEFilterOptionSingle[]} itemOption - 原始选项列表
 * @property {number} [selfDefine] - 是否启用自定义选项（0表示禁用）
 */
interface UseOptionItemsProps {
  itemOption: CDEFilterOptionSingle[]
  selfDefine?: number
}

/**
 * 处理选项列表的钩子函数
 * @param {UseOptionItemsProps} props - 选项处理参数
 * @returns {{options: OptionItem[]}} 处理后的选项列表
 */
export const useOptionItems = ({
  itemOption,
  selfDefine,
}: UseOptionItemsProps): {
  options: OptionItem[]
} => {
  // 转换原始选项为标准格式
  const options = itemOption.map<OptionItem>((item) => {
    return {
      name: item.name,
      value: item.value,
    }
  })

  // 添加"不限"选项到列表开头
  options.unshift({
    name: intl('258846', '不限'),
    value: 'any',
  })

  // 如果启用了自定义选项，添加到列表末尾
  if (selfDefine !== 0) {
    options.push({
      name: intl('25405', '自定义'),
      value: 'custom',
    })
  }

  return {
    options,
  }
}
