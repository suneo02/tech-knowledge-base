import { useState, useEffect } from 'react'
import { getWindBDGraphData } from '@/api/graph'
import { myWfcAjax } from '@/api/common'
import global from '@/lib/global'
import { VipPopup } from '@/lib/globalModal'
import { translateGraphData } from '../../Charts/comp/extra'
import { wftCommon } from '@/utils/utils'
import { WIND_BDG_GRAPH_TYPE } from '@/api/graph'
import { useAIChartContext } from '../context'

/**
 * @description 实体类型
 */
type EntityType = 'company' | 'person'

/**
 * @description 图表数据接口
 */
interface ChartData {
  relations?: any[]
  nodes?: any[]
  [key: string]: any
}

/**
 * @description 使用图表数据的Hook
 * @author bcheng<bcheng@wind.com.cn>
 */
export const useChartData = (companyCode: string) => {
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  /**
   * @description 获取图表数据
   */
  const fetchChartData = async () => {
    try {
      setLoading(true)
      const params = {
        companyCode,
        type: WIND_BDG_GRAPH_TYPE.ActualControllerChart,
        mainEntity: [
          {
            entityId: companyCode,
            entityType: 'company' as EntityType,
          },
        ],
        noForbiddenWarning: true,
      }
      const res = await getWindBDGraphData(params)

      if (res?.ErrorCode === global.USE_FORBIDDEN) {
        VipPopup()
        setChartData({})
        return
      }

      if (!res?.Data) {
        setChartData({})
        return
      }

      let finalData = res.Data
      if (window.en_access_config) {
        finalData = await translateGraphData(res.Data)
      }

      setChartData(finalData)
    } catch (err) {
      console.error('Failed to get chart data:', err)
      setChartData({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (companyCode) {
      fetchChartData()
    }
  }, [companyCode])

  return {
    loading,
    chartData,
    setChartData,
    refetch: fetchChartData,
  }
}

/**
 * @description 使用AI图表数据的Hook
 * @author bcheng<bcheng@wind.com.cn>
 */
export const useAIChartData = () => {
  return useAIChartContext()
}
