import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Spin } from '@wind/wind-ui'
import { getCorpModuleInfo } from '../../api/companyApi'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import { parseQueryString } from '../../lib/utils'
import { FileTextO, RefreshO, SaveO } from '@wind/icons'
import './ShareAndInvestTree.less'
import global from '../../lib/global'
import { VipPopup } from '../../lib/globalModal'
import {
  createIcon,
  createLegend,
  createTag,
  createText,
  gqctLabelFirst,
  gqctLabelSecond,
  IconTypeEnum,
  TagTypeEnum,
} from './utils'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { linkToCompany } from './handle'
import sy2 from '../../assets/imgs/chart/sy2.png'
import { CHART_HASH } from '@/components/company/intro/charts'

const CompanyChart = {}

/**
 * 判断公司名称为全大写或带数字和字符的大写字母
 */
function nameIsUpper(name) {
  return /^[A-Z0-9]+[A-Z0-9\W]*$/.test(name)
}

function calcMaxy(data) {
  let vertical = []
  data.forEach((d, i) => {
    // 计算子节点的x y方向的最值
    if (d.children && d.children.length > 0) {
      let list = d.children
      d.maxX = list[0].x
      d.minX = list[0].x
      d.maxY = list[0].y
      vertical.push(d)
      for (let k of d.children) {
        if (k.x > d.maxX) d.maxX = k.x
        if (k.x < d.minX) d.minX = k.x
      }
    }
  })
  return vertical
}

function calcMaxyLeft(data) {
  let vertical2 = []
  let minY = 0,
    maxY = 0
  data.forEach((d, i) => {
    // 计算子节点的x y方向的最值
    if (d.x > maxY) maxY = d.x
    if (d.x < minY) minY = d.x
    if (d.children && d.children.length > 0) {
      var list = d.children
      d.maxX = list[0].x
      d.minX = list[0].x
      d.maxY = list[0].y
      vertical2.push(d)
      for (var k of d.children) {
        if (k.x > d.maxX) d.maxX = k.x
        if (k.x < d.minX) d.minX = k.x
        // if (k.y > d.maxY) d.maxY = k.y;
        if (k.x > maxY) maxY = k.x
        if (k.x < minY) minY = k.x
      }
    }
  })
  return vertical2
}

function getAllNodesGlobal(data, obj, fn) {
  if (!data.Id) {
    data.Id = '$$' + data.name
  }
  if (window.en_access_config) {
    data._nameIsEn = true
  } else {
    if (data.name.charCodeAt(0) < 255 && data.name.charCodeAt(data.name.length - 1) < 255) {
      data._nameIsEn = true
    }
  }
  var margin = 2
  if (nameIsUpper(data.name)) {
    data._nameIsUpper = true
  }
  data._namelen = data._nameIsEn ? data.name.length / margin : data.name.length
  // if (data.listed || data.issued || data.newInRecentYear || wftCommon.unNormalStatus.indexOf(data.reg_status) > -1) {
  // data._multiline = true // 有标签 展示多行
  // }
  var list = obj.list || []
  if (data.children && data.children.length) {
    obj.list = list.concat(data.children)
    data.children.forEach((t) => {
      fn(t, obj)
    })
  }
}

// Node节点字体大小在不同场景下的设置
// 1. 当节点深度为0时，根据是否为英文节点和节点名称长度来设置字体大小
// 2. 当节点为多行时，根据节点名称长度来设置字体大小，超长10则设置为11，否则设置为14
// 3. 当节点为单行时，根据节点名称长度来设置字体大小，超长20则设置为11，如果全大写则超出9则设置为11，否则设置为13
function nodeFontSizeSet(d) {
  if (!d) return 14
  if (d.depth == 0) return window.en_access_config || d._nameIsEn ? (d._namelen >= 9 ? 12 : 13) : 15
  if (d._multiline) {
    if (d._namelen > 10) {
      return 11
    } else {
      return 14
    }
  } else {
    if (d._namelen > 20) {
      return 11
    } else if (d._nameIsUpper) {
      return d._namelen >= 9 ? 11 : 13
    }
  }
  return 14
}

function ShareAndInvestTree(props) {
  const [loading, setLoaded] = useState(true)
  const domRef = useRef(null)
  const qsParam = parseQueryString()
  const fromf9 = props['linksource'] === 'f9' ? true : false
  const cmd = fromf9 ? 'tracingStockLevelForF9' : 'tracingstocklevel'
  const linkSourceRIME = props['linksource'] === 'rime' ? true : false
  const waterMask = qsParam.nowatermask ? false : props.waterMask === false ? false : true
  const primary_color = linkSourceRIME ? global.THEME_RIME.primary_color : '#2277A2'
  const rootScale = qsParam.scale && qsParam.scale !== 'undefined' ? qsParam.scale - 0 : 1 // 参数中支持带入scale
  let code = props.companycode || qsParam['companycode']
  if (code && code.length > 10) {
    code = code.substr(2, 10)
  }
  const companyCode = code
  const maxSize = props.maxSize || '' // 是否控制当层每个节点展示数量
  const opts = props.opts
  const exportFn = props.exportFn || null
  const snapshot = opts?.snapshot || false // 只展示图谱快照

  const initOnlyShareholderOrInvest = opts?.onlyShareHolder ? 'shareholder' : opts?.onlyInvest ? 'invest' : ''
  const [direction, setDirection] = useState('upDown') // 展示方式 默认上下结构展示
  const [indent, setIndent] = useState(false) // 是否缩进展示 默认false，正常展示
  const [ratio, setRatio] = useState('')
  const [ratioUp, setRatioUp] = useState('')
  const [onlyShareholderOrInvest, setOnlyShareOrInvest] = useState(initOnlyShareholderOrInvest)
  const [onlyNormalCorp, setOnlyNormalCorp] = useState(false)
  const [shareHolderTree, setShareHolderTree] = useState(false) // 股权结构图
  const [companyName, setCorpName] = useState(props.companyname || '')

  const removeSvgChildDom = () => {
    if (document.querySelector('.gqct-graph-content')) {
      if (document.querySelector('.relatedsvg')) {
        document.querySelector('.gqct-graph-content').removeChild(document.querySelector('.relatedsvg'))
      }
    }
  }

  useEffect(() => {
    if (!opts) return
    if (opts?.direction == 'lr') {
      setDirection('leftRight')
    } else {
      setDirection('upDown')
    }
    if (opts?.shareHolderTree) {
      setShareHolderTree(true)
    } else {
      setShareHolderTree(false)
    }
    if (opts?.indent) {
      setIndent(true)
    } else {
      setIndent(false)
    }
    setRatio(opts?.rate)
    setRatioUp(opts?.rateUp)
    if (opts?.onlyShareHolder) {
      setOnlyShareOrInvest('shareholder')
    } else if (opts?.onlyInvest) {
      setOnlyShareOrInvest('invest')
    } else {
      setOnlyShareOrInvest('')
    }
    setOnlyNormalCorp(opts?.stateOnlyNormal)

    removeSvgChildDom()
  }, [opts])

  const [data, setData] = useState(null)

  let lockTime = Date.now()
  let investChartId = 0
  let shareholderChartId = 0
  let duration = 400,
    // 节点矩形宽度
    rectWidth = 160,
    // 节点矩形高度
    rectHeight = 60
  // 图形之间的水平间隙
  let zoom = null

  var borderColor = '#90bbd0'
  var borderPersonColor = '#fac38b'

  const ajaxParam = {
    companyCode: companyCode,
    ratio: ratio,
    ratioUp: ratioUp,
    currentCorpId: companyCode,
    // size: maxSize,  // 可以控制返回单层节点数目
    status: onlyNormalCorp ? '存续' : '全部',
    type: 'root',
    noForbiddenWarning: true,
  }

  const handleAjaxData = (res, call) => {
    !window.en_access_config && setLoaded(false)

    if (res.ErrorCode == global.SUCCESS && res && res.Data && (res.Data.shareHolderTree || res.Data.investTree)) {
      if (window.en_access_config) {
        let count = 0
        wftCommon.zh2en(
          res.Data.shareHolderTree,
          (data) => {
            res.Data.shareHolderTree = data
            count++
            if (count == 2) {
              setLoaded(false)
              call(res)
            }
          },
          null,
          () => {
            count++
          }
        )
        wftCommon.zh2en(
          res.Data.investTree,
          (data) => {
            res.Data.investTree = data
            count++
            if (count == 2) {
              setLoaded(false)
              call(res)
            }
          },
          null,
          () => {
            count++
          }
        )
      } else {
        call(res)
      }
    } else if (res.ErrorCode == global.USE_FORBIDDEN) {
      // 无权限，需要弹出vip付费弹框
      call({})
      VipPopup()
    } else if (res.ErrorCode == global.USE_OUT_LIMIT || res.ErrorCode == global.VIP_OUT_LIMIT) {
      // 使用超限，已在axios层处理
      call({})
    } else {
      // 暂无数据
      setLoaded(false)
      call({})
    }
  }

  const getAjaxData = (param, call) => {
    !loading && setLoaded(true)
    param.__primaryKey = companyCode
    getCorpModuleInfo(`/graph/company/${cmd}/` + companyCode, param).then(
      (res) => handleAjaxData(res, call),
      () => {
        setLoaded(false)
        call({})
      }
    )
  }

  const redirectToChart = () => {
    const url = `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_gqct#/${CHART_HASH}`
    wftCommon.jumpJqueryPage(url)
  }

  const _refreshLists = (d) => {
    return linkToCompany(d.Id, d.type === 'company', d.type === 'person', linkSourceRIME)
  }

  const freshChart = () => {
    if (onlyShareholderOrInvest === 'invest') {
    } else {
      pointBuriedByModule(922602100374)
    }
    removeSvgChildDom()
    getAjaxData(
      ajaxParam,
      (res) => {
        if (res.Data) {
          setData(res.Data)
        } else {
          setData(null)
        }
      },
      () => {
        setLoaded(false)
        setData(null)
      }
    )
  }

  useEffect(() => {
    if (!companyCode) return
    freshChart()
  }, [companyCode, direction, indent, ratio, ratioUp, onlyNormalCorp, onlyShareholderOrInvest, shareHolderTree])

  useEffect(() => {
    processingData()
  }, [data])

  const processingData = () => {
    if (!data || data.length == 0) {
      return false
    }
    let rootData = Object.assign({}, data)
    if (
      (rootData.investTree && rootData.investTree.length) ||
      (rootData.shareHolderTree && rootData.shareHolderTree.length)
    ) {
      let corpName = rootData?.rootNode?.name
      setCorpName(corpName)
      rootData.name = corpName
      rootData.Id = companyCode
      rootData.children = []
      rootData = changeThirdData(rootData)

      if (onlyShareholderOrInvest == 'invest') {
        rootData.shareHolderTree.children = []
      } else if (onlyShareholderOrInvest == 'shareholder') {
        rootData.investTree.children = []
      }
      drawUpDownNormal(rootData)
    }
  }

  function thirdSaveEvent(e) {
    if (onlyShareholderOrInvest === 'invest') {
      pointBuriedByModule(922602101001)
    } else {
      pointBuriedByModule(922602100372)
    }
    var serializer = new XMLSerializer()
    var svgCopy = document.querySelector('.relatedsvg')
    var toExport = svgCopy.cloneNode(true)
    var bb = svgCopy.getBBox()
    toExport.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width * 10 + ' ' + bb.height * 10)
    toExport.setAttribute('width', bb.width * 10)
    toExport.setAttribute('height', bb.height * 10)
    var translate = CompanyChart.zoom.translate()
    translate = translate[0] + 20 + ',' + (translate[1] + 20)
    toExport
      .querySelector('.gBox')
      .setAttribute('transform', 'translate(' + translate + ')scale(' + CompanyChart.zoom.scale() + ')')
    var source = serializer.serializeToString(toExport)
    var images = new Image()
    images.src = `data:image/svg+xml;charset=ufg-8,${encodeURIComponent(source)}`
    let canvas = document.createElement('canvas')
    canvas.width = bb.width + 40
    canvas.height = bb.height + 40
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, 80000, 80000)
    if (canvas.width > 50000 || canvas.height > 50000) {
      window.alert('抱歉，保存图片资源过大， 请您收起部分节点后重试!')
      return false
    }
    // 水印
    var shuiying = new Image()
    shuiying.src = sy2
    shuiying.width = 200
    shuiying.height = 200
    var qual = 1 // 图片质量
    if (canvas.height > 8000) {
      qual = 0.6
    } else if (canvas.height > 6000) {
      qual = 0.8
    } else if (canvas.width > 5000) {
      qual = 0.6
    } else if (canvas.width > 3500) {
      qual = 0.8
    }
    images.onload = function () {
      context.drawImage(images, 0, 0)
      setTimeout(function () {
        var wlen = canvas.width / 10
        var hlen = canvas.height / 8
        wlen = wlen < 238 ? 238 : wlen
        hlen = hlen < 238 ? 238 : hlen
        if (waterMask) {
          for (var x = 10; x < canvas.width; x += wlen) {
            for (var y = 10; y < canvas.height; y += hlen) {
              context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
            }
          }
        }
        let a = document.createElement('a')
        a.download = companyName + (opts?.noShareHolder ? '_投资穿透' : '_股权穿透') + '.png'
        a.href = canvas.toDataURL('image/jpeg', qual)
        a.click()
      })
    }
  }

  function changeThirdData(val) {
    var data = {}
    data.investTree = {
      Id: companyCode,
      depth: 0,
      name: val.name,
      children: val.investTree && val.investTree.length ? val.investTree : [],
    }
    data.shareHolderTree = {
      Id: companyCode,
      depth: 0,
      name: val.name,
      children: val.shareHolderTree && val.shareHolderTree ? val.shareHolderTree : [],
    }
    return data
  }

  function _initTreeData(data, type) {
    data.x0 = 0
    data.y0 = 0
    data.children &&
      data.children.length &&
      data.children.forEach((d, i) => {
        d._namelen = d.name ? d.name.length : 0
        // if (d.listed || d.issued || d.newInRecentYear) {
        //   d._multiline = true // 有标签 展示多行
        // }
        if (d.children) {
          d.__children = [...d.children]
        }
        if (d.depth !== 0) {
          if (d.children) {
            d._children = [...d.children]
            _initTreeData(d, type)
          }
        }
      })
    data._namelen = data.name.length ? data.name.length : 0
    // if (data.listed || data.issued || data.newInRecentYear) {
    //   if (data.depth) {
    //     data._multiline = true
    //   }
    // }
    return data
  }

  function getAllNodes(data, obj) {
    ++investChartId
    if (data.id && data.id % 2 !== investChartId % 2) {
      ++investChartId
    }
    data.id = investChartId
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

  function maxSizeData(data1, data2) {
    if (data1.children && data1.children.length > maxSize - 1) {
      data1.children[maxSize - 1] = {}
      data1.children[maxSize - 1].Id = '$$$1'
      data1.children[maxSize - 1].name = window.en_access_config ? 'More' : '更多节点，点击查看'
      data1.children[maxSize - 1].type = 'more'
      data1.children.length = maxSize
    }
    if (data2.children && data2.children.length > maxSize - 1) {
      data2.children[maxSize - 1] = {}
      data2.children[maxSize - 1].Id = '$$$2'
      data2.children[maxSize - 1].name = window.en_access_config ? 'More' : '更多节点，点击查看'
      data2.children[maxSize - 1].type = 'more'
      data2.children.length = maxSize
    }
  }

  function drawShareholderTreeSvg(svgWidth, svgHeight) {
    var svg = {}
    var border = {
      top: 40,
      right: 10,
      bottom: 10,
      left: 20,
    } // A

    var zoom = (CompanyChart.zoom = d3.behavior.zoom().scaleExtent([1, 1]).on('zoom', zoomed)) // U

    d3.select('.relatedsvg').remove()
    // svg画布
    svg.baseSvg = d3
      .select('.gqct-graph-content')
      .append('svg')
      .attr('class', 'relatedsvg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .call(zoom)

    // svg容器 (可添加多个svg内容元素)
    CompanyChart.container = svg.svgGroup = svg.baseSvg.append('g').attr('class', 'gBox')

    // svg内容
    svg.svg = svg.svgGroup.append('g').attr('transform', 'translate(' + border.left + ',' + border.top + ')')

    function zoomed() {
      if (d3.event && d3.event.translate)
        svg.svgGroup.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
    }

    CompanyChart.svg = svg
    return svg
  }

  function drawsvg(initW, initH, boxSize) {
    d3.select('.relatedsvg').remove()
    let svg = d3
      .select('.gqct-graph-content')
      .append('svg')
      .attr('class', 'relatedsvg')
      .attr('viewBox', boxSize)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', initW)
      .attr('height', initH)
    // 创建图例
    !snapshot && createLegend(svg)
    let g = svg
      .append('g')
      .attr('class', 'gBox') // 用来承载 svg子元素 做移动处理
      .attr('transform', 'scale(' + rootScale + ')')
    let zooms = d3.behavior
      .zoom()
      .scaleExtent([1.5 - rootScale, 2.3 - rootScale])
      .on('zoom', zoomed)
    zoom = zooms
    svg.call(zoom)
    CompanyChart.zoom = zoom
    CompanyChart.container = g
    svg.call(zoom).on('dblclick.zoom', null) // 去除鼠标双击放大效果
    function zoomed() {
      let scale = d3.event.scale ? d3.event.scale : rootScale
      scale = scale + rootScale - 1
      g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + scale + ')')
    }
  }

  const drawShareholderTree = (targetNode) => {
    var tree = d3.layout.tree().nodeSize([0, 60]) // j
    var lineHeight = 62 // L   基础行高
    var baseHeight = 48 // F  首行高度
    var nodeWidth = 460
    var r = 4 // E  颜色图例宽度
    var theR = 6 // R 半径
    var x0 = 20 //B
    var xR = 4 // N
    var paddingHeight = 10 // O
    var len = 400 // 过渡时间
    var svg = CompanyChart.svg
    var rootData = CompanyChart.rootData

    var nodes = tree.nodes(rootData)

    nodes.forEach(function (t, e) {
      if (t.depth) {
        t.height = lineHeight
        t.balance = 0
      } else {
        t.height = baseHeight
        t.balance = 5
      }

      t.nwidth = nodeWidth
      t.x = e * (t.height + paddingHeight)
      t.textleft = t.spread || t._children || t.children ? x0 + 15 : x0
    })

    // i
    var nodeUpdate = svg.svg.selectAll('g.node-tree').data(nodes, function (t) {
      return t.mid || (t.mid = ++shareholderChartId)
    })
    // n
    var enterZone = nodeUpdate
      .enter()
      .append('g')
      // .attr("class", "node")
      .attr('class', 'node-tree')
      .attr(
        'transform',
        // 原参数 e
        function (e) {
          if (targetNode.y0) {
            return 'translate(' + targetNode.y0 + ',' + targetNode.x0 + ')'
          }
          return ''
        }
      )
      .style('opacity', 1e-6)
      .on('click', toggleEvent)

    enterZone
      .append('rect')
      .attr('class', function (d) {
        if (d.depth) {
          return 'gqjgrect'
        }
        return ''
      })
      .attr('y', calcHeight)
      .attr('height', getHeight)
      .attr('width', getWidth)
      .attr('stroke-width', '1px')
      .attr('stroke', '#88b3c8')
      .attr('fill', function (d) {
        if (!d.depth) {
          return primary_color
        }
        return '#ffffff'
      })

    enterZone
      .append('rect')
      .filter(function (t) {
        return t.depth
      })
      .attr('class', 'rectbottom')
      .attr('y', function (t) {
        var y = calcHeight(t)
        return 0 - y - 3
      })
      .attr('fill', primary_color)
      .attr('stroke', primary_color)
      .attr('height', 2)
      .attr('width', function (t) {
        var w = t.nwidth
        return (t.parentStockShare * w) / 100
      })

    // r
    var enterNodes = enterZone.append('g').attr('class', 'company-top')

    var tagIpoRects = enterNodes
      .filter(function (t) {
        return t.listed
      })
      .append('rect')
      .attr('class', 'corp_tag_ipo')
      .attr('x', function (t) {
        if (t.name && t.name.length) {
          return t.textleft + t.name.length * 14 + 10
        } else {
          return t.textleft + 10
        }
      })
      .attr('y', function (t) {
        return t.depth ? -18 : -5
      })
      .attr('ry', 2)
      .attr('rx', 2)
      .attr('height', 20)
      .attr('width', window.en_access_config ? 45 : 40)
      .attr('fill', '#7d609a')
      .attr('fill-opacity', '0.2')

    var tagIpoTexts = enterNodes
      .filter(function (t) {
        return t.listed
      })
      .append('text')

      .attr('class', 'ipotext')
      .attr('fill', '#7d609a')
      .attr('font-size', '12px')
      .attr('y', function (t) {
        return t.depth ? -3 : 10
      })
      .attr('x', function (t) {
        if (t.name && t.name.length) {
          return t.textleft + t.name.length * 14 + 17
        } else {
          return t.textleft + 17
        }
      })

    tagIpoTexts.append('tspan').text(function (t) {
      return intl('258784', '上市')
    })

    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    var tagDebtRects = enterNodes
      .filter(function (t) {
        return t.issued
      })
      .append('rect')
      .attr('class', 'corp_tag_debt')
      .attr('x', function (t) {
        var distance = 10
        if (t.listed) {
          distance = 60
        }
        if (t.name && t.name.length) {
          return t.textleft + t.name.length * 14 + distance
        } else {
          return t.textleft + distance
        }
      })
      .attr('y', function (t) {
        return t.depth ? -18 : -5
      })
      .attr('ry', 2)
      .attr('rx', 2)
      .attr('height', 20)
      .attr('width', window.en_access_config ? 45 : 40)
      .attr('fill', '#169D60')
      .attr('fill-opacity', '0.2')

    var tagDebtTexts = enterNodes
      .filter(function (t) {
        return t.issued
      })
      .append('text')
      .attr('class', 'debttext')
      .attr('fill', '#169D60')

      .attr('font-size', window.en_access_config ? '10px' : '12px')
      .attr('y', function (t) {
        return t.depth ? -3 : 10
      })
      .attr('x', function (t) {
        var distance = 18
        if (t.listed) {
          distance = 68
        }
        if (t.name && t.name.length) {
          return t.textleft + t.name.length * 14 + distance
        } else {
          return t.textleft + distance
        }
      })

    tagDebtTexts.append('tspan').text(function (t) {
      return window.en_access_config ? 'Bonded' : intl('437678', '发债')
    })

    // a
    var enterTxts = enterNodes
      .append('text')
      .attr('class', 'company')
      .attr('fill', function (d) {
        return d.depth ? '#333' : '#fff'
      })
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('y', function (t) {
        return t.depth ? -4 : 10
      })
      .attr('x', function (t) {
        return t.textleft
      })

    enterTxts
      .append('tspan')
      .text(function (t) {
        t.name = t.name || ''
        var txt = t.name || ''
        var len = 17
        // 股东类型（工商、有限售、无限售等）
        // 控制文字长度 (15 -20)
        if (t.name.charCodeAt(0) < 255 && t.name.charCodeAt(t.name.length - 1) < 255) {
          len = len * 2
        }
        if (t.sh_type) {
          if (t.name.length > len) {
            txt = t.name.substring(0, len) + '...'
          }
        } else {
          if (t.name.length > len + 5) {
            txt = t.name.substring(0, len + 5) + '...'
          }
        }
        return txt
      })
      .on('click', function (d) {
        _refreshLists(d)
      })

    // 股东类型 不加粗显示
    enterTxts
      .append('tspan')
      .attr('class', 'nobold')
      .attr('font-weight', 'normal')
      .text(function (t) {
        return t.sh_type ? '(' + t.sh_type + ')' : ''
      })

    // 为了计算控制人标识图片而计算 如不需要可一同去除
    enterTxts.each(function (t) {
      t.width = this.clientWidth - t.textleft * 2
    })

    // 持股比例
    enterNodes
      .append('text')
      .filter(function (t) {
        return t.depth
      })
      .attr('class', 'size')
      .attr('fill', '#333')
      .attr('font-size', '13px')
      .attr('dy', 20)
      .attr('dx', function (t) {
        return t.textleft
      })
      .append('tspan')
      .text(window.en_access_config ? intl('451217', '持股比例') + ':' : '持股比例：')
      .append('tspan')
      .attr('class', 'count')
      // .attr("fill", "#fe7e17")
      .text(function (t) {
        var Ratio = t.parentStockShare
        if (Ratio) {
          Ratio = (parseFloat(Ratio).toFixed(4) * 10000) / 10000 + '%'
        } else {
          Ratio = '--'
        }
        return Ratio
      })

    // 展开、收缩 按钮图标
    enterZone
      .append('circle')
      .filter(function (t) {
        return (t._children && t._children.length) || (t.children && t.children.length) || t.spread
      })
      .attr('class', 'folderc')
      .attr('stroke-width', '0.5px')
      .attr('stroke', primary_color)
      .attr('fill', 'transparent')
      .attr('cx', x0)
      .attr('cy', otherHeight)
      .attr('r', theR)

    // 展开、收缩 按钮图标 内 +/- 号  横向线条
    enterZone
      .append('line')
      .attr('class', 'line-h')
      .filter(function (t) {
        return (t._children && t._children.length) || (t.children && t.children.length) || t.spread
      })
      .attr('x1', x0 - xR)
      .attr('y1', otherHeight)
      .attr('x2', x0 + xR)
      .attr('y2', otherHeight)
      .attr('stroke', primary_color)
      .attr('stroke-width', 0.5)

    // 展开、收缩 按钮图标 内 +/- 号  纵向线条
    enterZone
      .append('line')
      .attr('class', 'line-v')
      .filter(function (t) {
        return (t._children && t._children.length) || (t.children && t.children.length) || t.spread
      })
      .attr('x1', x0)
      .attr('y1', function (t) {
        return t.height == lineHeight ? -xR : 5 - xR
      })
      .attr('x2', x0)
      .attr('y2', function (t) {
        return t.height == lineHeight ? -xR : 5 - xR
      })
      .attr('stroke', primary_color)
      .attr('stroke-width', 0.5)

    // 以下为动画渐入渐出效果
    enterZone
      .transition()
      .duration(len)
      .attr('transform', function (t) {
        return 'translate(' + t.y + ',' + t.x + ')'
      })
      .style('opacity', 1)

    nodeUpdate
      .transition()
      .duration(len)
      .attr('transform', function (t) {
        return 'translate(' + t.y + ',' + t.x + ')'
      })
      .style('opacity', 1)
      .select('line.line-v')
      .attr('y2', function (t) {
        return t._children || (t.spread && !t.children) ? xR + t.balance : -xR + t.balance
      })

    nodeUpdate.exit().remove()

    // 连接线
    var linkUpdate = svg.svg.selectAll('path.link').data(tree.links(nodes), function (t) {
      return t.target.mid
    })

    linkUpdate
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', '1px')
      .transition()
      .duration(len)

    linkUpdate
      .transition()
      .duration(len)
      .attr('d', function (t) {
        var arr1 = 'M' + (t.source.depth * 60 + 2) + ',' + (t.source.x + 10),
          arr2 = 'L' + (t.source.depth * 60 + 2) + ',' + t.target.x,
          arr3 = 'L' + t.target.depth * 62 + ',' + t.target.x
        return arr1 + arr2 + arr3
      })

    // exit
    linkUpdate.exit().remove()

    // 计算高度
    function calcHeight(t) {
      return t.height == lineHeight ? -t.height / 2 : -t.height / 2 + 5
    }

    // 获取高度
    function getHeight(t) {
      return t.height
    }

    function getWidth(t) {
      return t.nwidth
    }

    // 获取间距高度
    function otherHeight(t) {
      return t.height == lineHeight ? 0 : 5
    }

    // 展开/收缩处理
    function toggleGQJG(d) {
      if (d.children) {
        d._children = d.children
        d.children = null
        drawShareholderTree(d)
      } else if (d._children) {
        d.children = d._children
        d._children = null
        drawShareholderTree(d)
      } else {
        getThirdData(d, true)
      }
    }

    // toggle操作
    function toggleEvent(d) {
      if (!d.depth) return
      if (!d.spread) return
      toggleGQJG(d)
    }
  }

  // 默认状态 上下、正常 展示形态
  const drawUpDownNormal = (demodata) => {
    let pLeft = 0
    // let rLeft = document.getElementsByClassName('gqct-chart-main')[0].offsetLeft
    let initW = document.getElementsByClassName('gqct-graph-content')[0].offsetWidth
    let initH = document.getElementsByClassName('gqct-graph-content')[0].offsetHeight
    let widthFromLeftScreen = initW + pLeft + 16 // 16 对应 paddingleft

    let data1 = demodata.shareHolderTree
    let data2 = demodata.investTree

    investChartId = 0
    shareholderChartId = 0

    if (maxSize) {
      maxSizeData(data1, data2)
    }

    if (shareHolderTree) {
      const svg = drawShareholderTreeSvg(initW, initH)
      demodata.shareHolderTree.x = 0
      demodata.shareHolderTree.x0 = 0
      demodata.shareHolderTree.y = 0
      demodata.shareHolderTree.y0 = 0
      demodata = demodata.shareHolderTree
      CompanyChart.rootData = demodata
      drawShareholderTree(demodata, demodata)
      return
    }
    if (direction == 'upDown') {
      if (!indent) {
        // 上下普通
        drawsvg(initW, initH, [-widthFromLeftScreen / 2 + (snapshot ? 80 : 300), -initH / 2 + 20, initW, initH])
      } else {
        // 上下紧凑
        drawsvg(initW, initH, [-widthFromLeftScreen / 2 + 200, -initH / 2 + 20, initW, initH])
      }
      drawUpDownClose(demodata, data1, data2)
    } else {
      // 左右
      drawsvg(initW, initH, [-widthFromLeftScreen / 2 + 300, -initH / 2 + 20, initW, initH])
      drawLeftRightNormal(demodata, data1, data2)
    }
  }

  // 上下 紧凑
  function drawUpDownClose(demodata, data1, data2) {
    traverseTreeId(data1)
    traverseTreeId(data2)
    var root = _initTreeData(data1, 'r') // 右边
    var root1 = _initTreeData(data2, 'l') // 左边
    var g = d3.select('.gBox')

    var cluster = d3.layout
      .tree()
      .nodeSize(indent ? [200, 300] : [200, 150])
      .separation((a, b) => {
        if (indent) {
          if (a.depth == b.depth) {
            return a.parent == b.parent ? 0.5 : 0.9
          }
        }
        return 1
      })

    // node节点
    var gnode = g.append('g').attr('class', 'gnode')
    var glink = g.append('g').attr('class', 'glink') // 子元素向左边延伸的线

    // ========= 右边节点结构
    var gnode2 = g.append('g').attr('class', 'gnode') // 动画用
    var glinks2 = g.append('g').attr('class', 'glinks') // 动画用

    var updateLeft = (source, removeSonTree) => {
      var nodess2 = cluster.nodes(root)
      var links2 = cluster.links(nodess2)
      var tmp = { list: [demodata.shareHolderTree] }
      getAllNodesLeft(demodata.shareHolderTree, tmp)
      cluster(root) // 计算左边的树形结构
      var descendants2 = tmp.list
      descendants2.forEach((d, i) => {
        return (d.y *= -1)
      }) // 初始计算的时候是 右边的树形结构，乘以-1变成左边的树形结构
      var vertical2 = calcMaxyLeft(descendants2)

      var nodeP2 = gnode2.selectAll('g.node').data(descendants2, function (d) {
        return `id2${d.id}`
      })
      var nodeEnter2 = nodeP2
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.x0 == undefined ? source.x : source.x0},${source.y0 == undefined ? source.y : source.y0})`
        )
        .attr('node-id', function (t) {
          var pid = t.parent ? (t.parent.Id ? t.parent.Id : t.parent.id) : t.id
          var tid = t.Id || t.id
          return t.depth ? t.depth + '|' + pid + '|' + tid : t.Id
        })

      nodeEnter2
        .filter(function (d) {
          if (!d.depth) return false
          return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
        })
        .append('circle')
        .attr('class', 'ctrl_circle')
        .attr('r', 8)
        .attr('cx', 80)
        .attr('cy', function (d) {
          if (indent) {
            if (d.id % 2 == 1) {
              return '-109'
            }
          }
          return '-9'
        })
        .attr('fill', function (d) {
          return '#fff'
        })
        .attr('stroke', function (d) {
          return primary_color
        })
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', function (d) {
          return 1.2
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d, 1)
        })
      nodeEnter2
        .append('path')
        .attr('fill', primary_color)
        .attr('stroke', primary_color)
        .attr('stroke-width', '0.1')
        .attr('transform', function (d) {
          if (indent) {
            if (d.id % 2 == 1) {
              return `translate(80,-109)`
            }
          }
          return `translate(80,-9)`
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d, 1)
        })
      nodeP2
        .filter(function (d) {
          return d.depth !== 0
        })
        .select('path')
        .attr('d', function (d) {
          if (d.children && d.children.length) {
            return 'M-5 -1 H5 V1 H-5 Z' // 此时展开状态-，有children
          } else if (d.spread) {
            return 'M-5 -1 H-1 V-5 H1 V-1 H5 V1 H1 V5 H-1 V1 H-5 Z' // 此时收起状态+，无children
          }
        })

      nodeEnter2
        .filter(function (d) {
          return d.depth !== 0
        })
        .append('path')
        .attr('fill', '#c5c5c5')
        .attr('target-hover-arrow', function (d) {
          return d.Id + '|' + d.depth
        })
        .attr('target-hover-arrow-child', function (d) {
          if (d.parent && d.parent.depth) {
            return d.parent.Id + '|' + d.parent.depth
          }
        })
        .attr('d', function (d) {
          return 'M75 95 L80 105 L85 95Z'
        })

      nodeEnter2
        .filter((d) => d.depth == 0)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', primary_color)
        .style('opacity', '1')
        .attr('stroke', function (d) {
          return d.type == 'bond' ? '#ddd' : '#90bbd0'
        })
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      var rectBoxG2 = nodeEnter2
        .append('g')
        .attr('class', 'react-box-g')
        .attr('transform', function (d) {
          if (d.depth) {
            if (indent) {
              if (d.id % 2 == 1) {
                return `translate(0,-100)`
              }
            }
            return null
          }
        })

      // --------------------------------------------------------------------------------------
      // 上市 标识
      createTag(rectBoxG2, TagTypeEnum.LISTED)
      // 发债标识
      createTag(rectBoxG2, TagTypeEnum.ISSUED)
      // 新进/注销 标识
      createTag(rectBoxG2, TagTypeEnum.NEWINRECENTYEAR)

      // 实际控制人icon
      createIcon(rectBoxG2, IconTypeEnum.ACTOR)
      createIcon(rectBoxG2, IconTypeEnum.BENIFCIARY)
      createIcon(rectBoxG2, IconTypeEnum.ACTCTRL)

      var reactBoxChild2 = rectBoxG2
        .filter((d) => d.depth > 0)
        .on('mouseover', function (d) {
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })
          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return true
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return true
          })
          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              var p = d3.select(this.parentNode)
              p = p.node()
              if (p.nextSibling) p.parentNode.appendChild(p)
              return true
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return true
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })
        .on('mouseout', function (d) {
          // d3.select(this).classed('', false);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            return false
          })

          var hoverLinksOther = d3.selectAll('.link-flow-in')
          hoverLinksOther.classed('link-flow-in', function () {
            return false
          })

          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return false
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return false
          })

          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            return false
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              return false
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return false
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })
      console.log('🚀 ~ updateLeft ~ reactBoxChild2:', reactBoxChild2)

      reactBoxChild2
        .append('rect')
        .attr('stroke-width', 1.2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', (d) => (d.type == 'bond' ? '#f4f4f4' : 'transparent'))
        .style('opacity', (d) => 1)
        .attr('class', 'rect-corp')
        .on('click', (d) => {
          if (d.type == 'more') {
            redirectToChart()
            return
          }
          d.depth && d.Id && _refreshLists(d)
        })
        .attr('stroke', function (d) {
          if (d.type == 'person') {
            return borderPersonColor
          }
          if (d.type == 'more') {
            return '#77C4D4'
          }
          return d.type == 'bond' ? '#ddd' : borderColor
        })
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      // 节点文本内容
      var labelTxts = createText(rectBoxG2)

      labelTxts
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          if (d.type == 'more') {
            redirectToChart()
            return
          }
          d.depth && d.Id && _refreshLists(d)
        })
        .text(gqctLabelFirst)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start'))
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
      labelTxts
        .filter(function (d) {
          if (d._namelen > 10) {
            return true
          }
        })
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          d.Id && _refreshLists(d)
        })
        .text(gqctLabelSecond)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start')) // .attr('fill',d=>d.data.color)
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
        .attr('x', function (d) {
          return d.depth ? (window.en_access_config || d._nameIsUpper ? 5 : 10) : 80
        })
        .attr('dy', function (d) {
          if (d._multiline) {
            if (d._namelen > 12) {
              return 13
            }
          }
          return 20
        })

      labelTxts
        .filter((d) => d.depth !== 0)
        .append('tspan')
        .style('font-size', 12)
        .style('cursor', 'pointer')
        .text(function (d) {
          var Ratio = d.parentStockShare
          if (Ratio > 0) {
            Ratio = (parseFloat(Ratio).toFixed(2) * 10000) / 10000 + '%'
          } else {
            Ratio = '--'
          }
          return Ratio
        })
        .attr('fill', '#999')
        .attr('x', function (dd) {
          return 85
        })
        .attr('y', 92)
        .append('tspan')
        .style('font-size', 10)
        .style('cursor', 'pointer')
        // .text('------------------------------------')
        .attr('class', 'tspan--')
        .attr('fill', function (d) {
          if (d.listed || d.issued || d.newInRecentYear || wftCommon.unNormalStatus.indexOf(d.reg_status) > -1) {
            return '#A7E3EC'
          }
          return 'transparent'
        })
        .attr('x', function (dd) {
          return 0
        })
        .attr('y', 33)

      rectBoxG2.append('title').text((d) => {
        var t = d.name
        return t
      })

      nodeP2
        .transition()
        .duration(duration)
        .attr('transform', (d) => `translate(${d.x},${d.y})`)

      nodeP2.exit().remove().attr('fill-opacity', 0).attr('stroke-opacity', 0)

      var linkPL = glinks2.selectAll('g.link').data(links2, (d) => d.target.id)
      let linkEnterL = linkPL.enter().append('g').attr('class', 'link')
      linkEnterL
        .append('path')
        .attr('class', 'link-path')
        .attr('fill', 'none')
        .attr('stroke-opacity', '0.9')
        .attr('stroke', '#c5c5c5')
        .attr('stroke-width', 1)
        .attr('target-hover-flow-id', function (t) {
          return t.source.Id + '|' + t.source.depth
        })
        .attr('target-hover-id', function (d) {
          return d.target.Id + '|' + d.target.depth
        })
        .attr('path-id', function (t) {
          return (
            (t.source.depth ? t.source.depth : 0) +
            '|' +
            (t.source.Id ? t.source.Id : t.source.id) +
            '|' +
            (t.target.Id ? t.target.Id : t.target.id)
          )
        })
        .attr('d', function (d) {
          var r = null
          if (vertical2) {
            vertical2.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }

          var eggHeight = 0

          if (indent && d.target.depth) {
            if (d.target.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a1 = 'M' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + rectHeight + eggHeight)
          var a2 =
            'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)

          eggHeight = 0
          // a1 、 a5 分开，有先后次序！
          if (indent && d.source.depth) {
            if (d.source.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a4 =
            'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
          var a5 = 'L' + (d.source.x + rectWidth / 2) + ',' + (d.source.y - (d.source.depth ? 20 : 0) + eggHeight)
          return a1 + a2 + a4 + a5
        })
      var newLinkL = [] // 该集合存放enter、update的merge
      linkEnterL[0].forEach(function (t) {
        if (t) {
          var tag = false
          for (var i = 0; i < linkPL[0].length; i++) {
            var tt = linkPL[0][i]
            if (tt === t) {
              tag = true
              break
            }
          }
          if (!tag) {
            newLinkL.push(t)
          }
        }
      })
      newLinkL = newLinkL.concat(linkPL[0])
      newLinkL = d3.selectAll(newLinkL)
      newLinkL
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var r = null
          if (vertical2) {
            vertical2.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }
          var eggHeight = 0
          if (indent && d.target.depth) {
            if (d.target.id % 2 == 1) {
              eggHeight = -100
            }
          }

          var a1 = 'M' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + rectHeight + eggHeight)
          var a2 =
            'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)

          eggHeight = 0
          if (indent && d.source.depth) {
            if (d.source.id % 2 == 1) {
              eggHeight = -100
            }
          }

          var a4 =
            'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
          var a5 = 'L' + (d.source.x + rectWidth / 2) + ',' + (d.source.y - (d.source.depth ? 20 : 0) + eggHeight)

          return a1 + a2 + a4 + a5
        })
      var linkexit = linkPL.exit()
      linkexit.remove()

      linkexit
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          return 'M0,0L0,0L0,0L0,0'
        })

      if (removeSonTree) {
        removeSonTrees(source)
      }
      descendants2.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }

    var update = (source, removeSonTree) => {
      var nodess = cluster.nodes(root1)
      var links = cluster.links(nodess)
      var tmp = { list: [demodata.investTree] }
      getAllNodes(demodata.investTree, tmp)
      var descendants = tmp.list
      cluster(root1) // 计算右边的树形结构
      var vertical = calcMaxy(descendants)
      // 绘制节点初始位置 子节点
      var nodeP = gnode.selectAll('g.node').data(descendants, (d) => d.id)
      // var nodeEnter = nodeP.enter().append('g').attr('class', 'node').attr('transform', `translate(${source.y0=== undefined ? source.y : source.y0},${source.x0 == undefined ? source.x : source.x0})`); // 竖向的
      var nodeEnter = nodeP
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.x0 === undefined ? source.x : source.x0},${source.y0 == undefined ? source.y : source.y0})`
        )
        .attr('node-id', function (t) {
          var pid = t.parent ? (t.parent.Id ? t.parent.Id : t.parent.id) : t.id
          var tid = t.Id || t.id
          return t.depth ? t.depth + '|' + pid + '|' + tid : t.Id
        }) //

      // -----------
      // 展开/收起 icon
      nodeEnter
        .filter(function (d) {
          if (!d.depth) return false
          return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
        })
        .append('circle')
        .attr('class', 'ctrl_circle')
        .attr('r', 8)
        .attr('cx', 80)
        .attr('cy', function (d) {
          if (indent) {
            if (d.id % 2 == 1) {
              return -30
            }
          }
          return 69
        })
        .attr('fill', function (d) {
          return '#fff'
        })
        .attr('stroke', function (d) {
          return primary_color
        })
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', function (d) {
          return 1.2
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d)
        })
      nodeEnter
        .filter(function (d) {
          if (!d.depth) return false
          return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
        })
        .append('path')
        .attr('fill', primary_color)
        .attr('stroke', primary_color)
        .attr('stroke-width', '0.1')
        .attr('transform', function (d) {
          if (indent) {
            if (d.id % 2 == 1) {
              return `translate(80,-30)`
            }
          }
          return `translate(80,69)`
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d)
        })

      nodeP.select('path').attr('d', function (d) {
        if (d.children && d.children.length) {
          return 'M-5 -1 H5 V1 H-5 Z' // 此时展开状态-，有children
        } else if (d.spread) {
          return 'M-5 -1 H-1 V-5 H1 V-1 H5 V1 H1 V5 H-1 V1 H-5 Z' // 此时收起状态+，无children
        }
      })

      nodeP
        .filter(function (d) {
          return d.depth !== 0
        })
        .append('path')
        .attr('fill', '#c5c5c5')
        .attr('target-hover-arrow', function (d) {
          return d.Id + '|' + d.depth
        })
        .attr('target-hover-arrow-child', function (d) {
          if (d.parent && d.parent.depth) {
            return d.parent.Id + '|' + d.parent.depth
          }
        })
        .attr('d', function (d) {
          return 'M75 -10 L80 0 L85 -10Z'
        })
        .attr('transform', function (d) {
          if (indent) {
            if (d.depth) {
              if (d.id % 2 == 1) {
                return `translate(0,-100)`
              }
              return null
            }
          }
        })

      nodeEnter
        .filter((d) => d.depth == 0)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', primary_color)
        .style('opacity', '1')
        .attr('stroke', function (d) {
          return d.type == 'bond' ? '#ddd' : '#90bbd0'
        })
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      var rectBoxG = nodeEnter
        .append('g')
        .attr('class', 'react-box-g')
        .attr('transform', function (d) {
          if (indent) {
            if (d.depth) {
              if (d.id % 2 == 1) {
                return `translate(0,-100)`
              }
              return null
            }
          }
        })

      // --------------------------------------------------------------------------------------
      // 上市 标识
      createTag(rectBoxG, TagTypeEnum.LISTED)
      // 发债标识
      createTag(rectBoxG, TagTypeEnum.ISSUED)
      // 新进/注销 标识
      createTag(rectBoxG, TagTypeEnum.NEWINRECENTYEAR)

      var reactBoxChild = rectBoxG
        .filter((d) => d.depth > 0)
        .on('mouseover', function (d) {
          // d3.select(this).classed('', true);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })
          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return true
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return true
          })
          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              var p = d3.select(this.parentNode)
              p = p.node()
              if (p.nextSibling) p.parentNode.appendChild(p)
              return true
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return true
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })
        .on('mouseout', function (d) {
          // d3.select(this).classed('', false);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            return false
          })

          var hoverLinksOther = d3.selectAll('.link-flow-in')
          hoverLinksOther.classed('link-flow-in', function () {
            return false
          })

          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return false
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return false
          })

          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            return false
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              return false
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return false
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })

      reactBoxChild
        .append('rect')
        .attr('stroke-width', 1.2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', function (d) {
          if (d.type == 'more') {
            return '#f5fcfd'
          }
          return d.type == 'bond' ? '#f4f4f4' : 'transparent'
        })
        .style('opacity', (d) => 1)
        .attr('class', 'rect-corp')
        .on('click', (d) => {
          d.depth && d.Id && _refreshLists(d)
        })
        .attr('stroke', function (d) {
          if (d.type == 'person') {
            return borderPersonColor
          }
          if (d.type == 'more') {
            return '#77C4D4'
          }
          return d.type == 'bond' ? '#ddd' : borderColor
        })
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      // 节点文本内容
      var labelTxts = createText(rectBoxG)

      labelTxts
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          if (d.type == 'more') {
            redirectToChart()
            return
          }
          d.depth && d.Id && _refreshLists(d)
        })
        .text(gqctLabelFirst)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start'))
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
      labelTxts
        .filter(function (d) {
          if (d._namelen > 10) {
            return true
          }
        })
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          if (d.type == 'more') {
            redirectToChart()
            return
          }
          d.depth && d.Id && _refreshLists(d)
        })
        .text(gqctLabelSecond)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start')) // .attr('fill',d=>d.data.color)
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
        .attr('x', function (d) {
          return d.depth ? (window.en_access_config || d._nameIsUpper ? 5 : 10) : 80
        })
        .attr('dy', function (d) {
          if (d._multiline) {
            if (d._namelen > 12) {
              return 13
            }
          }
          return 20
        })

      labelTxts
        .filter((d) => d.depth !== 0)
        .append('tspan')
        .style('font-size', 12)
        .style('cursor', 'pointer')
        .text(function (d) {
          var Ratio = d.parentStockShare
          if (Ratio) {
            Ratio = (parseFloat(Ratio).toFixed(2) * 10000) / 10000 + '%'
          } else {
            Ratio = '--'
          }
          return Ratio
        })
        .attr('fill', '#999')
        .attr('x', function (dd) {
          return 85
        })
        .attr('y', -8)
        .append('tspan')
        .style('font-size', 10)
        .style('cursor', 'pointer')
        .attr('class', 'tspan--')
        .attr('fill', function (d) {
          if (d.listed || d.issued || d.newInRecentYear || wftCommon.unNormalStatus.indexOf(d.reg_status) > -1) {
            return '#A7E3EC'
          }
          return 'transparent'
        })
        .attr('x', function (dd) {
          return 0
        })
        .attr('y', 33)

      rectBoxG.append('title').text((d) => {
        var t = d.name
        return t
      })

      // 将节点动画至目标位置
      // nodeP.transition().duration(duration).attr("transform", function(d) { return `translate(${d.y},${d.x})` });
      nodeP
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return `translate(${d.x},${d.y})`
        })
      var nodeExit = nodeP.exit().remove().attr('fill-opacity', 0).attr('stroke-opacity', 0)

      var linkP3 = glink.selectAll('g.link').data(links, (d) => d.target.id)
      let linkEnter3 = linkP3.enter().append('g').attr('class', 'link')
      linkEnter3
        .append('path')
        .attr('class', 'link-path')
        .attr('fill', 'none')
        .attr('stroke-opacity', '0.9')
        .attr('stroke', '#c5c5c5')
        .attr('stroke-width', 1)
        .attr('target-hover-flow-id', function (t) {
          return t.source.Id + '|' + t.source.depth
        })
        .attr('target-hover-id', function (d) {
          return d.target.Id + '|' + d.target.depth
        })
        .attr('path-id', function (t) {
          return (
            (t.source.depth ? t.source.depth : 0) +
            '|' +
            (t.source.Id ? t.source.Id : t.source.id) +
            '|' +
            (t.target.Id ? t.target.Id : t.target.id)
          )
        })
        .attr('d', function (d) {
          var r = null
          if (vertical) {
            vertical.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }

          var eggHeight = 0
          if (indent && d.source.depth) {
            if (d.source.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a1 =
            'M' + (d.source.x + rectWidth / 2) + ',' + (d.source.y + rectHeight + (d.source.depth ? 20 : 0) + eggHeight)
          var a2 =
            'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)

          eggHeight = 0
          if (indent && d.target.depth) {
            if (d.target.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a4 =
            'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
          var a5 = 'L' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + eggHeight)

          return a1 + a2 + a4 + a5
        })
      var newLink = [] // 该集合存放enter、update的merge
      linkEnter3[0].forEach(function (t) {
        if (t) {
          var tag = false
          for (var i = 0; i < linkP3[0].length; i++) {
            var tt = linkP3[0][i]
            if (tt === t) {
              tag = true
              break
            }
          }
          if (!tag) {
            newLink.push(t)
          }
        }
      })
      newLink = newLink.concat(linkP3[0])
      newLink = d3.selectAll(newLink)
      newLink
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var r = null
          if (vertical) {
            vertical.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }

          var eggHeight = 0
          if (indent && d.source.depth) {
            if (d.source.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a1 =
            'M' + (d.source.x + rectWidth / 2) + ',' + (d.source.y + rectHeight + (d.source.depth ? 20 : 0) + eggHeight)
          var a2 =
            'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)

          eggHeight = 0
          if (indent && d.target.depth) {
            if (d.target.id % 2 == 1) {
              eggHeight = -100
            }
          }
          var a4 =
            'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
          var a5 = 'L' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + eggHeight)

          return a1 + a2 + a4 + a5
        })
      var linkexit = linkP3.exit()
      linkexit.remove()
      // linkexit.selectAll('path.link-path').attr("d", function(d) {
      //     return 'M0,0L0,0L0,0L0,0';
      // });
      descendants.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })

      if (removeSonTree) {
        removeSonTrees(source)
      }
    }

    if (CompanyChart.onlyInvest == 1) {
      // 只看股东
      // updateLeft(root)
    } else if (CompanyChart.onlyInvest == 2) {
      // 只看投资
      // update(root1)
    } else {
      updateLeft(root)
      update(root1)
    }

    CompanyChart._thirdUpdate = update
    CompanyChart._thirdUpdateLeft = updateLeft
  }

  // 左右结构
  function drawLeftRightNormal(demodata, data1, data2) {
    traverseTreeId(data1)
    traverseTreeId(data2)
    var root = _initTreeData(data1, 'r') // 右边
    var root1 = _initTreeData(data2, 'l') // 左边
    var g = d3.select('.gBox')
    var cluster = d3.layout
      .tree()
      .nodeSize([100, 250])
      .separation((a, b) => {
        if (a.depth === 1) return 1
        // return a.parent === b.parent ? 0.4 : 0.8;
        return a.parent === b.parent ? 0.8 : 0.8
      })

    var gnode = g.append('g').attr('class', 'gnode')
    var glink = g.append('g').attr('class', 'glink') // 子元素向左边延伸的线

    // ========= 右边节点结构
    var gnode2 = g.append('g').attr('class', 'gnode') // 动画用
    var glinks2 = g.append('g').attr('class', 'glinks') // 动画用

    var updateLeft = (source, removeSonTree) => {
      var nodess2 = cluster.nodes(root)
      var links2 = cluster.links(nodess2)
      var tmp = { list: [demodata.shareHolderTree] }
      getAllNodesLeft(demodata.shareHolderTree, tmp)
      cluster(root) // 计算左边的树形结构
      var descendants2 = tmp.list
      descendants2.forEach((d, i) => {
        d.y *= -1
      }) // 初始计算的时候是 右边的树形结构，乘以-1变成左边的树形结构

      var vertical2 = calcMaxyLeft(descendants2)
      var nodeP2 = gnode2.selectAll('g.node').data(descendants2, function (d) {
        return `id2${d.id}`
      })
      // 节点 g.node
      var nodeEnter2 = nodeP2
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.y0 == undefined ? source.y : source.y0},${source.x0 == undefined ? source.x : source.x0})`
        ) // 竖向的
        .attr('node-id', function (t) {
          var pid = t.parent ? (t.parent.Id ? t.parent.Id : t.parent.id) : t.id
          var tid = t.Id || t.id
          return t.depth ? t.depth + '|' + pid + '|' + tid : t.Id
        })

      // 展开按钮
      nodeEnter2
        .filter(function (d) {
          if (!d.depth) return false
          return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
        })
        .append('circle')
        .attr('class', 'ctrl_circle')
        .attr('r', 8)
        .attr('cx', -10)
        .attr('cy', 29)
        .attr('fill', function (d) {
          return '#fff'
        })
        .attr('stroke', function (d) {
          return primary_color
        })
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', function (d) {
          return 1.2
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d, 1)
        })

      // + ICON
      nodeEnter2
        // .filter(function(d) {
        //     return d.depth !== 0;
        // })
        .append('path')
        .attr('fill', primary_color)
        .attr('stroke', primary_color)
        .attr('stroke-width', '0.1')
        .attr('transform', `translate(-10,29)`)
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d, 1)
        })

      // nodeP2.select("path")
      //     .attr("d", function(d) {
      //         if (d.children && d.children.length) {
      //             return "M-5 -1 H5 V1 H-5 Z" // 此时展开状态-，有children
      //         } else if (d.spread) {
      //             return "M-5 -1 H-1 V-5 H1 V-1 H5 V1 H1 V5 H-1 V1 H-5 Z" // 此时收起状态+，无children
      //         }
      //     });

      nodeP2
        .filter(function (d) {
          return d.depth !== 0
        })
        .select('path')
        .attr('d', function (d) {
          if (d.children && d.children.length) {
            return 'M-5 -1 H5 V1 H-5 Z' // 此时展开状态-，有children
          } else if (d.spread) {
            return 'M-5 -1 H-1 V-5 H1 V-1 H5 V1 H1 V5 H-1 V1 H-5 Z' // 此时收起状态+，无children
          }
        })

      // 箭头
      nodeEnter2
        .filter(function (d) {
          return d.depth !== 0
        })
        .append('path')
        .attr('fill', '#c5c5c5')
        .attr('target-hover-arrow', function (d) {
          return d.Id + '|' + d.depth
        })
        .attr('target-hover-arrow-child', function (d) {
          if (d.parent && d.parent.depth) {
            return d.parent.Id + '|' + d.parent.depth
          }
        })
        .attr('d', function (d) {
          return 'M195 25 L205 30 L195 35Z'
        })

      // 根节点加矩形
      nodeEnter2
        .filter((d) => d.depth == 0)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', primary_color)
        .style('opacity', '1')
        .attr('stroke', function (d) {
          return d.type == 'bond' ? '#ddd' : '#90bbd0'
        })
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      var rectBoxG4 = nodeEnter2.append('g').attr('class', 'react-box-g')

      // --------------------------------------------------------------------------------------
      // 上市 标识
      createTag(rectBoxG4, TagTypeEnum.LISTED)
      // 发债标识
      createTag(rectBoxG4, TagTypeEnum.ISSUED)
      // 新进/注销 标识
      createTag(rectBoxG4, TagTypeEnum.NEWINRECENTYEAR)

      createIcon(rectBoxG4, IconTypeEnum.ACTOR)
      createIcon(rectBoxG4, IconTypeEnum.BENIFCIARY)
      createIcon(rectBoxG4, IconTypeEnum.ACTCTRL)

      // 添加hover动画事件
      var reactBoxChild4 = rectBoxG4
        .filter((d) => d.depth > 0)
        .on('mouseover', function (d) {
          // d3.select(this).classed('', true);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })
          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return true
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return true
          })
          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              var p = d3.select(this.parentNode)
              p = p.node()
              if (p.nextSibling) p.parentNode.appendChild(p)
              return true
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return true
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })
        .on('mouseout', function (d) {
          // d3.select(this).classed('', false);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in', function () {
            return false
          })

          var hoverLinksOther = d3.selectAll('.link-flow-in')
          hoverLinksOther.classed('link-flow-in', function () {
            return false
          })

          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return false
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return false
          })

          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            return false
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in', function () {
              return false
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return false
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })

      // 节点矩形
      reactBoxChild4
        .append('rect')
        .attr('stroke-width', 1.2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', (d) => (d.type == 'bond' ? '#f4f4f4' : 'transparent'))
        .style('opacity', (d) => 1)
        .attr('class', 'rect-corp')
        .on('click', (d) => {
          d.Id && _refreshLists(d)
        })
        .attr('stroke', function (d) {
          if (d.type == 'person') {
            return borderPersonColor
          }
          return d.type == 'bond' ? '#ddd' : borderColor
        })
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      // 节点文本内容
      var labelTxts = createText(rectBoxG4)

      labelTxts
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          d.Id && _refreshLists(d)
        })
        .text(gqctLabelFirst)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start'))
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
      labelTxts
        .filter(function (d) {
          if (d._namelen > 10) {
            return true
          }
        })
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          d.Id && _refreshLists(d)
        })
        .text(gqctLabelSecond)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start')) // .attr('fill',d=>d.data.color)
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
        .attr('x', function (d) {
          return d.depth ? (window.en_access_config || d._nameIsUpper ? 5 : 10) : 80
        })
        .attr('dy', function (d) {
          if (d._multiline) {
            if (d._namelen > 12) {
              return 13
            }
          }
          return 20
        })

      labelTxts
        .filter((d) => d.depth !== 0)
        .append('tspan')
        .style('font-size', 12)
        .style('cursor', 'pointer')
        .text(function (d) {
          var Ratio = d.parentStockShare
          if (Ratio) {
            Ratio = (parseFloat(Ratio).toFixed(2) * 10000) / 10000 + '%'
          } else {
            Ratio = '--'
          }
          return Ratio
        })
        .attr('fill', '#999')
        .attr('x', function (dd) {
          return 165
        })
        .attr('y', 45)
        .append('tspan')
        .style('font-size', 10)
        .style('cursor', 'pointer')
        // .text('------------------------------------')
        .attr('class', 'tspan--')
        .attr('fill', function (d) {
          if (d.listed || d.issued || d.newInRecentYear || wftCommon.unNormalStatus.indexOf(d.reg_status) > -1) {
            return '#A7E3EC'
          }
          return 'transparent'
        })
        .attr('x', function (dd) {
          return 0
        })
        .attr('y', 33)

      rectBoxG4.append('title').text((d) => {
        var t = d.name
        return t
      })

      nodeP2
        .transition()
        .duration(duration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)

      nodeP2
        .exit()
        // .transition()
        .remove()
        // .attr('transform', d => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)

      // g.links渲染
      var linkPL = glinks2.selectAll('g.link').data(links2, (d) => d.target.id)
      let linkEnterL = linkPL.enter().append('g').attr('class', 'link')
      linkEnterL
        .append('path')
        .attr('class', 'link-path')
        .attr('fill', 'none')
        .attr('stroke-opacity', '0.9')
        .attr('stroke', '#c5c5c5')
        .attr('stroke-width', 1)
        .attr('target-hover-flow-id', function (t) {
          return t.source.Id + '|' + t.source.depth
        })
        .attr('target-hover-id', function (d) {
          return d.target.Id + '|' + d.target.depth
        })
        .attr('path-id', function (t) {
          return (
            (t.source.depth ? t.source.depth : 0) +
            '|' +
            (t.source.Id ? t.source.Id : t.source.id) +
            '|' +
            (t.target.Id ? t.target.Id : t.target.id)
          )
        })
        .attr('d', function (d) {
          var r = null
          if (vertical2) {
            vertical2.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }
          var a1 = 'M' + (d.target.y + rectWidth) + ',' + (d.target.x + rectHeight / 2)
          var a2 = 'L' + (d.target.y + (d.source.y - d.target.y + rectWidth) / 2) + ',' + (d.target.x + rectHeight / 2)
          var a4 = 'L' + (d.target.y + (d.source.y - d.target.y + rectWidth) / 2) + ',' + (r.x + rectHeight / 2)
          var a5 = 'L' + (d.source.y - (d.source.depth ? 20 : 0)) + ',' + (r.x + rectHeight / 2)
          return a1 + a2 + a4 + a5
        })
      var newLinkL = [] // 该集合存放enter、update的merge
      linkEnterL[0].forEach(function (t) {
        if (t) {
          var tag = false
          for (var i = 0; i < linkPL[0].length; i++) {
            var tt = linkPL[0][i]
            if (tt === t) {
              tag = true
              break
            }
          }
          if (!tag) {
            newLinkL.push(t)
          }
        }
      })
      newLinkL = newLinkL.concat(linkPL[0])
      newLinkL = d3.selectAll(newLinkL)
      newLinkL
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var r = null
          if (vertical2) {
            vertical2.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }
          var a1 = 'M' + (d.target.y + rectWidth) + ',' + (d.target.x + rectHeight / 2)
          var a2 = 'L' + (d.target.y + (d.source.y - d.target.y + rectWidth) / 2) + ',' + (d.target.x + rectHeight / 2)
          var a4 = 'L' + (d.target.y + (d.source.y - d.target.y + rectWidth) / 2) + ',' + (r.x + rectHeight / 2)
          var a5 = 'L' + (d.source.y - (d.source.depth ? 20 : 0)) + ',' + (r.x + rectHeight / 2)
          return a1 + a2 + a4 + a5
        })
      var linkexit = linkPL.exit()
      linkexit.remove()

      linkexit
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          return 'M0,0L0,0L0,0L0,0'
        })

      if (removeSonTree) {
        removeSonTrees(source)
      }
      descendants2.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }

    var update = (source, removeSonTree) => {
      var nodess = cluster.nodes(root1)
      var links = cluster.links(nodess)
      var tmp = { list: [demodata.investTree] }
      getAllNodes(demodata.investTree, tmp)
      var descendants = tmp.list
      cluster(root1) // 计算右边的树形结构
      var vertical = calcMaxy(descendants)
      // 绘制节点初始位置 子节点
      var nodeP = gnode.selectAll('g.node').data(descendants, (d) => d.id)
      var nodeEnter = nodeP
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr(
          'transform',
          `translate(${source.y0 === undefined ? source.y : source.y0},${source.x0 == undefined ? source.x : source.x0})`
        ) // 竖向的
        .attr('node-id', function (t) {
          var pid = t.parent ? (t.parent.Id ? t.parent.Id : t.parent.id) : t.id
          var tid = t.Id || t.id
          return t.depth ? t.depth + '|' + pid + '|' + tid : t.Id
        }) //

      // --------------------------------------------------------------------------------------
      // 上市 标识
      createTag(nodeEnter, TagTypeEnum.LISTED)
      // 发债标识
      createTag(nodeEnter, TagTypeEnum.ISSUED)
      // 新进/注销 标识
      createTag(nodeEnter, TagTypeEnum.NEWINRECENTYEAR)

      // -----------
      // 展开/收起 icon
      nodeEnter
        .filter(function (d) {
          if (!d.depth) return false
          return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
        })
        .append('circle')
        .attr('class', 'ctrl_circle')
        .attr('r', 8)
        .attr('cx', 170)
        .attr('cy', 29)
        .attr('fill', function (d) {
          return '#fff'
        })
        .attr('stroke', function (d) {
          return primary_color
        })
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', function (d) {
          return 1.2
        })
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d)
        })
      nodeEnter
        .filter(function (d) {
          return d.depth !== 0
        })
        .append('path')
        .attr('fill', primary_color)
        .attr('stroke', primary_color)
        .attr('stroke-width', '0.1')
        .attr('transform', `translate(170,29)`)
        .on('click', function (d) {
          if (!d.depth) return
          _toggle(d)
        })
      nodeP
        .filter(function (d) {
          return d.depth !== 0
        })
        .select('path')
        .attr('d', function (d) {
          if (d.children && d.children.length) {
            return 'M-5 -1 H5 V1 H-5 Z' // 此时展开状态-，有children
          } else if (d.spread) {
            return 'M-5 -1 H-1 V-5 H1 V-1 H5 V1 H1 V5 H-1 V1 H-5 Z' // 此时收起状态+，无children
          }
        })

      nodeEnter
        .filter(function (d) {
          return d.depth !== 0
        })
        .append('path')
        .attr('fill', '#c5c5c5')
        .attr('target-hover-arrow', function (d) {
          return d.Id + '|' + d.depth
        })
        .attr('target-hover-arrow-child', function (d) {
          if (d.parent && d.parent.depth) {
            return d.parent.Id + '|' + d.parent.depth
          }
        })
        .attr('d', function (d) {
          return 'M-10 25 L0 30 L-10 35Z'
        })

      nodeEnter
        .filter((d) => d.depth == 0)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', primary_color)
        .style('opacity', '1')
        .attr('stroke', function (d) {
          return d.type == 'bond' ? '#ddd' : '#90bbd0'
        })
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)
      var rectBoxG3 = nodeEnter.append('g').attr('class', 'react-box-g')

      var reactBoxChild3 = rectBoxG3
        .filter((d) => d.depth > 0)
        .on('mouseover', function (d) {
          // d3.select(this).classed('', true);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in-r', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })
          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return true
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return true
          })
          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in', function () {
            var p = d3.select(this.parentNode)
            p = p.node()
            if (p.nextSibling) p.parentNode.appendChild(p)
            return true
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in-r', function () {
              var p = d3.select(this.parentNode)
              p = p.node()
              if (p.nextSibling) p.parentNode.appendChild(p)
              return true
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return true
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })
        .on('mouseout', function (d) {
          // d3.select(this).classed('', false);
          var hoverLinks = d3.selectAll('[target-hover-id="' + d.Id + '|' + d.depth + '"]')
          hoverLinks.classed('link-flow-in-r', function () {
            return false
          })

          var hoverLinksOther = d3.selectAll('.link-flow-in')
          hoverLinksOther.classed('link-flow-in', function () {
            return false
          })

          var hoverArrows = d3.selectAll('[target-hover-arrow="' + d.Id + '|' + d.depth + '"]')
          hoverArrows.classed('arrow-flow-in', function () {
            return false
          })
          var hoverArrowChilds = d3.selectAll('[target-hover-arrow-child="' + d.Id + '|' + d.depth + '"]')
          hoverArrowChilds.classed('arrow-flow-in', function () {
            return false
          })

          var hoverFlowLinks = d3.selectAll('[target-hover-flow-id="' + d.Id + '|' + d.depth + '"]')
          hoverFlowLinks.classed('link-flow-in-r', function () {
            return false
          })

          // 一直往上层渲染直到根节点
          function hoverP(t) {
            var hoverLinks = d3.selectAll('[target-hover-id="' + t.Id + '|' + t.depth + '"]')
            hoverLinks.classed('link-flow-in-r', function () {
              return false
            })
            var hoverArrows = d3.selectAll('[target-hover-arrow="' + t.Id + '|' + t.depth + '"]')
            hoverArrows.classed('arrow-flow-in', function () {
              return false
            })
            if (t.parent && t.parent.depth) {
              hoverP(t.parent)
            }
          }

          if (d.parent && d.parent.depth) {
            hoverP(d.parent)
          }
        })

      reactBoxChild3
        .append('rect')
        .attr('stroke-width', 1.2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', (d) => (d.type == 'bond' ? '#f4f4f4' : 'transparent'))
        .style('opacity', (d) => 1)
        .attr('class', 'rect-corp')
        .on('click', (d) => {
          d.Id && _refreshLists(d)
        })
        .attr('stroke', function (d) {
          if (d.type == 'person') {
            return borderPersonColor
          }
          return d.type == 'bond' ? '#ddd' : borderColor
        })
        .style('cursor', 'pointer')
        .attr('rx', 2)
        .attr('ry', 2)

      // 节点文本内容
      var labelTxts = createText(rectBoxG3)

      labelTxts
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          d.Id && _refreshLists(d)
        })
        .text(gqctLabelFirst)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start'))
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))

      labelTxts
        .filter(function (d) {
          if (d.name && d.name.length > 10) {
            return true
          }
        })
        .append('tspan')
        .style('font-size', nodeFontSizeSet)
        .style('cursor', 'pointer')
        .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
        .on('click', function (d) {
          d.Id && _refreshLists(d)
        })
        .text(gqctLabelSecond)
        .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start')) // .attr('fill',d=>d.data.color)
        .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
        .attr('x', function (d) {
          return d.depth ? (window.en_access_config || d._nameIsUpper ? 5 : 10) : 80
        })
        .attr('dy', function (d) {
          if (d._multiline) {
            if (d.name.length > 12) {
              return 13
            }
          }
          return 20
        })

      labelTxts
        .filter((d) => d.depth !== 0)
        .append('tspan')
        .style('font-size', 12)
        .style('cursor', 'pointer')
        .text(function (d) {
          var Ratio = d.parentStockShare
          if (Ratio) {
            Ratio = (parseFloat(Ratio).toFixed(2) * 10000) / 10000 + '%'
          } else {
            Ratio = '--'
          }
          return Ratio
        })
        .attr('fill', '#999')
        .attr('x', function (dd) {
          return -40
        })
        .attr('y', 45)
        .append('tspan')
        .style('font-size', 10)
        .style('cursor', 'pointer')
        // .text('------------------------------------')
        .attr('class', 'tspan--')
        .attr('fill', function (d) {
          if (d.listed || d.issued || d.newInRecentYear || wftCommon.unNormalStatus.indexOf(d.reg_status) > -1) {
            return '#A7E3EC'
          }
          return 'transparent'
        })
        .attr('x', function (dd) {
          return 0
        })
        .attr('y', 33)

      rectBoxG3.append('title').text((d) => {
        var t = d.name
        return t
      })

      // 将节点动画至目标位置
      nodeP
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return `translate(${d.y},${d.x})`
        })
      var nodeExit = nodeP.exit().remove().attr('fill-opacity', 0).attr('stroke-opacity', 0)

      var linkP3 = glink.selectAll('g.link').data(links, (d) => d.target.id)
      let linkEnter3 = linkP3.enter().append('g').attr('class', 'link')
      linkEnter3
        .append('path')
        .attr('class', 'link-path')
        .attr('fill', 'none')
        .attr('stroke-opacity', '0.9')
        .attr('stroke', '#c5c5c5')
        .attr('stroke-width', 1)
        .attr('target-hover-flow-id', function (t) {
          return t.source.Id + '|' + t.source.depth
        })
        .attr('target-hover-id', function (d) {
          return d.target.Id + '|' + d.target.depth
        })
        .attr('path-id', function (t) {
          return (
            (t.source.depth ? t.source.depth : 0) +
            '|' +
            (t.source.Id ? t.source.Id : t.source.id) +
            '|' +
            (t.target.Id ? t.target.Id : t.target.id)
          )
        })
        .attr('d', function (d) {
          var r = null
          if (vertical) {
            vertical.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }
          var a1 = 'M' + (d.target.y - 10) + ',' + (d.target.x + rectHeight / 2)
          var a2 = 'L' + (d.target.y - (d.target.y - d.source.y - rectWidth) / 2) + ',' + (d.target.x + rectHeight / 2)
          var a4 = 'L' + (d.target.y - (d.target.y - d.source.y - rectWidth) / 2) + ',' + (r.x + rectHeight / 2)
          var a5 = 'L' + (d.source.y + rectWidth + (d.source.depth ? 20 : 0)) + ',' + (r.x + rectHeight / 2)
          return a1 + a2 + a4 + a5
        })
      var newLink = [] // 该集合存放enter、update的merge
      linkEnter3[0].forEach(function (t) {
        if (t) {
          var tag = false
          for (var i = 0; i < linkP3[0].length; i++) {
            var tt = linkP3[0][i]
            if (tt === t) {
              tag = true
              break
            }
          }
          if (!tag) {
            newLink.push(t)
          }
        }
      })
      newLink = newLink.concat(linkP3[0])
      newLink = d3.selectAll(newLink)
      newLink
        .selectAll('path.link-path')
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var r = null
          if (vertical) {
            vertical.forEach(function (t) {
              if (t.Id == d.source.Id && t.depth == d.source.depth) {
                r = t
              }
            })
          }
          if (!r) {
            r = d.source
          }
          var a1 = 'M' + (d.target.y - 10) + ',' + (d.target.x + rectHeight / 2)
          var a2 = 'L' + (d.target.y - (d.target.y - d.source.y - rectWidth) / 2) + ',' + (d.target.x + rectHeight / 2)
          var a4 = 'L' + (d.target.y - (d.target.y - d.source.y - rectWidth) / 2) + ',' + (r.x + rectHeight / 2)
          var a5 = 'L' + (d.source.y + rectWidth + (d.source.depth ? 20 : 0)) + ',' + (r.x + rectHeight / 2)
          return a1 + a2 + a4 + a5
        })
      var linkexit = linkP3.exit()
      linkexit.remove()
      // linkexit.selectAll('path.link-path').transition().duration(duration).attr("d", function(d) {
      //     return 'M0,0L0,0L0,0L0,0';
      // });
      descendants.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })

      if (removeSonTree) {
        removeSonTrees(source)
      }
    }

    if (CompanyChart.onlyInvest == 1) {
      // 只看股东
      updateLeft(root)
    } else if (CompanyChart.onlyInvest == 2) {
      // 只看投资
      update(root1)
    } else {
      updateLeft(root)
      update(root1)
    }

    CompanyChart._thirdUpdate = update
    CompanyChart._thirdUpdateLeft = updateLeft
  }

  function _toggle(d, bol) {
    if (onlyShareholderOrInvest === 'invest') {
      pointBuriedByModule(922602101003)
    } else {
      pointBuriedByModule(922602100988)
    }

    var _lockTime = Date.now()
    var long = _lockTime - lockTime
    if (long < 500) {
      // 500ms内不允许重复点击
      // layer.msg('抱歉，您的操作过于频繁')
      return false
    }
    lockTime = _lockTime
    investChartId = 0
    shareholderChartId = 0
    if (d.depth == 0) {
      d.children = d._children
      if (!bol) {
        CompanyChart._thirdUpdate(d)
      } else {
        CompanyChart._thirdUpdateLeft(d)
      }
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
        CompanyChart._thirdUpdate(d, d._children && d._children.length ? true : false)
      } else {
        CompanyChart._thirdUpdateLeft(d, d._children && d._children.length ? true : false)
      }
      return
    }
    if (!bol) {
      getThirdData(d)
    } else {
      getThirdData(d, bol)
    }
  }

  const traverseTreeId = (node) => {
    var id = 1
    trId(node)

    function trId(node) {
      node.id = id
      node.name = node.name || 'N/A'
      id++
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          trId(node.children[i])
        }
      }
      if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          trId(node._children[i])
        }
      }
    }
  }

  function removeSonTrees(source) {
    // 收起子树时，部分path和node会依然驻留 此处添加动作删除
    var lid = source.Id ? source.Id : source.id
    setTimeout(function () {
      source._children &&
        source._children.length &&
        source._children.forEach(function (t) {
          var rid = t.Id ? t.Id : t.id
          var $sel = d3.selectAll('[path-id="' + (source.depth ? source.depth : 0) + '|' + lid + '|' + rid + '"]')
          if ($sel && $sel.length && $sel[0] && $sel[0].length) {
            // console.log($sel);
          }
          var pid = t.parent ? (t.parent.Id ? t.parent.Id : t.parent.id) : t.id
          var tid = t.Id || t.id
          var $selNode = d3.selectAll('[node-id="' + t.depth + '|' + pid + '|' + tid + '"]')
          if ($selNode && $selNode.length && $selNode[0] && $selNode[0].length) {
            // console.log($selNode);
          }
          $sel.remove()
          $selNode.remove()
        })
    }, 100)
  }

  function handleThirdApi(res, d, left) {
    function call(endata, newdata) {
      var data = null
      data = newdata ? newdata : endata
      try {
        if (d) {
          d.children = data

          if (shareHolderTree) {
            drawShareholderTree(d)
            return
          }

          if (!left) {
            CompanyChart._thirdUpdate(d)
          } else {
            CompanyChart._thirdUpdateLeft(d)
          }
        }
      } catch (e) {}
    }

    setLoaded(false)

    if (window.en_access_config) {
      wftCommon.zh2en(res.Data, (endata) => {
        call(endata, null)
      })
    } else {
      call(res.Data, null)
    }
  }

  function getThirdData(d, left) {
    var params = {
      ratio: ratio,
      ratioUp: ratioUp,
      status: onlyNormalCorp ? '存续' : '全部',
    }
    if (d) {
      // 加载子节点数据
      params.currentCorpId = d.Id
      params.companyCode = companyCode
      params.type = left ? 'parents' : 'children'
    } else {
      // 加载全部数据
      params.currentCorpId = companyCode
      params.companyCode = companyCode
      params.type = 'root'
    }
    !loading && setLoaded(true)
    params.__primaryKey = companyCode
    getCorpModuleInfo(`/graph/company/${cmd}`, params).then((res) => handleThirdApi(res, d, left))
  }

  return (
    <div className={` gqct-chart-instance ${linkSourceRIME ? 'rime-gqct-chart-instance' : ''} `} ref={domRef}>
      {snapshot ? null : (
        <div className="chart-icons">
          {exportFn ? (
            <FileTextO
              onClick={() => {
                if (onlyShareholderOrInvest === 'invest') {
                  pointBuriedByModule(922602100989)
                } else {
                  pointBuriedByModule(922602101002)
                }
                exportFn(companyName)
              }}
              data-uc-id="JY9vowjlu"
              data-uc-ct="filetexto"
            />
          ) : null}
          <SaveO onClick={thirdSaveEvent} data-uc-id="b6Bzz4flZG" data-uc-ct="saveo" />
          <RefreshO onClick={freshChart} data-uc-id="jVK-htmWWg" data-uc-ct="refresho" />
        </div>
      )}
      <div
        className={` gqct-graph-content ${waterMask ? 'chart-content-watermask' : ''}`}
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
                    data-uc-id="nuBdD1yYpp"
                    data-uc-ct="svg"
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

export default ShareAndInvestTree
