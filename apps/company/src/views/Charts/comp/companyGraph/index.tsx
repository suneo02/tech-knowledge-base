import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect, useMemo } from 'react'
import { getWindBDGraphData } from '@/api/graph'
import { WIND_BDG_GRAPH_TYPE } from '@/views/Charts/types'
import { Spin } from '@wind/wind-ui'
import SpinLoading from '../spin-loading'
import { translateGraphData } from '../extra'
import { useUpdateEffect } from 'ahooks'
import intl from '@/utils/intl'
import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'
import { CompanyMapTarget } from './extra'
import { pointBuriedByModule } from '@/api/pointBuried/bury'

interface CompanyGraphProps {
  companyCode: string
  actions: any
  waterMask: string
  filter?: any
  saveImgName?: string
  companyOrPersonLinkHandle: (node: any) => void
  width?: number
  height?: number
  primaryColor?: string
}

const CompanyGraph: React.FC<CompanyGraphProps> = ({
  companyCode,
  actions,
  waterMask,
  saveImgName,
  filter,
  width,
  height,
  primaryColor,
  companyOrPersonLinkHandle,
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const localConfig = useMemo(() => {
    const config: any = {}
    const configMap: any = {
      isShowWatermark: waterMask,
      saveImgName,
      width,
      height,
      primaryColor,
    }
    Object.keys(configMap).forEach((key) => {
      if (configMap[key] !== undefined) {
        config[key] = configMap[key]
      }
    })
    return config
  }, [waterMask, saveImgName, width, height, primaryColor])

  useUpdateEffect(() => {
    if (actions.triggerRefresh && actions.triggerRefresh > 0) {
      getData(companyCode)
    }
  }, [actions.triggerRefresh])

  async function getData(companyCode: string, filter?: any) {
    try {
      setLoading(true)
      const res = await getWindBDGraphData({
        type: WIND_BDG_GRAPH_TYPE.EnterpriseChart,
        mainEntity: [{ entityId: companyCode, entityType: 'company' }],
        filter,
      })
      setLoading(false)
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
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  function handleJumpToDetail(entityId: string) {
    companyOrPersonLinkHandle({
      nodeId: entityId,
      nodeType: entityId.length > 15 ? 'person' : 'company',
    })
  }

  function handleJumpToProfile(type: any) {
    // 跳转企业详情
    const url = getUrlByLinkModule(LinksModule.COMPANY, {
      id: companyCode,
      target: type,
    })
    handleJumpTerminalCompatibleAndCheckPermission(url)
    return
  }

  useEffect(() => {
    getData(companyCode, filter)
    pointBuriedByModule(922602100360, {
      currentId: companyCode,
      opId: companyCode,
    })
  }, [companyCode, filter])

  const config = useMemo(() => {
    return { ...JSON.parse(data?.config || '{}'), ...localConfig }
  }, [data, localConfig])

  return (
    <div className="root">
      {loading && <SpinLoading />}
      {!loading && data ? (
        <WindBDGraph
          config={config}
          actions={actions}
          data={data?.relations ? data : null}
          handleJumpToDetail={handleJumpToDetail}
          handleJumpToProfile={handleJumpToProfile}
          emptyText={intl('421499', '暂无数据')}
          data-uc-id="4OJTZD1mK8Y"
          data-uc-ct="windbdgraph"
        />
      ) : null}
    </div>
  )
}

export default CompanyGraph
