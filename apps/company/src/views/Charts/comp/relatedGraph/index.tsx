import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect, useMemo } from 'react'
import { myWfcAjax } from '@/api/common'
import SpinLoading from '../spin-loading'
import { useUpdateEffect } from 'ahooks'
import { parseQueryString } from '@/lib/utils'
import { RELATE_CHART_API_TYPE } from '../constants'
import { GRAPH_MENU_TYPE } from '../../types'
import intl from '@/utils/intl'
import { translateRelateGraphData } from '../extra'
import { pointBuriedByModule } from '@/api/pointBuried/bury'

interface RelatedGraphProps {
  companyCode: string
  actions: any
  waterMask: string
  filter?: any
  selectedKey: string
  saveImgName?: string
  isFinancial?: boolean
  width?: number
  height?: number
  companyOrPersonLinkHandle: (node: any) => void
  primaryColor?: string
  emptyText?: string
}

const RelatedGraph: React.FC<RelatedGraphProps> = ({
  companyCode,
  actions,
  waterMask,
  selectedKey,
  saveImgName,
  isFinancial = false,
  width,
  height,
  companyOrPersonLinkHandle,
  primaryColor,
  emptyText,
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allListLoading, setAllListLoading] = useState(false)
  const qsParam = parseQueryString()
  const linksource = qsParam.linksource || ''
  const linkSourceF9 = linksource === 'f9' ? true : false
  const emptyLabelFinancial = '该企业不属于银行或保险行业范畴，故当前关联方判定规则对其不适用'
  const [emptyTxt, setEmptyTxt] = useState(emptyText)

  const config = useMemo(() => {
    const config: any = {}
    const configMap: any = {
      isShowWatermark: waterMask,
      type: 'relate',
      saveImgName,
      primaryColor,
    }
    Object.keys(configMap).forEach((key) => {
      if (configMap[key] !== undefined) {
        config[key] = configMap[key]
      }
    })
    return config
  }, [waterMask, saveImgName, primaryColor])

  useUpdateEffect(() => {
    if (actions.triggerRefresh && actions.triggerRefresh > 0) {
      getData(companyCode, selectedKey)
    }
  }, [actions.triggerRefresh])

  const getData = async (companyCode, selectedKey) => {
    try {
      !loading && setLoading(true)

      const newApi = '/graph/company/getIPOGraph/' + companyCode
      const newApiF9 = '/graph/company/getIPOGraphForF9/' + companyCode

      const res = await myWfcAjax(linkSourceF9 ? newApiF9 : newApi, {
        companyCode,
        refresh: Number(RELATE_CHART_API_TYPE[selectedKey]),
      })
      setLoading(false)
      if (!res?.Data) {
        setData({})
        return
      }
      let finalData = res.Data as any
      if (window.en_access_config) {
        finalData = await translateRelateGraphData(res.Data)
      }
      setData(finalData)
    } catch (err) {
      console.error('Failed to get data:', err)
      setData({})
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllList = async (data: any) => {
    try {
      setAllListLoading(true)
      const newApi = '/graph/company/getIPOGraph/' + companyCode
      const newApiF9 = '/graph/company/getIPOGraphForF9/' + companyCode

      const res = await myWfcAjax(linkSourceF9 ? newApiF9 : newApi, data)
      if (!res?.Data) {
        return null
      }
      let finalData = res.Data as any
      if (window.en_access_config) {
        finalData = await translateRelateGraphData(res.Data)
      }
      return finalData
    } catch (err) {
      console.error('Failed to get data:', err)
      return null
    } finally {
      setAllListLoading(false)
    }
  }

  function handleJumpToDetail(entityId: string) {
    companyOrPersonLinkHandle({
      nodeId: entityId,
      nodeType: entityId.length > 15 ? 'person' : 'company',
    })
  }

  useEffect(() => {
    pointBuriedByModule(922602100891, {
      currentId: companyCode,
      opId: companyCode,
      currentPage: selectedKey,
    })
    if (!isFinancial && selectedKey === GRAPH_MENU_TYPE.CBIRC_RULES) {
      setData({})
      setLoading(false)
      setEmptyTxt(emptyLabelFinancial)
      return
    }
    getData(companyCode, selectedKey)
  }, [companyCode, selectedKey, isFinancial])

  return (
    <>
      {loading && <SpinLoading />}
      {!loading && data ? (
        <WindBDGraph
          config={config}
          data={data?.collection ? data : null}
          rule={RELATE_CHART_API_TYPE[selectedKey]}
          companyCode={companyCode}
          waterMask={waterMask}
          actions={actions}
          handleJumpToDetail={handleJumpToDetail}
          handleGetAllList={handleGetAllList}
          emptyText={emptyTxt}
          width={width}
          height={height}
          allListLoading={allListLoading}
          data-uc-id="f4Z7aJq4z"
          data-uc-ct="windbdgraph"
        />
      ) : null}
    </>
  )
}

export default RelatedGraph
