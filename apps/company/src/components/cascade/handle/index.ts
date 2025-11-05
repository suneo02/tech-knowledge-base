import { WindCascadeFieldNamesCommon, WindCascadeProps } from '../type.ts'

export * from './handleOption.ts'
export * from './onChange.ts'
export * from './parseFlattenedWindCascadeValue.ts'

/**
 *
 * 扁平化多选的级联值
 * @param value  级联筛选的值 ， 二维数组，值 path
 * @returns 实际选中
 */
export const flattenWindCascadeValue = <Value extends any>(value: Value[][]) => {
  return value.map((item) => item[item.length - 1])
}

/**
 * 根据 value 找到 option，递归搜索所有子节点
 * @param value 要查找的值
 * @param options 选项数组
 * @param fieldNames 自定义字段名：value(值字段), children(子节点字段)
 * @returns 找到的选项或 undefined
 */
export const findCascadeOptionByValue = (
  value: string,
  options: WindCascadeProps<any, any>['options'],
  fieldNames: { value: string; children: string } = {
    value: WindCascadeFieldNamesCommon.value as string,
    children: WindCascadeFieldNamesCommon.children as string,
  }
) => {
  if (!options || !options.length) {
    return undefined
  }

  // 先在当前层级查找
  const foundOption = options.find((option) => option[fieldNames.value] === value)
  if (foundOption) {
    return foundOption
  }

  // 递归查找子节点
  for (const option of options) {
    if (option[fieldNames.children] && option[fieldNames.children].length) {
      const found = findCascadeOptionByValue(value, option[fieldNames.children], fieldNames)
      if (found) {
        return found
      }
    }
  }

  return undefined
}
