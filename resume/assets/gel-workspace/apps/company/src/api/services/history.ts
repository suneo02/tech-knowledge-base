import { SearchHistoryParsed, SearchHistoryType } from 'gel-api/*'
import { request } from '../request'

// 获取搜索历史
export const getSearchHistoryAndSlice = async (type: SearchHistoryType): Promise<SearchHistoryParsed> => {
  try {
    const response = await request('operation/get/searchhistorylist', {
      params: {
        type,
      },
    })

    // 确保返回的数据不超过5条
    if (response.Data && Array.isArray(response.Data)) {
      return response.Data.slice(0, 5).map((item) => {
        let searchParsed: SearchHistoryParsed[number]
        try {
          // 尝试解析 searchKey 为对象，用于支持 { name, value } 格式的历史记录
          const parsed = JSON.parse(item.searchKey)
          // 兜底的 value
          const valueSafe = parsed.value || parsed.name
          // 如果解析出来不是对象或者没有 name，则按原样返回
          if (typeof parsed === 'object' && parsed !== null && (parsed.name || parsed.value)) {
            searchParsed = { ...item, ...parsed, name: parsed.name || valueSafe, value: valueSafe }
          } else {
            searchParsed = { ...item, name: item.searchKey, value: item.searchKey }
          }
        } catch (e) {
          // 解析失败，说明是普通字符串
          searchParsed = { ...item, name: item.searchKey, value: item.searchKey }
        }
        return searchParsed
      })
    }
    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

// 添加搜索历史
export const addSearchHistory = (
  type: SearchHistoryType,
  searchKeyOrObject: string | { name: string; value: string }
) => {
  try {
    let searchKey: string
    if (typeof searchKeyOrObject === 'string') {
      // 如果是字符串，直接使用
      searchKey = searchKeyOrObject
    } else if (typeof searchKeyOrObject !== null) {
      searchKey = JSON.stringify(searchKeyOrObject)
    }

    return request('operation/insert/searchhistoryadd', {
      params: {
        type,
        searchKey,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
