import { getcorpiscollect } from '@/api/companyDynamic'
import { getServerApi } from '@/api/serverApi'
import { CompanyInfoInSearch } from 'gel-api'
import { useRef, useState } from 'react'
import { transCorpSearchResult } from './MultiResultList/handleName'

// 扩展企业信息类型，包含收藏状态
export type CompanyInfoInSearchWithCollect = CompanyInfoInSearch & {
  isCollect?: boolean
  statusAfterOriginal?: string
}

// !临时给后端加的，为了个体工商户，后续删除
const TEMP_CONFIG = { version: 1 }

const initialPagination = {
  pageSize: 10,
  pageIndex: 0,
}

const useResultListData = <T extends Record<string, any>>(
  api: string,
  params: T,
  initData?: { Data: any; Page: any },
  showCollect?: boolean
) => {
  const [data, setData] = useState<CompanyInfoInSearchWithCollect[]>()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number>(null)
  const [pagination, setPagination] = useState(initialPagination)
  const paginationRef = useRef(pagination)
  const [forceEnd, setForceEnd] = useState(false)

  const handleParams = () => {
    let notAreaCodeArray = []
    // 如果是大陆企业需要添加参数
    const areaCodeSplit = params?.areaCode?.split(',')
    if (areaCodeSplit?.includes('0300000000')) {
      notAreaCodeArray = [...notAreaCodeArray, ...['0304070000', '0304080000', '0304090000']]
    }

    if (notAreaCodeArray?.length) {
      return { ...params, notAreaCode: notAreaCodeArray.join(',') }
    }

    return {
      ...params,
      ...TEMP_CONFIG,
    }
  }

  const next = async (reset?: boolean) => {
    if (reset) setLoading(true)
    const res = await getServerApi({
      api,
      noExtra: true,
      params: {
        ...paginationRef.current,
        ...handleParams(),
      },
    })
      .finally(() => reset && setLoading(false))
      .catch(() => {
        setForceEnd(true)
      })
    if (!res || res.Data?.length === 0) {
      setForceEnd(true)
    } else {
      handleData(res, reset)
    }
  }
  const handleData = ({ Data, Page }: { Data: any; Page: any }, reset?: boolean) => {
    const _data: CompanyInfoInSearch[] = Data?.search || Data || []
    if (_data?.length < pagination.pageSize) setForceEnd(true)

    // 先展示原始数据，提供快速响应
    setData((prevData) => (reset ? _data : [...(prevData || []), ..._data]))

    // 异步翻译数据，完成后根据 corpId 更新对应的数据
    transCorpSearchResult(_data).then((translatedData) => {
      setData((prevData) => {
        if (!prevData) return translatedData
        // 根据 corpId 匹配并替换数据，保持其他数据（如收藏状态）不变
        return prevData.map((item) => {
          const translatedItem = translatedData.find((t) => t.corpId === item.corpId)
          return translatedItem ? { ...item, ...translatedItem } : item
        })
      })
    })

    if (showCollect) getCollectList(_data)

    const newPagination = {
      ...paginationRef.current,
      pageIndex: paginationRef.current.pageIndex + 1,
    }
    setPagination(newPagination)
    paginationRef.current = newPagination
    setTotal(Page?.Records)
  }
  // 根据数据的corpId获取收藏列表
  const getCollectList = async <U extends Record<string, any> & { corpId: string }>(newData: U[]) => {
    const { Data } = await getcorpiscollect({
      companyCode: newData?.map((item) => item.corpId).join(','),
    })

    // 根据corpId将数组替换已加入的数组，为每个对象添加 isCollect 属性
    setData((prevData) =>
      prevData?.map((item) => ({
        ...item,
        isCollect: Data?.[item.corpId] ?? item.isCollect,
      }))
    )
  }

  const refresh = () => {
    setForceEnd(false)
    setPagination(initialPagination)
    paginationRef.current = initialPagination
    setTotal(null)
    if (pagination.pageIndex === 0 && initData) {
      handleData(initData, true)
      return
    }
    next(true)
  }
  const reset = () => {
    setData([])
    setForceEnd(false)
    setTotal(null)
  }
  const done = forceEnd || (!loading && (total === 0 || total) && data?.length >= total)
  return { data, total, loading, pagination, done, reset, setData, next, refresh }
}

export default useResultListData
