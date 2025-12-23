// @ts-nocheck
import { intlNoIndex } from './intl'
import { wftCommon } from './utils'

const STAFF_BETA_FEATURE_KEY = 'GEL_CB_LYX_LXH_ZWH' // beta功能体验key
const STAFF_BETA_FEATURE_VALUE = 'GelDeveloper' // beta功能体验值

/**
 * 返回数量缩写
 * @param {number|string} num
 * @returns
 * ep:
 * count: 1001 returns: 1k+
 * count: 10001 returns: 1w+
 */
export function formatNumber(count) {
  if (!count) return ''
  const num = Number(count)
  // if (num >= 1000000) {
  //   return (num / 1000000).toFixed(1) + 'M+'
  // } else if (num >= 10000) {
  //   return (num / 10000).toFixed(1) + 'W+'
  // } else if (num >= 1000) {
  //   return (num / 1000).toFixed(1) + 'K+'
  // } else
  if (num > 99) {
    return '99+'
  } else if (num > 0) {
    return num
  } else {
    return ''
  }
}

/**
 * 切片
 * @param {any[]} list
 * @param {number} size
 * @returns
 * ep:
 * list: [1,2,3,4,5] size: 4
 * returns [[1,2,3,4], [5]]
 */
export const chunkList = (list, size) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, index) => list.slice(index * size, index * size + size))

/**
 * 集成国际化文本
 * @param {string | number} txtId
 * @param {string} txt
 * @returns
 */
export function intlTxt(txtId, txt) {
  return txtId ? intlNoIndex(txtId) : txt || ''
}

/**
 * 数组转换对应参数
 * @param {Array} list
 * @param {Object} matchedParams
 * @returns
 * ep:
 * list: [{tagType: '标签名', menu: '菜单名'}]
 * matchedParams: {type: 'tagType', title: 'menu'}
 * returns [{tagType: '标签名', menu: '菜单名', type: '标签名', title: '菜单名'}]
 */
export const getMatchedList = (list, matchedParams) => {
  if (!(Array.isArray(list) && list.length)) {
    console.error('【getMatchedList】caution! please use Array to get matched list')
    return list
  }
  return list.map((res) => getMatchedData(res, matchedParams))
}

/**
 * 对象转换对应参数
 * @param {Object} data
 * @param {Object} matchedParams
 * @returns
 * ep:
 * list: {tagType: '标签名', menu: '菜单名'}
 * params: {type: 'tagType', title: 'menu'}
 * returns {tagType: '标签名', menu: '菜单名', type: '标签名', title: '菜单名'}
 */
export function getMatchedData(data, matchedParams) {
  if (typeof data !== 'object') {
    console.error('【getMatchedData】caution! please use Object to get matched data')
    return data
  }
  Object.entries(matchedParams).map(([newKey, key]) => {
    if (Array.isArray(key)) {
      let result = data
      key.map((eachKey) => (result = result[eachKey]))
      data[newKey] = result
    } else {
      data[newKey] = data[key]
    }
  })
  return data
}

/**
 * 货币与单位与数词的结合
 * @example formatCurrency(1000, 'CNY', '万') // 1000万CNY
 */
export function formatCurrency(money, currency, numeral?) {
  if (money === '0') return `0${currency ? `${currency}` : ''}`
  const formattedMoney = Number(money)
    ? Number(money)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : ''
  return formattedMoney ? `${formattedMoney}${numeral ? `${numeral}` : ''}${currency ? `${currency}` : ''}` : '--'
}

/**
 * 员工权限beta功能体验开关
 */
export const staffBetaFeature = {
  key: STAFF_BETA_FEATURE_KEY,
  value: STAFF_BETA_FEATURE_VALUE,
  get: () => {
    return localStorage.getItem(staffBetaFeature.key)
  },
  set: () => {
    localStorage.setItem(staffBetaFeature.key, staffBetaFeature.value)
  },
  clear: () => {
    localStorage.removeItem(staffBetaFeature.key)
  },
}

/**
 * 是否为开发者环境
 */
export const isDeveloper = staffBetaFeature.get() === staffBetaFeature.value || wftCommon.isDevDebugger()

/**
 * 解析URL参数为JSON数组，支持多种格式：
 * - JSON 数组格式：["module1", "module2"]
 * - 单个字符串：module1
 */
export const parseUrlParamsToJsonArray = (param: string | null): string[] => {
  if (!param) return []

  // 先进行 URL 解码
  const decodedParam = decodeURIComponent(param)

  // 尝试解析为 JSON 数组
  try {
    const parsed = JSON.parse(decodedParam)
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim())
    }
  } catch (e) {
    // 不是有效的 JSON，当作单个字符串处理
  }

  // 单个字符串的情况
  const trimmed = decodedParam.trim()
  return trimmed ? [trimmed] : []
}
