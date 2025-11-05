/**
 * 解析铺平的级联筛选数据
 * @param valueFlattened 扁平化的选中值数组，每个元素是最终选中的叶子节点的 code
 * @param options 级联选择器的选项数据
 * @param valu 值类型 的 key
 * @param CK 子节点值类型 的 key
 *
 * @returns 返回级联选择器所需的二维数组格式，每个内部数组代表一个完整的选择路径
 */
export const parseFlattenedWindCascadeValue = <
  OptionType extends Record<string, any>,
  ValueField extends keyof OptionType,
  ChildrenField extends OptionType[ValueField],
>(
  valueFlattened: ValueField[],
  options: OptionType[],
  valueKey: ValueField,
  childrenKey: ChildrenField
): OptionType[ValueField][][] => {
  // 存储最终的级联路径结果
  const res: OptionType[ValueField][][] = []

  // 如果没有选中值或选项数据，直接返回空数组
  if (!valueFlattened?.length || !options?.length) {
    return res
  }

  // 遍历每个扁平化的选中值
  valueFlattened.forEach((targetCode) => {
    const path: OptionType[ValueField][] = []

    // 用于递归查找完整路径的辅助函数
    const findPath = (opts: typeof options): boolean => {
      for (const opt of opts) {
        // 将当前节点的 code 加入路径
        path.push(opt[valueKey])

        // 如果找到目标值，将当前路径加入结果数组
        if (opt[valueKey] === targetCode) {
          res.push([...path])
          path.pop()
          return true
        }

        // 如果有子节点，继续递归查找
        if (opt[childrenKey]?.length) {
          const found = findPath(opt[childrenKey])
          if (found) {
            path.pop()
            return true
          }
        }

        // 当前分支未找到，回溯
        path.pop()
      }
      return false
    }

    // 开始查找当前值的完整路径
    findPath(options)
  })

  return res
}
