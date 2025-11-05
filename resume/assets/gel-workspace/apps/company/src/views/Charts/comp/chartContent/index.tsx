import React, { useState, useEffect, useRef, useCallback } from 'react'
import GcctGraph from '../gcctGraph'
import RelatedGraph from '../relatedGraph'
import CompanyGraph from '../companyGraph'
import CtrlGraph from '../ctrlGraph'
import DetachGraph from '../detachGraph'
import CytoGraph from '../cytoGraph'
import { wftCommon } from '@/utils/utils'
import OldCompanyChart from '@/views/Chart/OldCompanyChart'
import { linkToCompany } from '../../handle'
import { WIND_BDG_GRAPH_TYPE } from '@/api/graph'
import { GRAPH_MENU_TYPE, WIND_BDG_GRAPH_MENU_TO_TYPE, GraphMenuTypeWithApi } from '../constants'
import { makeExtraParams } from './extra'
import global from '@/lib/global'
import intl from '@/utils/intl'
import './index.less'

// 持股路径-旧版图
const ShareholderGraph = () => React.lazy(() => import('@/views/Charts/ShareholderGraph'))
const ShareholderGraphComp = ShareholderGraph()

interface ChartContentProps {
  companyCode: string
  actions: any
  waterMask: any
  menu: any
  companyName: string
  linkSourceRIME: boolean
  menuCollapsed?: boolean
  isFinancial?: boolean
}

const ChartContent: React.FC<ChartContentProps> = ({
  companyCode,
  actions,
  waterMask,
  menu,
  companyName,
  linkSourceRIME,
  menuCollapsed,
  isFinancial = false,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef(null)
  const iframeRef = useRef()
  const { type, title } = menu
  const configTypeForApi = WIND_BDG_GRAPH_MENU_TO_TYPE[type as GraphMenuTypeWithApi]
  const isBeneficiaryChart = configTypeForApi === WIND_BDG_GRAPH_TYPE.BeneficiaryChart
  const isCtrlChart = configTypeForApi === WIND_BDG_GRAPH_TYPE.ActualControllerChart
  const primaryColor = linkSourceRIME ? global.THEME_RIME.primary_color : '#00aec7'

  // 更新尺寸的函数
  const updateDimensions = useCallback(() => {
    // 使用setTimeout确保在DOM更新后获取新的尺寸
    setTimeout(() => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current
        console.log('offsetWidth after menu collapse:', offsetWidth)
        console.log('offsetHeight after menu collapse:', offsetHeight)
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        })
      }
    }, 100) // 100ms延迟确保DOM已更新
  }, [])

  const companyOrPersonLinkHandle = useCallback(
    (node) => {
      const { nodeId, nodeType } = node
      if (!nodeId || nodeId?.length < 10) return
      return linkToCompany(nodeId, nodeType === 'company', nodeType === 'person', linkSourceRIME)
    },
    [linkSourceRIME]
  )

  // 初始化和尺寸变化时更新
  useEffect(() => {
    // 初始获取尺寸
    updateDimensions()

    // 监听窗口大小变化
    window.addEventListener('resize', updateDimensions)

    // 清理函数
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [updateDimensions])

  // 监听菜单收起状态变化
  useEffect(() => {
    // 当菜单收起状态改变时，更新尺寸
    updateDimensions()
  }, [menuCollapsed, updateDimensions])

  function getEmptyText(type: GRAPH_MENU_TYPE) {
    switch (type) {
      // 股权穿透图
      case GRAPH_MENU_TYPE.EQUITY_PENETRATION:
        return intl('448814', '该企业暂无股东数据')
      // 对外投资图
      case GRAPH_MENU_TYPE.INVESTMENT:
        return intl('448815', '该企业暂无投资数据')
      // 关联方图谱
      case GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS:
        return intl('448818', '暂未识别到该企业在企业会计准则下的关联方')

      case GRAPH_MENU_TYPE.SSSE_RULES:
        return intl('448819', '暂未识别到该企业在上交所规则下的关联方')

      case GRAPH_MENU_TYPE.SZSE_RULES:
        return intl('448820', '暂未识别到该企业在深交所规则下的关联方')

      case GRAPH_MENU_TYPE.BENEFICIARY_OWNER:
        return intl('448835', '根据银发【2017】235号文件，暂未识别到该企业的受益所有人')

      case GRAPH_MENU_TYPE.BENEFICIARY_PERSON:
        return intl('448816', '根据银发【2017】235号文件，暂未识别到该企业的受益自然人')

      case GRAPH_MENU_TYPE.BENEFICIARY_ORG:
        return intl('448817', '根据银发【2017】235号文件，暂未识别到该企业的受益机构')

      case GRAPH_MENU_TYPE.ACTUAL_CONTROLLER:
        return intl('448834', '根据公开数据计算，暂未找到该企业的实际控制人')

      default:
        return ''
    }
  }

  const renderContent = useCallback(() => {
    const extraParams = makeExtraParams(type)
    const apiParams = {
      type: configTypeForApi,
      mainEntity: [
        {
          entityId: companyCode,
          entityType: 'company' as const,
        },
      ],
      ...(extraParams && { filter: extraParams }),
    }
    const emptyText = getEmptyText(type)

    switch (type) {
      // 股权穿透图
      case GRAPH_MENU_TYPE.EQUITY_PENETRATION:
        return (
          <GcctGraph
            key={type}
            companyCode={companyCode}
            actions={actions}
            waterMask={waterMask}
            width={dimensions.width}
            height={dimensions.height}
            companyOrPersonLinkHandle={companyOrPersonLinkHandle}
            saveImgName={companyName + '_' + title}
            primaryColor={primaryColor}
            emptyText={emptyText}
          />
        )
      // 对外投资图
      case GRAPH_MENU_TYPE.INVESTMENT:
        return (
          <GcctGraph
            key={type}
            investGraph
            companyCode={companyCode}
            actions={actions}
            waterMask={waterMask}
            width={dimensions.width}
            height={dimensions.height}
            saveImgName={companyName + '_' + title}
            companyOrPersonLinkHandle={companyOrPersonLinkHandle}
            primaryColor={primaryColor}
            emptyText={emptyText}
          />
        )
      // 关联方图谱
      case GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS:
      case GRAPH_MENU_TYPE.SSSE_RULES:
      case GRAPH_MENU_TYPE.SZSE_RULES:
      case GRAPH_MENU_TYPE.CBIRC_RULES:
        return (
          <RelatedGraph
            selectedKey={type}
            companyCode={companyCode}
            actions={actions}
            waterMask={waterMask}
            saveImgName={companyName + '_' + title}
            isFinancial={isFinancial}
            width={dimensions.width}
            height={dimensions.height}
            primaryColor={primaryColor}
            companyOrPersonLinkHandle={companyOrPersonLinkHandle}
            emptyText={emptyText}
          />
        )
      // 企业图谱
      case GRAPH_MENU_TYPE.ENTERPRISE:
        return (
          <CompanyGraph
            companyCode={companyCode}
            actions={actions}
            waterMask={waterMask}
            saveImgName={companyName + '_' + title}
            companyOrPersonLinkHandle={companyOrPersonLinkHandle}
            width={dimensions.width}
            height={dimensions.height}
            primaryColor={primaryColor}
          />
        )
      // 疑似关系图谱
      case GRAPH_MENU_TYPE.SUSPECTED_RELATION:
        return (
          <CytoGraph
            companyCode={companyCode}
            waterMask={waterMask}
            config={{
              type: 'force',
              actions: actions,
              direction: 'horizontal',
              primaryColor,
            }}
            width={dimensions.width}
            height={dimensions.height}
            apiParams={apiParams}
          />
        )
      // 实际控制图、受益人图谱
      case GRAPH_MENU_TYPE.BENEFICIARY_OWNER:
      case GRAPH_MENU_TYPE.BENEFICIARY_PERSON:
      case GRAPH_MENU_TYPE.BENEFICIARY_ORG:
      case GRAPH_MENU_TYPE.ACTUAL_CONTROLLER:
        return (
          <CtrlGraph
            companyCode={companyCode}
            waterMask={waterMask}
            saveImgName={companyName + '_' + title}
            config={{
              type: 'detach',
              actions: actions,
              primaryColor,
              direction: isBeneficiaryChart || isCtrlChart ? 'vertical' : 'horizontal',
              levelConfig:
                isBeneficiaryChart || isCtrlChart
                  ? {
                      reverse: true,
                    }
                  : null,
              displayType: isBeneficiaryChart ? 'beneficiary' : isCtrlChart ? 'controller' : '',
              nodeClickHandler: companyOrPersonLinkHandle,
              lang: window.en_access_config ? 'en' : 'cn',
            }}
            width={dimensions.width}
            height={dimensions.height}
            apiParams={apiParams}
            graphMenuType={type}
            emptyText={emptyText}
          />
        )
      // 查关系
      case GRAPH_MENU_TYPE.RELATION_QUERY:
      // 多对一触达
      case GRAPH_MENU_TYPE.MULTI_TO_ONE:
        return (
          <DetachGraph
            companyCode={companyCode}
            config={{
              type: 'detach',
              actions: actions,
              direction: 'horizontal',
              maxPath: -1,
              primaryColor,
              nodeClickHandler: companyOrPersonLinkHandle,
              levelConfig: {
                reverse: true,
                calc: true,
              },
            }}
            waterMask={waterMask}
            saveImgName={companyName + '_' + title}
            apiParams={apiParams}
            graphMenuType={type}
            width={dimensions.width}
            height={dimensions.height}
          />
        )
      // 持股路径
      case GRAPH_MENU_TYPE.SHAREHOLDING_PATH:
        return (
          <>
            <React.Suspense fallback={<div></div>}>
              {<ShareholderGraphComp actions={actions}> </ShareholderGraphComp>}
            </React.Suspense>
          </>
        )
      // 融资图谱
      case GRAPH_MENU_TYPE.FINANCING:
        const origin = wftCommon.usedInClient() ? '//RiskWebServer' : '//wx.wind.com.cn'
        const linkVal = origin + '/wind.risk.platform/index.html?from=GEL&CompanyId=' + companyCode + '#/financeMap'
        return (
          <iframe
            width="100%"
            height="100%"
            ref={iframeRef}
            className="iframe-ref"
            style={{ border: 'none' }}
            src={linkVal}
          ></iframe>
        )

      // 融资历程
      case GRAPH_MENU_TYPE.FINANCING_HISTORY:
        return (
          <OldCompanyChart type={type} companyCode={companyCode} onlyChart={true} bottomMask={false}></OldCompanyChart>
        )
      default:
        return null
    }
  }, [companyCode, menu, dimensions, waterMask, actions, isFinancial])
  console.log('dimensions', dimensions)

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {dimensions.width && dimensions.height ? renderContent() : null}

      {type !== GRAPH_MENU_TYPE.RELATION_QUERY && type !== GRAPH_MENU_TYPE.MULTI_TO_ONE && (
        <div className="chart-content-bottom">
          {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
        </div>
      )}
    </div>
  )
}

export default ChartContent
