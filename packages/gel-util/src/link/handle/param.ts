import qs from 'qs'

interface ParamsMap {
  [key: string]: string
}

/**
 * 从给定的 URL 中提取所有查询参数，包括 URL 的 search 部分和 hash 部分。
 * 如果 URL 的 search 部分和 hash 部分有同名参数，hash 部分的参数值会覆盖 search 部分的。
 *
 * @example
 * // 示例 URL: 'http://example.com?before=1&common=foo#/path?after=2&common=bar'
 * const params = getAllUrlSearch('http://example.com?before=1&common=foo#/path?after=2&common=bar');
 * // 返回: { before: '1', after: '2', common: 'bar' }
 *
 * @param href - 可选的 URL 字符串。如果未提供，则使用当前的 window.location.href。
 * @returns 一个包含所有解析出的参数的键值对对象。如果 URL 无效或解析失败，则返回一个空对象。
 */
export const getAllUrlSearch = (href?: string): ParamsMap => {
  const allParams: ParamsMap = {}

  try {
    const _href = new URL(href || window.location.href)

    // 使用 Array.from 优化参数提取
    Array.from(new URLSearchParams(_href.search)).forEach(([key, value]) => {
      allParams[key] = value
    })

    // 优化 hash 参数处理
    const hashString = _href.hash
    const hashQueryIndex = hashString.indexOf('?')

    if (hashQueryIndex !== -1) {
      Array.from(new URLSearchParams(hashString.slice(hashQueryIndex))).forEach(([key, value]) => {
        if (value) {
          allParams[key] = value.replace('/', '')
        }
      })
    }
  } catch (error) {
    console.error('解析 URL 参数失败:', error instanceof Error ? error.message : String(error))
    // TODO: 实现 eagles 平台错误上报
  }

  return allParams
}

/**
 * 从当前 URL 中获取指定参数的值。
 * 这个函数不区分参数名称的大小写。
 *
 * @example
 * // 假设当前 URL 是 'http://example.com?name=Alice&Age=30'
 * const name = getUrlSearchValue('name'); // 返回 'Alice'
 * const age = getUrlSearchValue('age'); // 返回 '30'
 * const gender = getUrlSearchValue('gender'); // 返回 undefined
 *
 * @param param - 需要获取其值的参数名。
 * @returns 如果找到参数，则返回其值；否则返回 undefined。如果传入的参数名为空或仅包含空白字符，也返回 undefined。
 */
export const getUrlSearchValue = (param: string): string | undefined => {
  if (!param?.trim()) {
    return undefined
  }

  const params = getAllUrlSearch()
  const normalizedParam = param.toLowerCase()
  return Object.entries(params).find(([key]) => key.toLowerCase() === normalizedParam)?.[1]
}

/**
 * 将一个对象序列化为 URL 查询字符串。
 * - `undefined` 值的属性会被忽略。
 * - `null` 值的属性会被转换为空字符串 (例如, `{ key: null }` 变成 `'key'`)。
 * - 数组会使用方括号进行格式化 (例如, `{ a: ['b', 'c'] }` 变成 `'a[]=b&a[]=c'`)。
 * - 该函数不会对键和值进行 URL 编码。
 *
 * @example
 * stringifyObjectToParams({ a: 1, b: 'hello', c: null, d: undefined, e: ['x', 'y'] });
 * // 返回: 'a=1&b=hello&c&e[]=x&e[]=y'
 *
 * @param obj - 要转换为查询字符串的对象。
 * @returns 生成的查询字符串。
 */
export const stringifyObjectToParams = (obj: Record<string, any>): string => {
  // 预处理对象，移除 undefined 值，将 null 值转换为空字符串
  const processedObj = Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value === null ? '' : value
      }
      return acc
    },
    {} as Record<string, any>
  )

  return qs
    .stringify(processedObj, {
      encode: false,
      arrayFormat: 'brackets',
      encodeValuesOnly: true,
      skipNulls: true,
      addQueryPrefix: false,
    })
    .replace(/=(&|$)/g, '$1') // 移除空值的等号
}
