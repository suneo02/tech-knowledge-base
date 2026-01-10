import { Button } from '@wind/wind-ui'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import intl from '../../utils/intl'
import './relationshipMap.less'

const RelationshipMap = (props) => {
  const companyChart = useRef(null)
  const svgRef = useRef(null)

  function draw() {
    const svgWidth = '1032px'
    const svgHeight = '400px'
    const item = {}

    d3.select(svgRef.current).attr('width', svgWidth)

    // svg画布
    item.baseSvg = d3
      .select(companyChart.current)
      .style({
        width: svgWidth,
      })
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      // .style({
      //     background: "#ffffff"
      // })
      .attr('class', 'svg-container')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
    // .call(zoom)

    // svg容器 (可添加多个svg内容元素)
    item.svgGroup = item.baseSvg.append('g').attr('class', 'gBox')
    // svg内容
    item.svg = item.svgGroup.append('g').attr('transform', 'translate(' + 300 + ',' + 120 + ')')
  }

  useEffect(() => {
    draw()
  }, [])
  return (
    <div className="widget-model">
      <div className="widget-chart-header">
        <div className="title">{intl(props.titleId, props.title)}</div>
        <div className="options">
          <Button className="chart-header-redirect btn-default-normal" data-uc-id="R7YQjElMSZ_" data-uc-ct="button">
            {intl('437439', '全屏查看')}
          </Button>
          <Button className="chart-header-reload btn-default-normal" data-uc-id="G_0JmBWwBkP" data-uc-ct="button">
            {intl('138765', '还原')}
          </Button>
          <Button
            className="chart-header-save btn-default-normal buryClick"
            data-bury="shareAndInvestSaveImgBury"
            data-buryoptype="click"
            data-buryfunctype="picEx"
            data-buryentity="getShareAndInvest"
            data-uc-id="heOysKjrlAt"
            data-uc-ct="button"
          >
            {intl('421570', '保存图片')}
          </Button>
        </div>
      </div>
      <div className="widget-chart-content">
        <div className="mao-screen-area" id="screenArea">
          <div className="chart-loading" id="load_data">
            <img src="../resource/images/Company/loading.gif" />
            {intl('478620', '数据加载中')}
          </div>
          <div className="chart-none" id="no_data">
            {intl('17235', '暂无数据')}
          </div>
          <div className="company-chart" ref={companyChart}>
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelationshipMap
