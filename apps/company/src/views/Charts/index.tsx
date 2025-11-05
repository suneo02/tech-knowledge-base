import React, { useState, useCallback, useEffect } from 'react'
import { Layout, ThemeProvider } from '@wind/wind-ui'
import { parseQueryString } from '@/lib/utils'
import {
  OperatorRight,
  InputChangeComp,
  ChartMenu,
  atlasTreeData,
  findKeyInTree,
  ChartHome,
  ChartContent,
  findKeyInTreeByType,
} from './comp'
import './index.less'
import intl from '@/utils/intl'
import '@wind/Wind.Base.Enterprise.Graph/lib/index.css'
import { showExportReportModal, exportRelateChart } from './handle'
import { GRAPH_MENU_TYPE, RELATE_CHART_API_TYPE } from './comp/constants'
import { BuildGraphItem } from '../AICharts/types'
const { Content, Operator } = Layout

/**
 * @description 新版图谱平台
 * 支持从浏览器地址栏传入companycode/companyCode和activeKey参数
 */
const Charts = ({ onBuildGraph }: { onBuildGraph?: (item: BuildGraphItem) => void }) => {
  const qsParam = parseQueryString()
  const code = qsParam.companycode ? qsParam.companycode : qsParam.companyCode || '1015343518' // 默认 融创
  const activeKey = qsParam.activeKey || ''
  const linksource = qsParam.linksource || ''
  const linkSourceRIME = linksource === 'rime' ? true : false

  // 判断activeKey是否能够正确匹配，否则使用默认的atlasplatform
  const keyExists = activeKey ? findKeyInTree(atlasTreeData, activeKey) : false
  const isChartBeneficiary = activeKey === 'chart_qysyr'
  const isChartGlgx = activeKey === 'chart_glgx'
  const realActiveKey = isChartBeneficiary
    ? 'beneficiaryOwner'
    : isChartGlgx
      ? 'accountingStandards'
      : keyExists
        ? activeKey
        : 'atlasplatform'
  const [selectedKeys, setSelectedKeys] = useState(realActiveKey)
  const [companyCode, setCompanyCode] = useState(code)
  const [waterMask, setWaterMask] = useState(true)
  const [isFinancial, setIsFinancial] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  // 操作区actions，有缺省的可补充
  const [actions, setActions] = useState({
    triggerReport: 0,
    triggerSave: 0,
    triggerRefresh: 0,
    triggerLarge: 0,
    triggerSmall: 0,
    triggerFullScreen: 0,
    zoomFactor: 1,
    onZoom: (scale: number) => {
      setActions((prev) => ({ ...prev, zoomFactor: scale }))
    },
  })
  const [menu, setMenu] = useState(null)

  useEffect(() => {
    window.document.title = intl('138167', '图谱平台')
    return () => {
      window.document.title = intl('406815', 'Wind全球企业库')
    }
  }, [])

  // 操作区域handle
  const handleOperatorAction = (type: string, value?: number) => {
    switch (type) {
      case 'exportReport':
        console.log('导出报告')
        handleReport()
        break
      case 'saveImage':
        console.log('保存图片')
        handleSave()
        break
      case 'fullScreen':
        console.log('全屏')
        handleFullScreen()
        break
      case 'restore':
        console.log('还原')
        handleRefresh()
        break
      case 'removeWaterMark':
        console.log('移除水印')
        setWaterMask(false)
        break
      case 'addWaterMark':
        console.log('添加水印')
        setWaterMask(true)
        break
      case 'size':
        console.log('缩放', value)
        handleSize(value)
        break
      default:
        break
    }
  }

  // 切换公司
  const handleChangeCorpAction = ({ newCode, financial, newName }) => {
    if (financial !== isFinancial) {
      console.log('变更 isFinancial', financial)
      setIsFinancial(financial)
    }
    if (newCode && newCode !== companyCode) {
      console.log('变更 companyCode', newCode)
      setCompanyCode(newCode)
      resetActions()
    }
    setCompanyName(newName)
  }

  // 切换图谱
  const handleChangeMenu = (menu) => {
    console.log('menu', menu)
    resetActions()
    setSelectedKeys(menu)
  }

  // 重置操作区
  const resetActions = () => {
    setActions((prev) => ({
      ...prev,
      triggerReport: 0,
      triggerSave: 0,
      triggerRefresh: 0,
      triggerLarge: 0,
      triggerSmall: 0,
      triggerFullScreen: 0,
      zoomFactor: 1,
    }))
  }

  // 外部选中菜单
  const handleSelectMenu = useCallback((key) => {
    if (findKeyInTree(atlasTreeData, key)) {
      setSelectedKeys(key)
    }
  }, [])

  const handleReport = () => {
    // setActions((prev) => ({ ...prev, triggerReport: prev.triggerReport + 1 }))
    // 股权穿透和投资关系图谱支持导出
    if (menu.type === GRAPH_MENU_TYPE.EQUITY_PENETRATION || menu.type === GRAPH_MENU_TYPE.INVESTMENT) {
      showExportReportModal({
        companycode: companyCode,
        corpName: companyName,
        onlyInvestTree: menu.type === GRAPH_MENU_TYPE.INVESTMENT ? true : false,
        linkSourceRIME,
      })
      return
    }
    // 非金融企业不支持导出银保监规则
    if (!isFinancial && menu.type === GRAPH_MENU_TYPE.CBIRC_RULES) return
    // 关联关系图谱支持导出
    exportRelateChart({
      companyCode,
      selType: RELATE_CHART_API_TYPE[menu.type],
      companyName,
      linkSourceRIME,
    })
  }

  const handleFullScreen = () => {
    setActions((prev) => ({ ...prev, triggerFullScreen: prev.triggerFullScreen + 1 }))
  }

  const handleSave = () => {
    setActions((prev) => ({ ...prev, triggerSave: prev.triggerSave + 1 }))
  }

  const handleRefresh = () => {
    setActions((prev) => ({ ...prev, triggerRefresh: prev.triggerRefresh + 1, zoomFactor: 1 }))
  }

  const handleSize = (value: number) => {
    setActions((prev) => ({ ...prev, zoomFactor: value / 100 }))
  }

  useEffect(() => {
    if (!selectedKeys) return
    if (selectedKeys === 'atlasplatform') return
    const menuSelected = findKeyInTreeByType(atlasTreeData, selectedKeys)
    setMenu(menuSelected)
  }, [selectedKeys])

  return (
    // @ts-ignore
    <Layout className="charts-layout">
      <ThemeProvider pattern="normal">
        <ChartMenu
          treeData={atlasTreeData}
          defaultActiveKey={selectedKeys}
          onChangeMenu={handleChangeMenu}
          companyCode={companyCode}
          companyName={companyName}
          onCollapse={(collapsed) => setMenuCollapsed(collapsed)}
        />
      </ThemeProvider>

      {/* @ts-ignore */}
      <Layout className="charts-layout-content">
        {selectedKeys === 'atlasplatform' ? (
          <ChartHome onSelectMenu={handleSelectMenu} onBuildGraph={onBuildGraph} />
        ) : (
          <>
            {/* 操作区 */}
            {/* @ts-ignore */}
            <Operator>
              {menu?.noSearch ? (
                <div className="charts-layout-content-title">{menu.title}</div>
              ) : (
                <InputChangeComp
                  type={selectedKeys}
                  companyCode={companyCode}
                  onChangeCorpAction={handleChangeCorpAction}
                ></InputChangeComp>
              )}
              <OperatorRight
                menu={menu}
                onOperatorAction={handleOperatorAction}
                resetSize={actions.zoomFactor === 1 ? true : false}
                zoomFactor={actions.zoomFactor}
              />
            </Operator>

            {/* 内容区 */}
            {/* @ts-ignore */}
            <Content className="content">
              {menu && (
                <ChartContent
                  menu={menu}
                  actions={actions}
                  companyCode={companyCode}
                  companyName={companyName}
                  linkSourceRIME={linkSourceRIME}
                  menuCollapsed={menuCollapsed}
                  isFinancial={isFinancial}
                  waterMask={waterMask}
                />
              )}
            </Content>
          </>
        )}
      </Layout>
    </Layout>
  )
}

export default Charts
