import React, { FC, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Spin } from '@wind/wind-ui'
import intl from '../../../utils/intl'
import { parseQueryString } from '../../../lib/utils'
import { RefreshO, SaveO } from '@wind/icons'
import './index.less'
import global from '../../../lib/global'
import { pointBuriedByModule } from '../../../api/pointBuried/bury'
import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'
import { getCompanyMap, getCompanyMapLists } from '../../../api/chartApi'
import { formatLongString } from '../utils'
import {
  calcColor,
  calcMaxy,
  calcMaxyLeft,
  changeCompanyMapData,
  CompanyMapEnum,
  CompanyMapLink,
  CompanyMapTarget,
  getAllNodesGlobal,
  initTreeData,
  traverseTreeId,
} from './extra'
import { wftCommon } from '@/utils/utils'

interface CompanyMapProps {
  companycode?: string
}

const CompanyMap: FC<CompanyMapProps> = ({ companycode }) => {
  const qsParam = parseQueryString()
  const domRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const companyCode = companycode || qsParam['companycode']
  const rootScale = 1.0 // 图形的初始scale

  let investChartId = 0
  let shareholderChartId = 0

  const removeSvgChildDom = () => {
    if (document.querySelector('.company-map-content')) {
      if (document.querySelector('.relatedsvg')) {
        document.querySelector('.company-map-content').removeChild(document.querySelector('.relatedsvg'))
      }
    }
  }

  function getChildData(d: any, left?: boolean, updateChild?: any) {
    !loading && setLoading(true)
    getCompanyMapLists(companyCode, { type: d.typeNumber })
      .then((res) => {
        if (res.ErrorCode === global.SUCCESS && res.Data && res.Data.length) {
          const total = res.Page?.Records
          res.Data.map((tt: any) => {
            tt.name = formatLongString(tt.itemName, 18, 1)
            tt.Id = tt.itemId
          })
          if (total > 50) {
            res.Data.push({
              Id: CompanyMapLink['$$ALL$$'],
              name: intl('138650', '查看全部') + '(' + total + ')',
              type: d.type,
              typeNumber: d.typeNumber,
            })
          }
          d.parent.children = res.Data
          updateChild(d.parent)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function freshChart() {
    removeSvgChildDom()
    !loading && setLoading(true)
    getCompanyMap(companyCode, {})
      .then((res) => {
        if (res.ErrorCode === global.SUCCESS && res.Data) {
          if (window.en_access_config) {
            let tmpData = [];
            let arrLength = 0;
            for (let k in res.Data) {
              if (res.Data[k].items?.length) {
                tmpData = tmpData.concat(
                  res.Data[k].items
                )
              }
            }
            arrLength = tmpData.length;
            wftCommon.zh2en(tmpData, function (endata) {
              if (endata.length === arrLength) {
                const newData = [...endata]
                for (let k in res.Data) {
                  if (res.Data[k].items?.length) {
                    res.Data[k].items = newData.splice(0, res.Data[k].items?.length);
                  }
                }
              }
              const data = changeCompanyMapData(res.Data, companyCode)
              setData(data)
            })
          } else {
            const data = changeCompanyMapData(res.Data, companyCode)
            setData(data)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function thirdSaveEvent(e) {
    const companyName = data?.leftRoot?.itemName

    const d3Zoom = window.d3Zoom
    // TODO 保存图谱 埋点
    // pointBuriedByModule
    const serializer = new XMLSerializer()
    const svgCopy = document.querySelector('.relatedsvg') as SVGGraphicsElement
    const toExport = svgCopy.cloneNode(true) as SVGGraphicsElement
    const bb = svgCopy.getBBox()
    toExport.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width * 10 + ' ' + bb.height * 10)
    // @ts-expect-error ttt
    toExport.setAttribute('width', bb.width * 10)
    // @ts-expect-error ttt
    toExport.setAttribute('height', bb.height * 10)
    let translate = d3Zoom.translate()
    translate = translate[0] + 20 + ',' + (translate[1] + 20)
    toExport
      .querySelector('.gBox')
      .setAttribute('transform', 'translate(' + translate + ')scale(' + d3Zoom.scale() + ')')
    const source = serializer.serializeToString(toExport)
    const images = new Image()
    images.src = `data:image/svg+xml;charset=ufg-8,${encodeURIComponent(source)}`
    const canvas = document.createElement('canvas')
    canvas.width = bb.width + 40
    canvas.height = bb.height + 40
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, 80000, 80000)
    if (canvas.width > 50000 || canvas.height > 50000) {
      window.alert('抱歉，保存图片资源过大， 请您收起部分节点后重试!')
      return false
    }
    let qual = 1 // 图片质量
    if (canvas.height > 8000) {
      qual = 0.7
    } else if (canvas.height > 6000) {
      qual = 0.8
    } else if (canvas.width > 5000) {
      qual = 0.9
    }
    images.onload = function () {
      context.drawImage(images, 0, 0)
      setTimeout(function () {
        const a = document.createElement('a')
        a.download = companyName + '_企业图谱' + '.png'
        a.href = canvas.toDataURL('image/jpeg', qual)
        a.click()
      })
    }
  }

  function drawMap() {
    investChartId = 0
    shareholderChartId = 0
    const pLeft = domRef.current.offsetLeft || 0
    const contentElement = document.getElementsByClassName('company-map-content')[0] as HTMLElement
    const initW = contentElement.offsetWidth
    const initH = contentElement.offsetHeight
    const widthFromLeftScreen = initW + pLeft + 16 // 16 对应 paddingleft
    drawSvg(initW, initH, [-widthFromLeftScreen / 2 + 100, -initH / 2 + 20, initW, initH])
  }

  function drawSvg(initW, initH, boxSize) {
    d3.select('.relatedsvg').remove()
    const svg = d3
      .select('.company-map-content')
      .append('svg')
      .attr('class', 'relatedsvg')
      .attr('viewBox', boxSize)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', initW)
      .attr('height', initH)
    const g = svg
      .append('g')
      .attr('class', 'gBox')
      .attr('transform', 'scale(' + rootScale + ')')
    // 用来承载 svg子元素 做移动处理
    const zooms = d3.behavior
      .zoom()
      .scaleExtent([1 - rootScale + 0.7, 1 - rootScale + 1.5])
      .on('zoom', zoomed)
    svg.call(zooms)
    svg.call(zooms).on('dblclick.zoom', null) // 去除鼠标双击放大效果
    // @ts-ignore
    window.d3Zoom = zooms

    function zoomed() {
      let scale = d3.event.scale ? d3.event.scale : rootScale
      scale = scale + rootScale - 1
      g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + scale + ')')
    }

    const leftRoot = data.leftRoot
    const rightRoot = data.rightRoot
    if (leftRoot?.children?.length + rightRoot?.children?.length > 0) {
      // children.length不同时为0
      drawGraph()
    }
  }

  function getAllNodes(data, obj) {
    ++investChartId
    if (data.id && data.id % 2 !== investChartId % 2) {
      ++investChartId
    }
    data.id = data.id || investChartId
    getAllNodesGlobal(data, obj, getAllNodes)
  }

  function getAllNodesLeft(data, obj) {
    ++shareholderChartId
    if (data.id && data.id % 2 !== shareholderChartId % 2) {
      ++shareholderChartId
    }
    data.id = shareholderChartId
    getAllNodesGlobal(data, obj, getAllNodesLeft)
  }

  function drawGraph() {
    const leftRoot = data.leftRoot
    const rightRoot = data.rightRoot
    traverseTreeId(leftRoot)
    traverseTreeId(rightRoot)
    initTreeData(leftRoot)
    initTreeData(rightRoot)

    const duration = 400,
      // 节点矩形宽度
      rectWidth = 80,
      // 节点矩形宽度
      rectHeight = 28,
      // 图形之间的水平间隙
      gapX = 100,
      // 图形之间的竖直间隙
      gapY = 250

    const g = d3.select('.gBox')
    const cluster = d3.layout
      .tree()
      .nodeSize([100, 250])
      .separation((a, b) => {
        if (a.depth === 1) return 1
        return a.parent === b.parent ? 0.25 : 0.5
      })
    // node节点
    const gnode = g.append('g').attr('class', 'gnode')
    const glink = g.append('g').attr('class', 'glink') // 子元素向左边延伸的线
    const glinkv = g.append('g').attr('class', 'glinkv') // 画子节点总的连接线
    const glinkH = g.append('g').attr('class', 'glinkH') // 父元素链接子元素的水平线

    // ========= 右边节点结构
    const gnode2 = g.append('g').attr('class', 'gnode')
    const glinks2 = g.append('g').attr('class', 'glinks')
    const glinkv2 = g.append('g').attr('class', 'glinkv')
    const glinkH2 = g.append('g').attr('class', 'glinkH')

    const update = (source: any) => {
      const nodess = cluster.nodes(rightRoot)
      const links = cluster.links(nodess)

      const tmp = { list: [rightRoot] }
      getAllNodes(rightRoot, tmp)

      const descendants = tmp.list
      cluster(rightRoot) // 计算右边的树形结构
      const vertical = calcMaxy(descendants)
      // 绘制节点初始位置 子节点
      const nodeP = gnode.selectAll('g').data(descendants, (d) => d.id)
      const nodeEnter = nodeP
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.y0 === undefined ? source.y : source.y0},${source.x0 == undefined ? source.x : source.x0})`
        ) // 竖向的

      // 根节点处理
      nodeEnter
        .filter(function (d) {
          return d.depth === 0
        })
        .append('rect')
        .attr('stroke-width', 1)
        .attr('width', function (d) {
          const len = d.name.length
          return len * 10 + 40
        })
        .attr('x', function (d) {
          const len = d.name.length
          if (d.depth == 0) {
            return -20
          }
          if (len > 12) {
            return 0 - 4 * len
          }
          return 0
        })
        .style('font-weight', 'bold')
        .attr('height', rectHeight + 4)
        .attr('fill', (d) => '#00aec7')
        .attr('rx', 3)
        .attr('ry', 3)

      // 边框的处理
      nodeEnter
        .filter((d) => d.borderLine)
        .append('rect')
        .attr('stroke-width', 1)
        .attr('width', function (d) {
          const len = d.name.length / 1.8
          return len * 10 + 40
        })
        .attr('x', function (d) {
          const len = window.en_access_config ? d.name.length / 2 : d.name.length
          if (len > 12) {
            return 0 - 4 * len
          }
          return 0
        })
        .attr('height', rectHeight - 4)
        .attr('fill', function (d) {
          return calcColor(d)
        })
        .style('opacity', '0.2')
        .on('click', (d) => {
          toggle(d)
        })
        .style('cursor', (d) => (d.isModule ? 'auto' : 'pointer'))
        .attr('rx', 1)
        .attr('ry', 1)

      nodeEnter
        .append('text')
        .attr('dx', (d) => {
          const len = d.name.length
          if (d.depth === 0) {
            return len > 12 ? (len - 12) * 5 + 60 : 60 - (12 - len) * 5
          }
          if (d.isModule && d.typeNumber == CompanyMapEnum.shareholder) return window.en_access_config ? 10 : 20
          return window.en_access_config ? 8 : 16
        })
        .attr('dy', (d) => (d.depth === 0 ? 20 : 18)) // 16
        .append('tspan')
        .attr('class', (d) => {
          if (d.isModule) return 'tspan-module'
          if (d.Id === CompanyMapLink['$$ALL$$'] || d.Id === CompanyMapLink['$$MORE$$']) return 'tspan-extra'
          if (d.Id?.length < 10 || /\$/.test(d.Id)) return 'tspan-txt'
          return 'tspan-link'
        })
        .style('fill', function (d) {
          return d.depth === 0 ? '#ffffff' : '#333333'
        })
        .style('font-size', (d) => (d.dpeth == 0 ? 14 : 12))
        .on('click', function (d) {
          if (d.depth == 0) return
          toggle(d)
        })
        .text((d) => (d.name ? d.name : '--'))
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start'))
        .filter((d) => !d.isModule)
        .append('title')
        .text((d) => (d.itemName ? d.itemName : ''))

      nodeP
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return `translate(${d.y},${d.x})`
        })
      nodeP
        .exit()
        .transition()
        .remove()
        .attr('transform', function (d) {
          return `translate(${source.y},${source.x})`
        })
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
      // 节点右边伸展线
      const linkP = glink.selectAll('line').data(links, (d) => d.target.id) // 画节点左边伸出的线
      const linkEnter = linkP.enter().append('line').attr('class', 'link')

      linkP
        .attr('x1', function (d) {
          return d.target.y
        })
        .attr('x2', (d) => {
          if (d.source.depth === 0) {
            const len = d.source.name.length
            const width = len * 10
            return d.target.y - (d.target.y - d.source.y - width) / 2
          }
          return d.target.y - (d.target.y - d.source.y - rectWidth) / 2
        })
        .attr('y1', (d) => d.target.x + rectHeight / 2)
        .attr('y2', (d) => d.target.x + rectHeight / 2)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkP.exit().remove()
      // 节点竖直方向连接总线
      const linkVer = glinkv.selectAll('line').data(vertical, (d) => d.id) // 画子节点总的连接线
      const verticalEnter = linkVer.enter().append('line')

      linkVer
        .attr('class', 'vlink')
        .attr('y1', (d) => d.minX + rectHeight / 2 - 0.5)
        .attr('y2', (d) => d.maxX + rectHeight / 2 + 0.5)
        .attr('x1', (d) => {
          if (d.depth === 0) {
            const len = d.name.length
            const width = len * 10
            return d.maxY - (d.maxY - d.y - width) / 2
          }
          return d.maxY - (d.maxY - d.y - rectWidth) / 2
        })
        .attr('x2', (d) => {
          if (d.depth === 0) {
            const len = d.name.length
            const width = len * 10
            return d.maxY - (d.maxY - d.y - width) / 2
          }
          return d.maxY - (d.maxY - d.y - rectWidth) / 2
        })
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkVer.exit().remove()
      // 画父节点连接自节点的线 此处可以替换为箭头之类的东西
      const linkHor = glinkH.selectAll('line').data(vertical, (d) => d.id) // 画父节点连接自节点的线 此处可以替换为箭头之类的东西
      // let linkHor = glinkH.selectAll('line').data(vertical); // 画父节点连接自节点的线 此处可以替换为箭头之类的东西
      const verticalEnterH = linkHor.enter().append('line') // image xlink:href

      linkHor
        .attr('x1', function (d) {
          var len = d.name ? d.name.length : 0
          const w = len * 10 + 40
          if (d.depth == 0) {
            var len = d.name.length
            return len * 10 + 20
          }
          if (len > 12) {
            return d.y + (len * 17) / 2
          }
          return d.y + w
        })
        .attr('x2', (d) => {
          if (d.depth === 0) {
            const len = d.name.length
            const width = len * 10
            return d.maxY - (d.maxY - d.y - width) / 2
          }
          return d.y + rectWidth + (d.maxY - d.y - rectWidth) / 2
        })
        .attr('y1', (d) => d.x + rectHeight / 2)
        .attr('y2', (d) => d.x + rectHeight / 2)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkHor.exit().remove()
    }
    const updateLeft = (source) => {
      const nodess2 = cluster.nodes(leftRoot)
      const links2 = cluster.links(nodess2)

      const tmp = { list: [data.leftRoot] }
      getAllNodesLeft(data.leftRoot, tmp)
      cluster(leftRoot) // 计算左边的树形结构
      const descendants2 = tmp.list
      descendants2.forEach((d, i) => {
        return (d.y *= -1)
      })
      // 初始计算的时候是 右边的树形结构，乘以-1变成左边的树形结构
      const vertical2 = calcMaxyLeft(descendants2)

      const nodeP2 = gnode2.selectAll('g.node').data(descendants2, (d) => `id2${d.id}`)
      const nodeEnter2 = nodeP2
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.y0 == undefined ? source.y : source.y0},${source.x0 == undefined ? source.x : source.x0})`
        ) // 竖向的

      // 边框的处理
      nodeEnter2
        .filter((d) => d.borderLine)
        .append('rect')
        .attr('stroke-width', 1)
        .attr('width', function (d) {
          if (window.en_access_config) {
            const len = d.name.length / 2
            return len * 10 + 40
          } else {
            if (d.isModule) return rectWidth
            const len = d.name.length
            return len * 10 + 40
          }
        })
        .attr('x', function (d) {
          const len = d.name.length
          if (len >= 11) {
            return 0 - 4 * len
          }
          return 0
        })
        .attr('height', rectHeight - 4)
        .attr('fill', function (d) {
          return calcColor(d)
        })
        .style('opacity', '0.2')
        .on('click', (d) => {
          toggle(d, true)
        })
        .style('cursor', 'pointer')
        .attr('rx', 1)
        .attr('ry', 1)

      nodeEnter2
        .filter((d) => d.depth !== 0)
        .append('text')
        .attr('dx', (d) => {
          if (d.isModule) {
            return window.en_access_config ? 30 + (d.name.length / 2 - 4) * 5 : 65 + (d.name.length - 4) * 5
          }
          return window.en_access_config ? 30 : 65
        })
        .attr('dy', 18) // 65
        .style('text-anchor', 'end')
        .append('tspan')
        .attr('class', (d) => {
          if (d.isModule) return 'tspan-module'
          if (d.Id === CompanyMapLink['$$ALL$$'] || d.Id === CompanyMapLink['$$MORE$$']) return 'tspan-extra'
          if (d.Id?.length < 10 || /\$/.test(d.Id)) return 'tspan-txt'
          return 'tspan-link'
        })
        .style('font-size', 12)
        .text((d) => (d.name ? d.name : '--'))
        .on('click', function (d) {
          toggle(d, true)
        })
        .text((d) => (d.name ? d.name : '--'))
        .filter((d) => !d.isModule)
        .append('title')
        .text((d) => (d.itemName ? d.itemName : ''))

      nodeP2
        .transition()
        .duration(duration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
      nodeP2.exit().remove().attr('fill-opacity', 0).attr('stroke-opacity', 0)

      const linkP2 = glinks2.selectAll('line').data(links2, (d) => `${d.target.id}`)
      const linkEnter2 = linkP2.enter().append('line').attr('class', 'link')

      const linkVer2 = glinkv2.selectAll('line').data(vertical2, (d) => d.id) // 画子节点总的连接线
      const verticalEnter2 = linkVer2.enter().append('line')

      const linkHor2 = glinkH2.selectAll('line').data(vertical2, (d) => d.id) // 画父节点连接自节点的线 此处可以替换为箭头之类的东西
      const verticalEnterH2 = linkHor2.enter().append('line')

      linkP2
        .attr('x1', (d) => d.target.y + rectWidth)
        .attr('x2', (d) => d.target.y + rectWidth + (gapY - rectWidth) / 2) // (d.source.y - d.target.y - 80) / 2
        .attr('y1', (d) => d.target.x + rectHeight / 2)
        .attr('y2', (d) => d.target.x + rectHeight / 2)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkP2.exit().remove()

      linkVer2
        .attr('class', 'vlink')
        .attr('y1', (d) => d.maxX + rectHeight / 2 + 0.5)
        .attr('y2', (d) => d.minX + rectHeight / 2 - 0.5)
        .attr('x1', (d) => d.maxY - (d.maxY - d.y - rectWidth) / 2)
        .attr('x2', (d) => d.maxY - (d.maxY - d.y - rectWidth) / 2)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkVer2.exit().remove()

      linkHor2
        .attr('x1', function (d) {
          if (d.depth == 0) {
            return d.y - 20
          }
          const len = d.name.length
          if (len > 5) {
            // 超出 处理
            const x = len - 4
            return d.y - x * 10
          }
          return d.y
        })
        .attr('x2', (d) => d.y - (gapY - rectWidth) / 2)
        .attr('y1', (d) => d.x + rectHeight / 2)
        .attr('y2', (d) => d.x + rectHeight / 2)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')

      linkHor2.exit().remove()

      descendants2.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }
    update(rightRoot)
    updateLeft(leftRoot)

    function toggle(d, bol?: boolean) {
      if (d.depth == 0) return
      if (d.Id === CompanyMapLink['$$ALL$$']) {
        // 跳转企业详情
        const url = getUrlByLinkModule(LinksModule.COMPANY, {
          id: companyCode,
          target: CompanyMapTarget[d.type],
        })
        handleJumpTerminalCompatibleAndCheckPermission(url)
        return
      }
      if (d.children || d._children) {
        if (d.children) {
          d._children = d.children
          d.children = null
        } else {
          d.children = d._children
          d._children = null
        }
        if (!bol) {
          update(d)
        } else {
          updateLeft(d)
        }
        return
      }
      if (d.Id === CompanyMapLink['$$MORE$$']) {
        if (!bol) {
          getChildData(d, !bol, update)
        } else {
          getChildData(d, bol, updateLeft)
        }
      }
      //非有效的人物/企业id return
      if (d.Id.length < 10 || /\$/.test(d.Id)) return
      if (d.Id.length > 15) {
        // 跳转人物详情
        const url = getUrlByLinkModule(LinksModule.CHARACTER, {
          id: d.Id,
        })
        handleJumpTerminalCompatibleAndCheckPermission(url)
      } else {
        // 跳转企业详情
        const url = getUrlByLinkModule(LinksModule.COMPANY, {
          id: d.Id,
        })
        handleJumpTerminalCompatibleAndCheckPermission(url)
      }
    }
  }

  useEffect(() => {
    pointBuriedByModule(922602100360)
    if (!companyCode) return
    freshChart()
  }, [companyCode])

  useEffect(() => {
    if (!data) return
    drawMap()
  }, [data])

  return (
    <div className="company-map-instance" ref={domRef}>
      <div className="chart-icons">
        {/* @ts-expect-error */}
        <SaveO onClick={thirdSaveEvent} />
        {/* @ts-expect-error */}
        <RefreshO
          onClick={() => {
            setLoading(true)
            freshChart()
          }}
        />
      </div>

      <div
        className="company-map-content chart-content-watermask"
        style={!loading && !data ? { height: '100%', borderLeft: 'none', borderRight: 'none' } : null}
      >
        {loading && companyCode ? <Spin className="gqct-spin" tip="Loading..."></Spin> : null}
        {(!loading && !data) || !companyCode ? (
          <div className="wind-ui-table-empty">
            <span>
              {window.en_access_config ? null : (
                <span role="img" aria-label="frown" className="wicon-svg wicon-frown-o">
                  <svg
                    viewBox="0 0 18 18"
                    focusable="false"
                    className=""
                    data-icon="frown"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 .9a8.1 8.1 0 110 16.2A8.1 8.1 0 019 .9zm0 1.2a6.9 6.9 0 100 13.8A6.9 6.9 0 009 2.1zm0 7.8a3.1 3.1 0 013.09 2.86v.17c.01.1-.06.17-.15.17h-.87c-.07 0-.13-.04-.16-.12l-.01-.05a1.9 1.9 0 00-3.79-.14v.14c-.01.1-.09.17-.18.17h-.86a.17.17 0 01-.17-.17l.01-.18A3.1 3.1 0 019 9.9zm-3-4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm6 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
                      fillRule="nonzero"
                    ></path>
                  </svg>
                </span>
              )}
              {intl('132725', '暂无数据')}
            </span>
          </div>
        ) : null}
      </div>
      {/* <div className="chart-bottom">计算结果基于公开信息和第三方数据利用大数据技术独家计算生成</div> */}
    </div>
  )
}

export default CompanyMap
