import { request, createRequest } from '@/api/request'
import { SearchHomeItemData } from '@/views/HomeAI/comp/RecommendFunc/config/type'
import { useEffect, useState } from 'react'
import { createItem, getSharedItems } from './shared'
import { isDeveloper } from '@/utils/common.ts'
import { isNil } from 'lodash'
import intl from '@/utils/intl'

// Define the interface for the count data
interface CountData {
  corpCount?: number
  featuredCount?: number
}

// 定义接口返回的数据结构
interface FuncItemResponse {
  iconFunc: string
  nameFunc: string
  tagsFunc: string
  idFunc: string
  descriptionFunc: string
  isOverseasFunc: boolean
  langFunc: string
  platformFunc: string
  sortFunc: number
}

interface ApiResponse {
  Data: FuncItemResponse[]
  ErrorCode: string
  ErrorMessage: string
  Page: {
    CurrentPage: number
    PageSize: number
    Records: number
    TotalPage: number
  }
  State: number
}

/**
 * Calculates a date range for API queries
 * @returns An object with formatted date strings for the query
 */
const calculateDateRange = (): { startDate: string; endDate: string } => {
  const d = new Date()

  // Calculate end date (yesterday with adjustments for weekends)
  let endYear = d.getFullYear()
  let endMonth = d.getMonth() + 1
  let endDay = d.getDate() - 1
  const weekDay = d.getDay()

  // Adjust for weekends
  let adjustment = 0
  if (weekDay === 1) {
    // Monday
    adjustment = 2
  } else if (weekDay === 0) {
    // Sunday (7 in the original code)
    adjustment = 1
  }

  endDay -= adjustment

  // Handle month/year rollover if day becomes zero or negative
  if (endDay <= 0) {
    endMonth -= 1

    // Handle January rollover to previous year
    if (endMonth <= 0) {
      endMonth = 12
      endYear -= 1
    }

    // Set the correct last day of the previous month
    if ([1, 3, 5, 7, 8, 10, 12].includes(endMonth)) {
      endDay = 31 + endDay // endDay is negative, so this is actually subtraction
    } else if (endMonth === 2) {
      // Check for leap year
      const isLeapYear = (endYear % 4 === 0 && endYear % 100 !== 0) || endYear % 400 === 0
      endDay = (isLeapYear ? 29 : 28) + endDay
    } else {
      endDay = 30 + endDay
    }
  }

  // Format end date
  const formattedEndMonth = endMonth < 10 ? `0${endMonth}` : `${endMonth}`
  const formattedEndDay = endDay < 10 ? `0${endDay}` : `${endDay}`

  // Create date object for end date
  const endDate = new Date(`${endYear}-${formattedEndMonth}-${formattedEndDay}`)

  // Calculate start date (2 days before end date)
  const startDateTimestamp = endDate.getTime() - 2 * 24 * 60 * 60 * 1000
  const startDate = new Date(startDateTimestamp)

  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const startDay = startDate.getDate()

  // Format start date
  const formattedStartMonth = startMonth < 10 ? `0${startMonth}` : `${startMonth}`
  const formattedStartDay = startDay < 10 ? `0${startDay}` : `${startDay}`

  return {
    startDate: `${startYear}${formattedStartMonth}${formattedStartDay}`,
    endDate: `${endYear}${formattedEndMonth}${formattedEndDay}`,
  }
}

/**
 * Hook to fetch and manage home entry list with dynamic count data
 * @returns The list of search home entry items with updated count data
 */
export const useHomeEntryList = (): SearchHomeItemData[] => {
  const [countData, setCountData] = useState<CountData>({})
  const [funcItems, setFuncItems] = useState<SearchHomeItemData[]>([])
  const [, setLoading] = useState(false)

  useEffect(() => {
    const fetchCorpCount = async () => {
      try {
        const { startDate, endDate } = calculateDateRange()

        const res = await request('getcrossfilterforhome', {
          matchOldData: true,
          params: {
            createDate: `${startDate}~${endDate}`,
            govlevel: '存续',
            PageSize: 0,
          },
        })
        setCountData((prevData) => ({
          ...prevData,
          corpCount: res.Page.Records,
        }))
      } catch (error) {
        console.error('Failed to fetch count data:', error)
      }
    }

    const fetchFeaturedCount = async () => {
      try {
        const res = await request('corplistrecommend', {
          matchOldData: true,
          params: { PageNo: 0 },
        })
        setCountData((prevData) => ({
          ...prevData,
          featuredCount: res.Page.Records,
        }))
      } catch (e) {
        console.error('Failed to fetch featured count data:', e)
      }
    }

    const fetchFuncItems = async () => {
      setLoading(true)
      try {
        // 使用createRequest发送请求
        const apiRequest = createRequest({ serverUrl: '/Wind.WFC.Enterprise.Web/Enterprise/gel/' })
        const res = (await apiRequest('operation/get/getFunc' as any, {
          params: {
            lang: 'cn',
            platform: 'pc',
            pageSize: 100,
          },
        })) as unknown as ApiResponse

        if (res.ErrorCode === '0' && res.Data && res.Data.length > 0) {
          // 获取共享配置项
          const sharedItems = getSharedItems({
            corpCount: countData.corpCount,
            featuredCount: countData.featuredCount,
          })

          // 转换接口返回的数据为SearchHomeItemData格式
          const items = res.Data.map((item) => {
            // 获取idFunc对应的共享配置
            const sharedItem = sharedItems[item.idFunc as any]

            return {
              key: item.idFunc as any,
              title: item.nameFunc,
              desc: item.descriptionFunc,
              fIcon: item.iconFunc,
              url: sharedItem?.url || '',
              hot: item.tagsFunc === 'HOT',
              new: item.tagsFunc === 'NEW',
            } as SearchHomeItemData
          })

          setFuncItems(items)
        }
      } catch (error) {
        console.error('Failed to fetch function items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCorpCount()
    fetchFeaturedCount()
    fetchFuncItems()
  }, [])

  // 当countData更新时，更新funcItems中的desc
  useEffect(() => {
    if (Object.keys(countData).length > 0 && funcItems.length > 0) {
      // 获取共享配置项
      const sharedItems = getSharedItems({
        corpCount: countData.corpCount,
        featuredCount: countData.featuredCount,
      })

      // 更新funcItems中的desc
      const updatedItems = funcItems.map((item) => {
        const key = item.key
        if (key === 'newcorps' && countData.corpCount) {
          const updatedItem = {
            ...item,
            desc: intl('422030', '近日新增注册企业%家').replace('%', countData.corpCount.toString()),
          }
          // 更新url（如果需要）
          if (sharedItems[key]) {
            updatedItem.url = sharedItems[key].url || ''
          }
          return updatedItem
        } else if (key === 'bid' && countData.featuredCount) {
          const updatedItem = {
            ...item,
            desc:
              countData.featuredCount + (window.en_access_config ? ' ' : '个') + intl('338369', '榜单和科技类企业名录'),
          }
          // 更新url（如果需要）
          if (sharedItems[key]) {
            updatedItem.url = sharedItems[key].url || ''
          }
          return updatedItem
        }
        return item
      })

      setFuncItems(updatedItems)
    }
  }, [countData, funcItems.length])

  return funcItems
}

// For backward compatibility
export const SearchHomeEntryList: SearchHomeItemData[] = [
  isDeveloper ? createItem('alice') : null,
  createItem('gjzdxm'),
  createItem('safari'),
  createItem('bidding-query'),
  createItem('thck'),
  createItem('detach'),
  createItem('relation'),
  createItem('wdtk'),
  createItem('batch-output'),
  createItem('chartplathome'),
  createItem('bid'),
  createItem('searchmap'),
  createItem('sxwj'),
  createItem('key-parks'),
  createItem('oversea-com'),
  createItem('diligence-platf'),
  createItem('group-search'),
  createItem('newcorps'),
  createItem('sxsj'),
  createItem('cksj'),
  createItem('zxcy'),
  createItem('super'),
].filter((item) => !isNil(item))
