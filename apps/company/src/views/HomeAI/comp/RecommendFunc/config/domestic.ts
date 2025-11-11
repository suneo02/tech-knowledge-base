import { createRequest } from '@/api/request'
import { getHeaderAllFuncMenus } from '@/components/Home/AllMenus'
import { isDeveloper } from '@/utils/common.ts'
import { CountDataType } from '@/views/HomeAI'
import { SearchHomeItemData } from '@/views/HomeAI/comp/RecommendFunc/config/type'
import { isNil } from 'lodash'
import { useEffect, useState } from 'react'
import { createItem } from './shared'

// Define the interface for the count data

/**
 * Hook to fetch and manage home entry list with dynamic count data
 * @returns The list of search home entry items with updated count data
 */
export const useHomeEntryList = (): SearchHomeItemData[] => {
  const [funcItems, setFuncItems] = useState<SearchHomeItemData[]>([])
  const [, setLoading] = useState(false)

  useEffect(() => {
    const fetchFuncItems = async () => {
      setLoading(true)
      try {
        // 使用createRequest发送请求
        const apiRequest = createRequest({ serverUrl: '/Wind.WFC.Enterprise.Web/Enterprise/gel/' })

        // 并行获取两页数据
        const [res1, res2] = await Promise.all([
          apiRequest('operation/get/getFunc', {
            params: {
              platform: 'pc',
              pageIndex: 1,
              pageSize: 20,
            },
          }),
          apiRequest('operation/get/getFunc', {
            params: {
              platform: 'pc',
              pageIndex: 2,
              pageSize: 20,
            },
          }),
        ])

        // 合并两页的数据
        const allData = [
          ...(res1.Data?.length && Array.isArray(res1.Data) ? res1.Data : []),
          ...(res2.Data?.length && Array.isArray(res2.Data) ? res2.Data : []),
        ]

        if (allData.length > 0) {
          // 获取共享配置项
          const sharedItems = getHeaderAllFuncMenus()
            .map((item) => item.list)
            .flat()

          // 转换接口返回的数据为SearchHomeItemData格式
          const items = allData
            .map((item) => {
              // 获取idFunc对应的共享配置
              const sharedItem = sharedItems.find((i) => i.id === item.idFunc)
              return {
                key: item.idFunc as any,
                title: item.nameFunc,
                desc: item.descriptionFunc,
                fIcon: item.iconFunc,
                url: sharedItem?.url || '',
                typeFunc: item.typeFunc,
              }
            })
            .filter((item) => (isDeveloper ? true : item.url))

          setFuncItems(items)
        }
      } catch (error) {
        console.error('Failed to fetch function items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFuncItems()
  }, [])

  return funcItems
}

// For backward compatibility
export const SearchHomeEntryList = (countData?: CountDataType): SearchHomeItemData[] => {
  const items = [
    isDeveloper ? createItem('alice') : null,
    createItem('yjhzqy'),
    createItem('gjzdxm'),
    createItem('safari'),
    createItem('bidding-query'),
    createItem('thck'),
    createItem('detach'),
    createItem('relation'),
    createItem('wdtk'),
    createItem('batch-output'),
    createItem('chartplathome'),
    createItem('bid', countData),
    createItem('searchmap'),
    createItem('sxwj'),
    createItem('key-parks'),
    createItem('oversea-com'),
    createItem('group-search'),
    createItem('newcorps', countData),
    createItem('sxsj'), // 这项可能在非终端环境下返回 null
    createItem('cksj'),
    createItem('zxcy'),
    createItem('super'),
  ]

  // 过滤掉 null 值
  return items.filter((item): item is SearchHomeItemData => !isNil(item))
}
