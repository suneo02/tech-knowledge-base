import { getcorpiscollect } from '@/api/companyDynamic'
import { getServerApi } from '@/api/serverApi'
import { wftCommon } from '@/utils/utils.tsx'
import { isEn } from 'gel-util/intl'
import { useRef, useState } from 'react'

// !临时给后端加的，为了个体工商户，后续删除
const TEMP_CONFIG = { version: 1 }

const initialPagination = {
  pageSize: 10,
  pageIndex: 0,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useResultListData = <T extends Record<string, any>>(
  api: string,
  params: T,
  initData?: { Data: any; Page: any },
  showCollect?: boolean
) => {
  const [data, setData] = useState<T[]>()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number>(null)
  const [pagination, setPagination] = useState(initialPagination)
  const paginationRef = useRef(pagination)
  const [forceEnd, setForceEnd] = useState(false)

  // const filterArray = () => {
  //   const arrayCode6Set = new Set(params?.areaCode?.split(',')?.map((res) => res.slice(0, 6)))
  //   return RegionJSON?.filter((res) => !arrayCode6Set.has(res.value.slice(0, 6)))
  // }

  const handleParams = () => {
    let notAreaCodeArray = []
    // 如果是大陆企业需要添加参数
    const areaCodeSplit = params?.areaCode?.split(',')
    if (areaCodeSplit?.includes('0300000000')) {
      notAreaCodeArray = [...notAreaCodeArray, ...['0304070000', '0304080000', '0304090000']]
    }
    // if (areaCodeSplit?.includes('180')) {
    //   notAreaCodeArray = [
    //     ...notAreaCodeArray,
    //     ...RegionJSON.filter((res) => res.value !== '180').map((res) => res.value),
    //   ]
    // }
    if (notAreaCodeArray?.length) {
      return { ...params, notAreaCode: notAreaCodeArray.join(',') }
    }

    return {
      ...params,
      // !后续删除
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
  const handleData = ({ Data, Page }, reset?: boolean) => {
    const _data = Data?.search || Data || []
    if (_data?.length < pagination.pageSize) setForceEnd(true)
    setData((prevData) => (reset ? _data : [...(prevData || []), ..._data]))
    if (isEn()) {
      wftCommon.zh2en(_data, (enData: T[]) => {
        console.log('🚀 ~ wftCommon.zh2en ~ enData:', enData)
        setData((prevData) => {
          if (!prevData || !enData) return prevData

          // 使用 Map 优化查找效率
          const enDataMap = new Map(enData.map((item) => [item.corpId, item]))

          // 更新数据，保持原有数据结构，只更新英文相关字段
          return prevData.map((item) => {
            const enItem: T = enDataMap.get(item.corpId)

            if (!enItem) return item
            console.log('🚀 ~ returnprevData.map ~ enItem:', enItem)
            return {
              ...item,
              ...enItem,
              // 根据实际英文字段进行更新
              orgType: item?.orgType,
              corpName: item?.corpName,
              corpNameEng: item?.corpNameEng || enItem?.corpNameEng || enItem?.corpName,
              // 其他需要更新的英文字段...
            }
          })
        })
      })
    }

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
  const getCollectList = async (newData: T[]) => {
    const { Data } = await getcorpiscollect({
      companyCode: newData?.map((item) => item.corpId).join(','),
    })

    // 根据corpId将数组替换已加入的数组
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
