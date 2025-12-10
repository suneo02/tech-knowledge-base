import { useEffect, useState } from 'react'
import { getServerApi } from '@/api/serverApi'
import { CHINA_FULL, GLOBAL_FULL, OTHER_STATS_API } from './index'
import { GSTabsEnum } from '../../types'
import { outCompanyParam } from '@/handle/searchConfig'
import { hashParams } from '@/utils/links'

interface OtherStats {
  group?: string
  bidding?: string
  iP?: string
  person?: string
}

interface Stats {
  count: number | string
  // TODO use searchApi resultProps
  data: Record<string, unknown>[]
}

// !临时给后端加的，为了个体工商户，后续删除
const TEMP_CONFIG = { version: 1 }

const useStats = (queryText: string, type: GSTabsEnum) => {
  const { getParamValue } = hashParams()
  const areaType = getParamValue('areaType')

  let initialValues
  if (areaType) {
    const code = outCompanyParam.find((c) => c.param === areaType)?.code
    initialValues = { areaCode: code ? code : [] }
  }
  const [chinaStats, setChinaStats] = useState<Stats>(null)
  const [globalStats, setGlobalStats] = useState<Stats>(null)
  const [otherStats, setOtherStats] = useState<OtherStats>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const updateStats = (api: string, data: any) => {
    const stats = { count: data?.Page?.Records || 0, data }
    if (api === CHINA_FULL) setChinaStats(stats)
    else if (api === GLOBAL_FULL) setGlobalStats(stats)
    else if (api === OTHER_STATS_API) setOtherStats(data?.Data || {})
  }

  const getStatsByServerApi = async (api: string) => {
    const data = await getServerApi({
      api,
      noExtra: true,
      params: {
        queryText,
        pageIndex: 0,
        pageSize: 10,
        sort: '-1',
        // !后续删除
        ...TEMP_CONFIG,
        ...initialValues,
      },
    })
    updateStats(api, data)

    return data
  }

  const resetStats = (statsName?: GSTabsEnum) => {
    if (!statsName) resetAllStats()
    else if (statsName === GSTabsEnum.CHINA) setChinaStats(null)
    else if (statsName === GSTabsEnum.GLOBAL) setGlobalStats(null)
    else setOtherStats(null)
  }

  const resetAllStats = () => {
    setChinaStats(null)
    setGlobalStats(null)
    setOtherStats(null)
  }

  const getMainStats = async () => {
    if (type === GSTabsEnum.CHINA) {
      Promise.all([getStatsByServerApi(CHINA_FULL), getStatsByServerApi(GLOBAL_FULL)])
        .then(([chinaCount, globalCount]) => {
          updateStats(CHINA_FULL, chinaCount)
          updateStats(GLOBAL_FULL, globalCount)
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (type === GSTabsEnum.GLOBAL) {
      Promise.all([getStatsByServerApi(GLOBAL_FULL), getStatsByServerApi(CHINA_FULL)])
        .then(([globalCount, chinaCount]) => {
          updateStats(GLOBAL_FULL, globalCount)
          updateStats(CHINA_FULL, chinaCount)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    setLoading(true)
    resetAllStats()
    getMainStats()
    getStatsByServerApi(OTHER_STATS_API)
  }, [queryText])

  return { chinaStats, globalStats, otherStats, resetStats, loading }
}
export default useStats
