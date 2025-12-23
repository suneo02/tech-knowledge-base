import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect } from 'react'
import { getWindBDGraphData } from '@/api/graph'
import { Spin } from '@wind/wind-ui'
import intl from '@/utils/intl'
import SpinLoading from '../spin-loading'
import { translateGraphData } from '../extra'
import { pointBuriedByModule } from '@/api/pointBuried/bury'

interface CytoGraphProps {
  companyCode: string
  waterMask: string
  filter?: any
  config?: any
  saveImgName?: string
  width?: number
  height?: number
  apiParams?: any
  graphMenuType?: string
  linkSourceRIME?: boolean
}

const CytoGraph: React.FC<CytoGraphProps> = ({
  companyCode,
  waterMask,
  config,
  saveImgName,
  width,
  height,
  apiParams,
  graphMenuType,
  linkSourceRIME = false,
  ...props
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function getData() {
    try {
      setLoading(true)
      const res = await getWindBDGraphData(apiParams)
      if (!res?.Data) {
        setData({})
        return
      }
      let finalData = res.Data
      if (window.en_access_config) {
        finalData = await translateGraphData(res.Data)
      }
      setData(finalData)
    } catch (err) {
      setData({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
    pointBuriedByModule(922602100363, {
      currentId: companyCode,
      opId: companyCode,
    })
  }, [companyCode, graphMenuType])

  return (
    <>
      {loading && <SpinLoading />}
      {!loading && data ? (
        <WindBDGraph
          config={config}
          data={data?.relations ? data : null}
          waterMask={waterMask}
          saveImgName={saveImgName}
          emptyText={intl('421499', '暂无数据')}
          width={width}
          height={height}
          {...props}
          data-uc-id="BT-jFL5w1J9"
          data-uc-ct="windbdgraph"
        />
      ) : null}
    </>
  )
}

export default CytoGraph
