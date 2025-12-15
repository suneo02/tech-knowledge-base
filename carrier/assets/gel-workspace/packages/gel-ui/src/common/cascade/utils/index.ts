export { checkIfCDESearchFilter, getCdeSearchFilterDisplayValues, isCDEValueObject } from './cdeSearchFilter'
export { convertCascadeOptions } from './convertCascadeOptions'
export { convertRimeTrackValue } from './convertRimeTrack'
export { findCascadeOptionByValue } from './findCascadeOptionByValue'
export { parseFlattenedWindCascadeValue } from './parseFlattenedWindCascadeValue'
export { truncateNestedOptionsMutating } from './truncateNestedOptionsMutating'

export const flattenWindCascadeValue = <Value extends any>(value: Value[][]) => {
  if (!value || !value.length) return []
  return value.map((item) => item[item.length - 1])
}

/**
 * 根据层级筛选 2 层或 3 层
 * @param options
 * @param ifLevel3
 */
export const filterCascadeOptionByLevel = (options, ifLevel3: boolean) => {
  return options.map((option) => ({
    ...option,
    node: option.node?.map((item) => ({
      ...item,
      node: ifLevel3 ? item.node : null,
    })),
  }))
}
