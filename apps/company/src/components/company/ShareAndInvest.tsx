/** @format */

import { CHART_HASH } from '@/components/company/intro/charts'
import { Button, Col, Empty, Row } from '@wind/wind-ui'
import { getUrlSearchValue } from 'gel-util/common'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import GcctGraph from '../../views/Charts/comp/gcctGraph'
import { linkToCompany } from '../../views/Charts/handle'
import { GRAPH_LINKSOURCE, GRAPH_MENU_TYPE } from '../../views/Charts/types'
import { EIsSeparate, generateUrlByModule, KGLinkActiveKeyEnum, LinkModule } from 'gel-util/link'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'

// 常量定义
const CHART_HEIGHT = 450
const CHART_PRIMARY_COLOR = '#00aec7'
const DOM_UPDATE_DELAY = 50
const MIN_NODE_ID_LENGTH = 10

// 组件Props接口定义
interface GqctChartProps {
  companycode: string
  companyname?: string
  title?: string
}

// 组件状态接口定义
interface ChartDimensions {
  width: number
  height: number
}

interface ChartActions {
  triggerSave: number
  triggerRefresh: number
  zoomFactor: number
  onZoom: (scale: number) => void
}

/**
 * 股权穿透图表组件
 * @author bcheng<bcheng@wind.com.cn>
 * @description 展示公司股权穿透关系图，支持缩放、保存、刷新功能
 * @param props - 组件属性
 * @param props.companycode - 公司代码（必需）
 * @param props.companyname - 公司名称（可选）
 * @param props.title - 标题（可选）
 */
const GqctChart: React.FC<GqctChartProps> = ({ companycode, companyname, title }) => {
  const domRef = useRef<HTMLDivElement>(null)
  const linksource = getUrlSearchValue('linksource')
  const linkSourceRIME = linksource === GRAPH_LINKSOURCE.RIME
  const companyCode = companycode
  const companyName = companyname || title || ''

  const [dimensions, setDimensions] = useState<ChartDimensions>({ width: 0, height: 0 })
  const [actions, setActions] = useState<ChartActions>({
    triggerSave: 0,
    triggerRefresh: 0,
    zoomFactor: 1,
    onZoom: (scale: number) => {
      setActions((prev) => ({ ...prev, zoomFactor: scale }))
    },
  })
  // 更新容器尺寸
  const updateDimensions = useCallback(() => {
    if (!domRef.current) return

    // 使用setTimeout确保在DOM更新后获取新的尺寸
    setTimeout(() => {
      if (domRef.current) {
        const { offsetWidth, offsetHeight } = domRef.current
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        })
      }
    }, DOM_UPDATE_DELAY)
  }, [])

  // 跳转到图表全屏页面
  const redirectToChart = useCallback(() => {
    try {
      const baseParams = {
        companycode: companyCode,
        companyname: companyName,
      }
      const url = generateUrlByModule({
        module: LinkModule.KG_PLATFORM,
        params: {
          activeKey: KGLinkActiveKeyEnum.chart_gqct,
          isSeparate: EIsSeparate.True,
          ...baseParams,
        },
      })
      handleJumpTerminalCompatibleAndCheckPermission(url)
    } catch (error) {
      console.error('Error redirecting to chart:', error)
    }
  }, [companyCode, companyName])

  // 处理公司或人员节点点击
  const companyOrPersonLinkHandle = useCallback(
    (node: { nodeId?: string; nodeType?: string }) => {
      try {
        const { nodeId, nodeType } = node
        if (!nodeId || nodeId.length < MIN_NODE_ID_LENGTH) return
        return linkToCompany(nodeId, nodeType === 'company', nodeType === 'person', linkSourceRIME)
      } catch (error) {
        console.error('Error handling company/person link:', error)
      }
    },
    [linkSourceRIME]
  )

  // 保存图片
  const handleSave = useCallback(() => {
    setActions((prev) => ({ ...prev, triggerSave: prev.triggerSave + 1 }))
  }, [])

  // 刷新图表
  const handleRefresh = useCallback(() => {
    setActions((prev) => ({ ...prev, triggerRefresh: prev.triggerRefresh + 1, zoomFactor: 1 }))
  }, [])

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

  // 容器样式常量
  const containerStyle: React.CSSProperties = {
    marginBottom: '32px',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: '120px',
    overflowY: 'hidden',
  }

  if (!companyCode) {
    return (
      <div className="wind-ui-table-empty">
        <Empty status="no-data" direction="horizontal" />
      </div>
    )
  }

  return (
    <div style={containerStyle} ref={domRef}>
      <Box className="gqct-chart">
        <Row className="gqct-header">
          <Col span={18} className="gqct-header-name">
            {companyName}
          </Col>
          <Col className="gqct-header-btn">
            <Button onClick={redirectToChart} data-uc-id="WnW8qzGfn" data-uc-ct="button">
              {intl('437439', '全屏查看')}
            </Button>
            <Button onClick={handleRefresh} data-uc-id="KmGEXnwK6P" data-uc-ct="button">
              {intl('138765', '还原')}
            </Button>
            <Button onClick={handleSave} data-uc-id="ip4vRaTdU3" data-uc-ct="button">
              {intl('421570', '保存图片')}
            </Button>
          </Col>
        </Row>

        {dimensions.width > 0 ? (
          <GcctGraph
            key={GRAPH_MENU_TYPE.EQUITY_PENETRATION}
            companyCode={companyCode}
            actions={actions}
            waterMask={null}
            width={dimensions.width}
            height={CHART_HEIGHT}
            companyOrPersonLinkHandle={companyOrPersonLinkHandle}
            saveImgName={`${companyName}_${GRAPH_MENU_TYPE.EQUITY_PENETRATION}`}
            primaryColor={CHART_PRIMARY_COLOR}
            enableZoom={false}
            containerRef={domRef}
            chartType="companyDetailEquity"
            data-uc-id="det2-TL9-j"
            data-uc-ct="gcctgraph"
            enableFilter={false}
            emptyComponent={
              <div className="wind-ui-table-empty">
                <Empty status="no-data" direction="horizontal" data-uc-id="CN03eC-E0A" data-uc-ct="empty" />
              </div>
            }
            data-uc-x={GRAPH_MENU_TYPE.EQUITY_PENETRATION}
          />
        ) : (
          <div className="wind-ui-table-empty">
            <Empty status="no-data" direction="horizontal" />
          </div>
        )}
      </Box>
    </div>
  )
}

const Box = styled.div`
  margin-top: 12px;

  .gqct-graph-content {
    width: 100%;
    height: 430px;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    border-left: 1px solid #dfdfdf;
    border-right: 1px solid #dfdfdf;
  }
  .gqct-chart {
    overflow: hidden !important;
  }
  .gqct-header {
    height: 36px;
    line-height: 36px;
    background: #e9e9e9;
    padding-left: 15px;
    width: 100%;
    display: flex;
  }
  .gqct-header-name {
    font-weight: bold;
    flex: 1;
  }
  .gqct-header-btn {
    button {
      margin-right: 12px;
    }
  }
  .wind-ui-table-empty {
    border: #ededed 1px solid;
  }
`
export default GqctChart
