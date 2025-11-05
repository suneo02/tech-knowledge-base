/**
 * 判断值是否为空
 * @param value 要判断的值
 * @returns 如果值为 null 或空字符串，则返回 true，否则返回 false
 * @example
 * isNullOrEmpty(null) // true
 * isNullOrEmpty('') // true
 * isNullOrEmpty(undefined) // true
 * isNullOrEmpty(' ') // true
 * isNullOrEmpty(0) // false
 * isNullOrEmpty(false) // false
 * isNullOrEmpty(true) // false
 */
export const isNullOrEmpty = (value: number | string | boolean | null | undefined | unknown): boolean => {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

export const returnValue = (value: number | string | boolean | null | undefined | unknown): string => {
  let v = ''
  if (typeof value === 'string') {
    v = value.trim()
  } else if (typeof value === 'number') {
    v = value.toString()
  } else if (typeof value === 'boolean') {
    v = value.toString()
  }
  return v
}

/**
 * 生成唯一的列名
 * @param name 基础名称，默认为"未命名"
 * @param list 现有列数组
 * @returns 生成的唯一列名
 * @example
 * generateUniqueName(undefined, [{ name: '未命名' }]) // '未命名(1)'
 * generateUniqueName('未命名', [{ name: '未命名' }, { name: '未命名(2)' }]) // '未命名(1)'
 */
export const generateUniqueName = <T extends Record<string, any>, K extends keyof T & string>({
  name = '未命名',
  list = [] as T[],
  key = 'name' as K,
}: {
  name?: string
  list?: T[]
  key?: K
}): string => {
  // 如果列表为空，直接返回默认名称
  if (list.length === 0) return name

  // 检查是否已存在相同名称
  const existingNames = list.map((item) => String(item[key]))
  if (!existingNames.includes(name)) return name

  // 查找所有匹配模式的名称（如"未命名"、"未命名(1)"、"未命名(2)"等）
  const pattern = new RegExp(`^${name}(\\(\\d+\\))?$`)
  const matchingNames = existingNames.filter((n) => pattern.test(n))

  // 提取所有已使用的序号
  const usedIndices = new Set<number>()
  matchingNames.forEach((n) => {
    const match = n.match(/\((\d+)\)$/)
    if (match) {
      usedIndices.add(parseInt(match[1], 10))
    }
  })

  // 找到第一个未使用的序号
  let index = 1
  while (usedIndices.has(index)) {
    index++
  }

  // 返回新的名称，使用第一个未使用的序号
  return `${name}(${index})`
}
