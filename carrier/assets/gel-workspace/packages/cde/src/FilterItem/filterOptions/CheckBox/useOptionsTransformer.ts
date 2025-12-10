import { CDEFilterOptionFront } from '@/types/filter'
import { CDEFilterItem, CDEFilterOption } from 'gel-api'
import { intl } from 'gel-util/intl'
import { useMemo } from 'react'

export const convertItemOption2CheckBoxVal = (itemOption: CDEFilterOption[]) => {
  return itemOption.map((opt: CDEFilterOption) => {
    const val = opt.value
    return typeof val === 'string' ? val : val?.join(',') || ''
  })
}

export const getCustomValueFromSelectedValues = (selectedValues: string[], itemOption: CDEFilterOption[]) => {
  const optionValues = convertItemOption2CheckBoxVal(itemOption)
  return selectedValues.find((val) => !optionValues.includes(val))
}

/**
 * 选项转换Hook
 * 负责处理选项数据的转换、计算自定义值等
 */
export const useOptionsTransformer = (
  itemOption: CDEFilterOption[],
  selectedValues: string[],
  info?: CDEFilterItem
) => {
  /**
   * 计算最终的选项列表
   *
   * 如果支持自定义（info.selfDefine不为0），则添加自定义选项
   */
  const options = useMemo(() => {
    let _options = [...itemOption]

    if (info?.selfDefine !== 0) {
      _options.push({
        name: intl('25405', '自定义'),
        value: 'custom',
      })
    }

    return _options
  }, [itemOption, info])

  /**
   * 从selectedValues中计算出自定义值
   * 自定义值是指那些不在预定义选项列表中的值
   */
  const customValue = useMemo(() => {
    const customVal = getCustomValueFromSelectedValues(selectedValues, itemOption)
    return customVal || ''
  }, [selectedValues, itemOption])

  /**
   * 将CDEFilterOption转换为CheckBoxMulti需要的CDEFilterOptionFront类型
   */
  const multiOptions = useMemo(() => {
    return options.map(
      (opt: CDEFilterOption): CDEFilterOptionFront => ({
        name: opt.name || '',
        value: typeof opt.value === 'string' ? opt.value : opt.value?.[0] || '',
        itemOption: opt.itemOption?.map((subOpt: CDEFilterOption) => ({
          label: subOpt.name,
          name: subOpt.name,
          value: typeof subOpt.value === 'string' ? subOpt.value : subOpt.value?.[0] || '',
          itemOption: subOpt.itemOption?.map((l3Opt: CDEFilterOption) => ({
            label: l3Opt.name,
            name: l3Opt.name,
            value: typeof l3Opt.value === 'string' ? l3Opt.value : l3Opt.value?.[0] || '',
          })),
        })),
      })
    )
  }, [options])

  // 转换值列表，将customValue替换为"custom"标记，用于Checkbox.Group的value属性
  const checkboxGroupValue = useMemo(() => {
    return selectedValues.map((item) => {
      const optionValues = options.map((opt: CDEFilterOption) =>
        typeof opt.value === 'string' ? opt.value : String(opt.value)
      )

      if (!optionValues.includes(item) && customValue === item) {
        return 'custom'
      }
      return item
    })
  }, [selectedValues, options, customValue])

  return {
    options,
    customValue,
    multiOptions,
    checkboxGroupValue,
  }
}
