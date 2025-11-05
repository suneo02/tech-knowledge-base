import { ApiResponseForWFC } from '@/types'
import { TCorpDetailNodeKey } from 'gel-types'

export function parseTableApiResponse(data: ApiResponseForWFC<any>, key: TCorpDetailNodeKey) {
  if (data == null || typeof data !== 'object') {
    console.error('API响应数据为空或不是对象', data)
    return
  }

  if (String(data.ErrorCode) != '0') {
    console.error('API响应数据错误', data, key)
    return
  }

  // 如果是工商信息, 直接返回
  if (key == 'BussInfo') {
    return data.Data
  }

  // 如果是 发行股票
  if (key === 'SharedStockFirst' || key === 'SharedStockSecond') {
    if (data.Data && Array.isArray(data.Data)) {
      return data.Data.filter((t) => {
        // 如果是 发行股票 的第一个表格
        if (key === 'SharedStockFirst') {
          return t.securityType !== '存托凭证'
        } else {
          // 如果是 发行股票 的第二个表格
          return t.securityType === '存托凭证'
        }
      })
    }
  }

  if (typeof data.Data === 'object' && !Array.isArray(data.Data) && data.Data != null && 'list' in data.Data) {
    // 如果是其他信息, 则返回 检查 Data 是否是对象，如果是对象，返回 list ，否则返回 Data
    return data.Data.list
  }

  return data.Data
}
