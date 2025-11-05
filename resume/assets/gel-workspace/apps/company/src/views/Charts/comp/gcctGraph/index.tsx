import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect, useMemo } from 'react'
import { WIND_BDG_GRAPH_TYPE, getWindBDGraphChildData, getWindBDGraphData } from '@/api/graph'
import { Button, Spin, Menu, Dropdown, message } from '@wind/wind-ui'
import { FilterO, DownO } from '@wind/icons'
import { wftCommon } from '@/utils/utils'
import SpinLoading from '../spin-loading'
import Filter from '../filter'
import { useUpdateEffect } from 'ahooks'
import intl from '@/utils/intl'
import { translateData, translateGraphData } from '../extra'
import { VipPopup } from '@/lib/globalModal'
import global from '@/lib/global'

interface GcctGraphProps {
  companyCode: string
  actions: any
  waterMask: boolean
  investGraph?: boolean
  width?: number
  height?: number
  saveImgName?: string
  companyOrPersonLinkHandle?: (node: any) => void
  primaryColor?: string
  emptyText?: string
}

const GcctGraph: React.FC<GcctGraphProps> = ({
  investGraph,
  companyCode,
  actions,
  waterMask,
  width,
  height,
  saveImgName,
  companyOrPersonLinkHandle,
  primaryColor,
  emptyText,
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOnlyShowParent, setIsOnlyShowParent] = useState<boolean | undefined>()
  const [isOnlyShowChildren, setIsOnlyShowChildren] = useState<boolean | undefined>()
  const [layout, setLayout] = useState('TB')
  const [filter, setFilter] = useState({})
  const [localConfig, setLocalConfig] = useState({})
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  useEffect(() => {
    const config: any = {}
    const configMap: any = {
      isOnlyShowParent: isOnlyShowParent,
      isOnlyShowChildren: isOnlyShowChildren,
      layout,
      isShowWatermark: waterMask,
      saveImgName,
      width,
      height,
      primaryColor,
      lang: window.en_access_config ? 'en' : 'cn',
    }
    Object.keys(configMap).forEach((key) => {
      if (configMap[key] !== undefined) {
        config[key] = configMap[key]
      }
    })
    setLocalConfig(config)
  }, [isOnlyShowParent, isOnlyShowChildren, layout, width, height, waterMask, saveImgName, primaryColor])

  async function getData(companyCode: string, filter?: any) {
    try {
      setLoading(true)
      const res = await getWindBDGraphData({
        type: investGraph ? WIND_BDG_GRAPH_TYPE.InvestmentChart : WIND_BDG_GRAPH_TYPE.EquityPenetrationChart,
        mainEntity: [{ entityId: companyCode, entityType: 'company' }],
        filter,
        noForbiddenWarning: true,
      })
      if (res?.ErrorCode == global.USE_FORBIDDEN) {
        // 无权限，需要弹出vip付费弹框
        setData({})
        VipPopup()
        return
      }
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

  // 展开二次请求数据
  async function handleGetChildData(
    d: any,
    renderPart: 'parent' | 'children',
    updateGraphCallback: (data: any, d: any) => void
  ) {
    try {
      const params: any = {
        ratio: '',
        ratioUp: '',
        status: '全部',
      }
      if (d) {
        // 加载子节点数据
        params.expandNodeId = d.data.id
        params.companyCode = companyCode
        params.type = layout === 'Indent' ? 'parents' : renderPart === 'parent' ? 'parents' : 'children'  // 缩进布局的展开操作，这里仅展示股东数据，参数上需要使用parents
      } else {
        // 加载全部数据
        params.expandNodeId = companyCode
        params.companyCode = companyCode
        params.type = 'root'
      }

      setLoading(true)
      const response = await getWindBDGraphChildData({
        graphType: 'equity-penetration-chart', // 图谱类型
        mainEntity: [
          {
            entityId: companyCode,
            entityType: 'company',
          },
        ],
        filter: {
          expandNodeId: d.data.id,
          type: params.type,
        },
      })
      const res = (response?.Data?.nodeInfo?.list || []) as any[]

      let finalData = res
      if (window.en_access_config) {
        finalData = await translateData(res)
      }
      const list = finalData.map((r) => ({
        ...r,
        id: r.nodeId,
        name: r.nodeName,
      }))
      updateGraphCallback(list, d)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData(companyCode, filter)
  }, [companyCode, filter])

  useUpdateEffect(() => {
    if (actions.triggerRefresh && actions.triggerRefresh > 0) {
      getData(companyCode)
      setLocalConfig({})
    }
  }, [actions.triggerRefresh])

  const config = useMemo(() => {
    return { ...JSON.parse(data?.config || '{}'), ...localConfig }
  }, [data, localConfig])

  const handleChange = (value, type, extraValue) => {
    switch (type) {
      // 改变图表样式
      case 'direct':
        if (value === 1) {
          setLayout('TB')
        } else if (value === 2) {
          setLayout('Compact')
        } else if (value === 3) {
          setLayout('LR')
        } else {
          setLayout('Indent')
        }
        break
      // 改变穿透方向
      case 'relate':
        if (value === 1) {
          setIsOnlyShowParent(false)
          setIsOnlyShowChildren(false)
        } else if (value === 2) {
          setIsOnlyShowParent(true)
          setIsOnlyShowChildren(false)
        } else {
          setIsOnlyShowParent(false)
          setIsOnlyShowChildren(true)
        }
        break
      // 改变企业状态
      case 'state':
        setFilter((prev) => ({
          ...prev,
          enterpriseStatus: value === 2 ? '存续' : undefined,
        }))
        break
      // 改变持股比例
      case 'rate':
        let shareholdingRatio
        if (value === 1) {
          shareholdingRatio = null
        } else if (value === 2) {
          shareholdingRatio = {
            ratio: '50',
          }
        } else if (value === 3) {
          shareholdingRatio = {
            ratio: '30',
          }
        } else if (value === 5) {
          shareholdingRatio = extraValue
        }
        value !== 4 &&
          setFilter((prev) => ({
            ...prev,
            shareholdingRatio,
          }))

        break
    }
  }

  function handleJumpToDetail(entityId: string) {
    companyOrPersonLinkHandle({
      nodeId: entityId,
      nodeType: entityId.length > 15 ? 'person' : 'company',
    })
  }
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <Dropdown
          onVisibleChange={(val) => {
            setFilterModalOpen(val)
          }}
          visible={filterModalOpen}
          overlay={
            <div style={{ width: 320 }}>
              <Filter onlyInvestTree={investGraph} handleChange={handleChange} key={actions.triggerRefresh} />
            </div>
          }
        >
          <Button icon={<FilterO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
            {intl('257655', '筛选')}
          </Button>
        </Dropdown>
      </div>

      {loading && <SpinLoading />}
      {data ? (
        <WindBDGraph
          config={config}
          data={data?.relations ? data : null}
          actions={actions}
          sessionId={wftCommon.getwsd()}
          handleJumpToDetail={handleJumpToDetail}
          handleGetChildData={handleGetChildData}
          emptyText={emptyText}
          chartType="equity"
        />
      ) : null}
    </div>
  )
}

export default GcctGraph
