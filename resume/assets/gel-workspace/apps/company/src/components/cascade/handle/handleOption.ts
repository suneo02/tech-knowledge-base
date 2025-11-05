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
