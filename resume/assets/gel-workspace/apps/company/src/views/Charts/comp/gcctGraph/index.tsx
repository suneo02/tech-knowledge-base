import { getWindBDGraphChildData, getWindBDGraphData } from '@/api/graph'
import { pointBuriedByModule } from '@/api/pointBuried/bury'
import global from '@/lib/global'
import { VipPopup } from '@/lib/globalModal'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import {
  GRAPH_LINKSOURCE,
  GRAPH_MENU_TYPE,
  WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE,
  WIND_BDG_GRAPH_TYPE,
} from '@/views/Charts/types'
import { FilterO } from '@wind/icons'
import { Button, Dropdown } from '@wind/wind-ui'
import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import { useUpdateEffect } from 'ahooks'
import { getUrlSearchValue } from 'gel-util/common'
import React, { useEffect, useMemo, useState } from 'react'
import { showExportReportModal } from '../../handle'
import { translateData, translateGraphData } from '../extra'
import Filter from '../filter'
import OperatorRight from '../operatorRight'
import { GraphReportExport } from '../ReportExport'
import SpinLoading from '../spin-loading'
import './index.less'

const DEFAULT_CHART_TYPE = 'equity'

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
  containerRef?: React.RefObject<HTMLDivElement>
  enableZoom?: boolean
  enableFilter?: boolean
  chartType?: string
  emptyComponent?: React.ReactNode
}

interface Filter {
  shareholdingRatio?: {
    ratio: string
  }
  enterpriseStatus?: string
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
  containerRef,
  enableZoom = true,
  enableFilter = true,
  chartType = DEFAULT_CHART_TYPE,
  emptyComponent = null,
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnlyShowParent, setIsOnlyShowParent] = useState<boolean | undefined>()
  const [isOnlyShowChildren, setIsOnlyShowChildren] = useState<boolean | undefined>()
  const [layout, setLayout] = useState('TB')
  const [filter, setFilter] = useState({} as Filter)
  const [localConfig, setLocalConfig] = useState({})
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [rootNode, setRootNode] = useState(null)
  const linksource = getUrlSearchValue('linksource')
  const isF9 = linksource === GRAPH_LINKSOURCE.F9
  const isRime = linksource === GRAPH_LINKSOURCE.RIME
  const [dimensions, setDimensions] = useState({ width, height })

  const [reportModalOpen, setReportModalOpen] = useState(false)

  const [actionOptions, setActionOptions] = useState({
    triggerSave: 0,
    triggerRefresh: 0,
    zoomFactor: 1,
  })

  useEffect(() => {
    if (actions) {
      setActionOptions(actions)
    }
  }, [actions])

  // 监听 width 和 height props 变化，同步更新 dimensions（非F9模式）
  useEffect(() => {
    if (!isF9) {
      setDimensions({ width, height })
    }
  }, [width, height, isF9])

  // F9 模式下的特殊处理
  useEffect(() => {
    if (isF9) {
      document.body.classList.add('width-auto-mode')

      const updateDimensionsFromContainer = () => {
        if (containerRef?.current) {
          const { offsetWidth, offsetHeight } = containerRef.current
          // 在 F9 模式下，优先使用容器的实际尺寸
          setDimensions({ width: offsetWidth, height: offsetHeight })
        }
      }

      // 初始化时设置尺寸
      setTimeout(updateDimensionsFromContainer, 50)

      // 监听窗口尺寸变化
      const handleResize = () => {
        setTimeout(updateDimensionsFromContainer, 50)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        document.body.classList.remove('width-auto-mode')
        window.removeEventListener('resize', handleResize)
      }
    }

    return () => {
      document.body.classList.remove('width-auto-mode')
    }
  }, [isF9])

  // 当 dimensions 变化时，更新 localConfig 中的尺寸信息
  useEffect(() => {
    setLocalConfig((prev) => ({
      ...prev,
      width: dimensions.width,
      height: dimensions.height,
    }))
  }, [dimensions])

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
        ...(isF9 ? { isDetailPage: true } : {}),
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
      const nodeInfo = finalData?.nodeInfo
      const nodes = nodeInfo?.startNodes
      if (nodes?.length) {
        const rootNode = nodeInfo?.list?.find((node) => node?.nodeId === nodes[0]?.nodeId)
        nodes[0].nodeName = rootNode?.nodeName || nodes[0].nodeName // 为了英文版下也能正确获取到名称
        setRootNode(nodes[0])
        setLocalConfig((prev) => ({
          ...prev,
          saveImgName: nodes[0]?.nodeName,
        }))
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
        params.type = layout === 'Indent' ? 'parents' : renderPart === 'parent' ? 'parents' : 'children' // 缩进布局时，展开操作其实是展示股东数据，参数上需要使用parents
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
          ...filter,
        },
        ...(isF9 ? { isDetailPage: true } : {}),
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
      setLoading(false)
      console.log(err)
    }
  }

  useEffect(() => {
    if (investGraph) {
      pointBuriedByModule(922602100371, {
        opActive: 'loading',
        currentPage: 'tzctView',
        opEntity: '对外投资图',
        currentId: companyCode,
        opId: companyCode,
      })
    } else {
      pointBuriedByModule(922602100371, {
        opActive: 'loading',
        currentPage: 'gqctView',
        opEntity: '股权穿透图',
        currentId: companyCode,
        opId: companyCode,
      })
    }
  }, [investGraph, companyCode])

  useEffect(() => {
    getData(companyCode, filter)
  }, [companyCode, filter])

  useUpdateEffect(() => {
    if (actionOptions.triggerRefresh && actionOptions.triggerRefresh > 0) {
      getData(companyCode)
      setLocalConfig({})
    }
  }, [actionOptions.triggerRefresh])

  const config = useMemo(() => {
    return { ...JSON.parse(data?.config || '{}'), ...localConfig, width: dimensions.width, height: dimensions.height }
  }, [data, localConfig, dimensions])

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

  const handleSave = () => {
    setActionOptions((prev) => ({ ...prev, triggerSave: prev.triggerSave + 1 }))
  }

  const handleRefresh = () => {
    setActionOptions((prev) => ({ ...prev, triggerRefresh: prev.triggerRefresh + 1, zoomFactor: 1 }))
  }

  const handleSize = (value: number) => {
    setActionOptions((prev) => ({ ...prev, zoomFactor: value / 100 }))
  }

  const handleReport = () => {
    showExportReportModal({
      companycode: companyCode,
      corpName: rootNode?.nodeName || '',
      onlyInvestTree: false,
      linkSourceRIME: isRime,
      openModal: () => setReportModalOpen(true),
    })
  }
  // 操作区域handle
  const handleOperatorAction = (type: string, value?: number) => {
    switch (type) {
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.ExportReport:
        handleReport()
        break
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.SaveImage:
        handleSave()
        break
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.Restore:
        handleRefresh()
        break
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.Size:
        handleSize(value)
        break
      default:
        break
    }
  }

  return (
    <div className={` gcctGraph ${emptyComponent && data && !data?.relations ? 'gcctGraph-empty' : ''}`}>
      {!enableFilter ? null : (
        <div className="operator">
          {isF9 ? (
            <OperatorRight
              menu={{ type: GRAPH_MENU_TYPE.EQUITY_PENETRATION, exportAction: true }}
              onOperatorAction={handleOperatorAction}
              resetSize={actionOptions.zoomFactor === 1 ? true : false}
              zoomFactor={actionOptions.zoomFactor}
              hideSize={true}
              data-uc-id="mTlFQBDZn"
              data-uc-ct="operatorright"
            />
          ) : null}
          <Dropdown
            onVisibleChange={(val) => {
              setFilterModalOpen(val)
            }}
            visible={filterModalOpen}
            overlay={
              <div style={{ width: 320 }}>
                <Filter
                  onlyInvestTree={investGraph}
                  handleChange={handleChange}
                  key={actionOptions.triggerRefresh}
                  data-uc-id="JtOyrTgRlA"
                  data-uc-ct="filter"
                  data-uc-x={actionOptions.triggerRefresh}
                />
              </div>
            }
            data-uc-id="A1UGcpOQr1"
            data-uc-ct="dropdown"
          >
            <Button
              icon={
                <FilterO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="8fF5QxqzCN"
                  data-uc-ct="filtero"
                />
              }
              data-uc-id="bLkLETsRLH"
              data-uc-ct="button"
            >
              {intl('257655', '筛选')}
            </Button>
          </Dropdown>
        </div>
      )}
      {loading && <SpinLoading />}
      {data ? (
        !data?.relations && emptyComponent ? (
          emptyComponent
        ) : (
          <WindBDGraph
            config={config}
            data={data?.relations ? data : null}
            actions={actionOptions}
            sessionId={wftCommon.getwsd()}
            handleJumpToDetail={handleJumpToDetail}
            handleGetChildData={handleGetChildData}
            emptyText={emptyText}
            chartType={chartType}
            data-uc-id="fNK_aEzXK1"
            data-uc-ct="windbdgraph"
            enableZoom={enableZoom}
          />
        )
      ) : null}
      <GraphReportExport
        companycode={companyCode}
        corpName={rootNode?.nodeName || ''}
        open={reportModalOpen}
        setOpen={setReportModalOpen}
      />
    </div>
  )
}

export default GcctGraph
