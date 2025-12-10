/** @format */

import { RefreshO, SaveO } from '@wind/icons'
import { Checkbox, Spin } from '@wind/wind-ui'
import * as echarts from 'echarts'
import React, { useEffect, useRef, useState } from 'react'
import { getrelationpath, getrelationpathmulti } from '../../api/chartApi'
import sy2 from '../../assets/imgs/chart/sy2.png'
import global from '../../lib/global'
import { VipPopup } from '../../lib/globalModal'
import intl from '../../utils/intl'
import { debounce, wftCommon } from '../../utils/utils'
import './GraphChart.less'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

const CompanyChart = {}

const allColorsObj = {
  actctrl: {
    idx: 0,
    txt: window.en_access_config ? intl('138125') : '控制',
    props: null,
  },
  address: {
    idx: 1,
    txt: window.en_access_config ? 'address' : '地址',
    props: 'address',
  },
  branch: {
    idx: 2,
    txt: intl('138183', '分支机构'),
    props: null,
  },
  domain: {
    idx: 3,
    txt: window.en_access_config ? 'domain' : '域名',
    props: 'domain',
  },
  invest: {
    idx: 4,
    txt: intl('102836', '投资'),
    props: null,
  },
  legalrep: {
    idx: 5,
    txt: intl('138733', '法人'),
    props: null,
  },
  member: {
    idx: 6,
    txt: intl('64504', '高管'),
    props: 'position',
  },
  tel: {
    idx: 7,
    txt: window.en_access_config ? 'tel' : '电话',
    props: 'tel',
  },
  email: {
    idx: 8,
    txt: window.en_access_config ? 'email' : '邮件',
    props: 'email',
  },
  investctrl: {
    idx: 9,
    txt: intl('138629', '控股'),
    props: null,
  },
  relativeperson: {
    idx: 10,
    txt: '@@@亲属', // 泛概念
    props: 'relateName',
  },
  customer: {
    idx: 11,
    txt: intl('28717', '客户'),
    props: null,
  },
  supplier: {
    idx: 12,
    txt: intl('108764', '供应商'),
    props: null,
  },
  merge: {
    idx: 13,
    txt: window.en_access_config ? 'merge' : '收购',
    props: 'mergerTitle',
  },
  guarantee: {
    idx: 14,
    txt: intl('27494', '担保'),
    props: null,
  },
  equitypledge: {
    idx: 15,
    txt: intl('138281', '股权出质'),
    props: null,
  },
  stockpledge: {
    idx: 16,
    txt: intl('132933', '股票质押'),
    props: null,
  },
  classmate: {
    idx: 17,
    txt: window.en_access_config ? 'classmate' : '同学',
    props: null,
  },
  bid: {
    idx: 18,
    txt: window.en_access_config ? 'bid' : '中标',
    props: null,
  },
}
const debounceFetchData = debounce((fn) => {
  fn()
}, 50)

function pathDataChange(data, notControlLenth) {
  var paths = data.paths
  var nodeObj = {} // node 对象，有唯一key
  var routeObj = {} // route 对象，有唯一key
  var nodes = [] // node arr
  var links = [] // route arr

  for (var i = 0; i < paths.length; i++) {
    var nodeInPath = paths[i].nodes

    // 是否限制长度
    if (!notControlLenth) {
      if (nodeInPath.length > 3) {
        nodeInPath.length = 3
      }
    }

    for (var j = 0; j < nodeInPath.length; j++) {
      var node = nodeInPath[j]
      if (!node.nodeName || node.nodeName === 'N/A') {
        node.nodeName = node.windId
      }
      if (!nodeObj[node.windId]) {
        nodeObj[node.windId] = node
        nodes.push(node)
      } else {
        nodeObj[node.windId].level = node.level
      }
    }
  }

  for (var i = 0; i < data.routes.length; i++) {
    var route = data.routes[i]
    var startId = route.startId
    var endId = route.endId
    var _routeId = route.startId + '_' + route.endId
    route._routeId = _routeId
    if (nodeObj[startId] && nodeObj[endId]) {
      links.push(route)
    }
    if (!routeObj[_routeId]) {
      routeObj[_routeId] = route
    }
  }
  return { nodes: nodes, routes: links, nodeObj: nodeObj, routeObj: routeObj }
}

/**
 * 将canvas保存本地img
 *
 * @param {any} name , img前缀
 * @param {any} canvas , canvas对象
 */
function downloadimg(name, canvas) {
  var qual = 0.8 // 图片质量
  if (canvas.width > 5000) {
    qual = 0.4
  } else if (canvas.width > 3000) {
    qual = 0.5
  } else if (canvas.width > 2000) {
    qual = 0.6
  }
  if (canvas.height > 20000) {
    qual = 0.1
  } else if (canvas.height > 10000) {
    qual = 0.2
  } else if (canvas.height > 5000) {
    qual = 0.4
  } else if (canvas.height > 2000) {
    qual = qual < 0.5 ? qual : 0.5
  } else if (canvas.height > 1000) {
    qual = qual < 0.6 ? qual : 0.6
  }
  //设置保存图片的类型
  var imgdata = canvas.toDataURL('image/jpeg', qual)
  var filename = name + '_' + new Date().toLocaleDateString() + '.jpeg'
  var a = document.createElement('a')
  var event = new MouseEvent('click')
  a.download = filename
  a.href = imgdata
  a.dispatchEvent(event)
}

function pathChange(paths) {
  var tmp = wftCommon.chartPathChange(paths)
  CompanyChart.filterPathObj = tmp.filterPathObj
  CompanyChart.allPathObj = tmp.allPathObj
  CompanyChart.statePathObj = tmp.statePathObj
  CompanyChart.highLightPath = tmp.highLightPath
  return tmp
}

//计算路径(根据后端路径生成)
function calPathNew(nodeMaps, paths) {
  var paths = CompanyChart.allPathObj
  var rPath = []
  for (var k in paths) {
    var t = paths[k]
    var nPath = t.nodes
    var cPath = []

    for (var j = 0; j < nPath.length; j++) {
      var node = nPath[j]
      var rNode = nodeMaps[node.windId]
      cPath.push(rNode)
    }
    // cPath._idx = i
    rPath.push(cPath)
  }
  return rPath
}

function filterNodes(nodes, paths) {
  var newNodes = []
  nodes.map(function (i, node) {
    var exist = false
    for (var i = 0; i < paths.length; i++) {
      if (existNode(node, paths[i])) {
        exist = true
      }
    }
    if (exist) {
      newNodes.push(node)
    }
  })
  nodes = newNodes
  return nodes
}

function existNode(node, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].name == node.name) {
      return true
    }
  }
  return false
}

//计算节点坐标位置
function calcPos(nodes, paths, mwidth, mheight) {
  var levels = {}
  var len = 0
  var keys = null

  nodes.map(function (node, index) {
    if (!levels[node.level]) {
      levels[node.level] = []
    }
    levels[node.level].push(node)
  })
  keys = Object.keys(levels)
  len = keys.length

  if (keys[len - 1] >= len) {
    // 兼容后端数据返回level有断层情况，处理逻辑：将断层level补齐，其他大于断层level全部-1
    var wrongLevel = 0
    for (var ii = 0; ii < keys.length; ii++) {
      if (keys[ii] !== ii) {
        wrongLevel = ii
        break
      }
    }
    for (var kkk in levels) {
      if (kkk > wrongLevel) {
        var tnodes = levels[kkk]
        tnodes.forEach(function (t, idx) {
          t.level = t.level - 1
        })
      }
    }
    levels = {}
    len = 0
    keys = null
    nodes.map((node, index) => {
      if (!levels[node.level]) {
        levels[node.level] = []
      }
      levels[node.level].push(node)
    })
    keys = Object.keys(levels)
    len = keys.length
  }

  ////**** */
  var endNodesCount = levels[len - 1].length
  var endNodesIdx = 0
  var endNodesMatchs = {}
  ////**** */

  // 当所有路径与点刚好绘制成一个圆时
  if (paths.length > 1 && nodes.length === len) {
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i]

      if (path.length > 2) {
        var area = {
          width: mwidth,
          height: mheight,
        }
        var xSpan = area.width / len // x 间隔
        for (var j = 0; j < path.length; j++) {
          var node = path[j]
          node.initial = []
          node.initial[0] = xSpan * j + xSpan / 2
          node.initial[1] = area.height / 2
          if (node.level != 0 && node.level != len - 1) {
            var ySpan = area.height / path.length // y
            var ySpanMargin = ySpan / 2
            node.initial[1] = i * ySpan + ySpanMargin
          }
          node.x = node.initial[0]
          node.y = node.initial[1]
        }
      } else {
        var area = {
          width: mwidth,
          height: mheight,
        }
        var xSpan = area.width / xLen - 20 // x 间隔

        for (var j = 0; j < path.length; j++) {
          var node = path[j]
          node.initial = []
          if (i == 0) {
            node.initial[0] = xSpan * j * len + xSpan / 2 + 10
          } else {
            node.initial[0] = xSpan * j * len + xSpan / 2
          }
          node.initial[0] = xSpan * j * len + xSpan / 2
          node.initial[1] = area.height / 2
          node.x = node.initial[0]
          node.y = node.initial[1]
        }
      }
    }
    return
  }

  for (var k in keys) {
    var xLen = len
    // 如果最长的level比level个数len大，说明中间有间隔，需要单独处理x间隔
    if (keys[len - 1] - (len - 1)) {
      xLen = len + (keys[len - 1] - (len - 1))
    }

    var level = keys[k]
    var sameLevelNodes = levels[level]
    var needVNode = false // 补一个虚拟节点
    if (sameLevelNodes) {
      var area = {
        width: mwidth,
        height: mheight,
      }
      var xSpan = area.width / (xLen - 1) //  - 20 // x 间隔
      if (sameLevelNodes.length % 2) {
        // 奇数情况下 为了避免中间的那个点可能造成与直线重合 此时补一个虚拟节点 保证上下均分 不重合
        needVNode = true
      }
      sameLevelNodes.map(function (node, i) {
        node.initial = []

        // if (k == '0') {
        //   node.initial[0] = xSpan * level + xSpan / 2 + 10
        // } else {
        //   node.initial[0] = xSpan * level + xSpan / 2
        // }

        /*****/
        if (k == len - 1) {
          node.initial[0] = xSpan * (len - 1 - level) + xSpan / 2 + 50
        } else {
          node.initial[0] = xSpan * (len - 1 - level) + xSpan / 2
        }
        if (endNodesCount > 1 && CompanyChart.leftParams.indexOf(node.keyNo) > -1) {
          if (endNodesMatchs[node.keyNo]) {
            node.initial = endNodesMatchs[node.keyNo]
          } else {
            var ySpan = area.height / endNodesCount
            var ySpanMargin = ySpan / 2
            node.initial[1] = endNodesIdx * ySpan + ySpanMargin
            node.initial[0] = xSpan / 2 + 50
            endNodesMatchs[node.keyNo] = [node.initial[0], node.initial[1]]
            endNodesIdx++
          }
          node.x = node.initial[0]
          node.y = node.initial[1]
          return
        }
        /*****/

        node.initial[1] = area.height / 2
        if (level != 0 && level != len - 1) {
          var ySpan = area.height / (needVNode ? sameLevelNodes.length + 1 : sameLevelNodes.length) // y
          var ySpanMargin = ySpan / 2
          if (sameLevelNodes.length > 6) {
            // 对于同层级节点很多的情况 适当放宽中间区域间隔
            if (i < sameLevelNodes.length / 2) {
              node.initial[1] = (i - 0.3) * ySpan + ySpanMargin
            } else {
              node.initial[1] = i * ySpan + ySpanMargin
            }
          } else {
            node.initial[1] = i * ySpan + ySpanMargin
          }
        }
        node.x = node.initial[0]
        node.y = node.initial[1]
      })
    }
  }
}

/**
 * 节点样式置为灰白
 * @param {*} node
 * @param {*} nodeOpacityTwo
 */
function nodeBlank(node, nodeOpacityTwo) {
  node.itemStyle.normal.borderWidth = 2
  node.itemStyle.normal.opacity = nodeOpacityTwo
  node.label.opacity = nodeOpacityTwo
}

/**
 * 高亮节点及其背景
 * @param {*} node
 */
function nodeHigh(node) {
  node.itemStyle.normal.opacity = 1
  node.label.opacity = 1
}

/**
 * 节点从高亮还原成普通样式、及背景
 * @param {*} node
 */
function nodeNotHigh(node) {
  node.itemStyle.normal.borderWidth = 2
  node.itemStyle.normal.opacity = 1
  node.label.opacity = 1
}

function lineHide(link, lineWidthOne, lineTxtColorOne) {
  link.lineStyle.opacity = 0
}

/**
 * link 高亮展示
 * @param {*} link
 * @param {*} lineSelColor
 * @param {*} lineSelWidth
 * @param {*} lineSelLabelColor
 * @param {*} lineSelFontSize
 */
function lineHigh(link, lineSelColor, lineSelWidth, lineSelLabelColor, lineSelFontSize) {
  link.lineStyle.color = lineSelColor
  link.lineStyle.width = lineSelWidth
  link.label.color = lineSelLabelColor
  link.label.fontSize = lineSelFontSize
  link.lineStyle.opacity = 1
}

/**
 * 关系样式还原
 * @param {*} link
 * @param {*} lineTxtColorOne
 * @param {*} lineWidthOne
 * @param {*} lineFontSize
 */
function lineBlank(link, lineTxtColorOne, lineWidthOne, lineFontSize) {
  link.lineStyle.color = lineTxtColorOne
  link.lineStyle.width = lineWidthOne
  link.label.color = lineTxtColorOne
  link.label.fontSize = lineFontSize
  link.lineStyle.opacity = 1
}

function changeTheData(data) {
  var dataSet = pathDataChange(data, true)
  var tmp = [] // 避免后端生成的节点无序

  var stateObj = {}
  for (var i = 0; i < data.nodes.length; i++) {
    var t = data.nodes[i]
    if (!t.nodeName || t.nodeName === 'N/A') {
      t.nodeName = t.windId
    }
    if (dataSet.nodeObj[t.windId]) {
      tmp.push(dataSet.nodeObj[t.windId])
    }

    // if (CompanyChart.chartOnly) {
    //   if (t.windId == CompanyChart.urlParams.leftCompany) {
    //     CompanyChart.leftParams = t.windId
    //   } else if (t.windId == CompanyChart.urlParams.rightCompany) {
    //     CompanyChart.rightParams = t.windId
    //   }
    // }

    // 兼容后端bug
    var state = ''
    if (t.status) {
      state = t.status
    } else if (t.props && t.props.status) {
      state = t.props.status
    }

    if (t.nodeType === 'company') {
      if (stateObj[state]) {
        if (!stateObj[state][t.windId]) {
          stateObj[state][t.windId] = t
        }
      } else {
        stateObj[state] = {}
        stateObj[state][t.windId] = t
      }
    }
  }

  dataSet.stateObj = stateObj
  dataSet.nodes = tmp
  var pathSet = pathChange(data.paths)

  return { pathSet: pathSet, dataSet: dataSet }
}

/**
 * 生成路径上文本
 * @param {*} link
 * @param {*} t
 * @param {*} allColorsObj
 * @param {*} label
 */
function makeLinks(link, t, allColorsObj, label) {
  var propObj = link.props ? link.props[t + '_props'] : null
  var prop = ''
  var _label = ''

  if (allColorsObj[t]) {
    prop = allColorsObj[t].props ? propObj[allColorsObj[t].props] : ''
    var showprop = propObj && propObj.rate ? ' ' + wftCommon.formatPercent(propObj.rate) : ''
    _label = allColorsObj[t].txt + showprop
  }

  if (t === 'member' || t === 'relativeperson') {
    _label = prop
  }
  if (t === 'merge') {
    _label = link.props.merge_props ? link.props.merge_props.mergerTitle : intl('108785', '并购')
  }
  if (t === 'customer') {
    if (link.props && link.props.customer_props && link.props.customer_props.reportPeriod) {
      _label = link.props.customer_props
        ? '客户：报告期 ' +
          wftCommon.formatTime(link.props.customer_props.reportPeriod) +
          ', 比例 ' +
          link.props.customer_props.rate
        : intl('28717', '客户')
    } else if (link.props && link.props.customer_props && link.props.customer_props.reportPeriodBid) {
      _label = link.props.customer_props
        ? '客户：招投标公告日期 ' + wftCommon.formatTime(link.props.customer_props.reportPeriodBid)
        : intl('28717', '客户')
    } else {
      _label = intl('28717', '客户')
    }
  }

  if (t === 'supplier') {
    if (link.props && link.props.supplier_props && link.props.supplier_props.reportPeriod) {
      _label = link.props.supplier_props
        ? '供应商：报告期 ' +
          wftCommon.formatTime(link.props.supplier_props.reportPeriod) +
          ', 比例 ' +
          link.props.supplier_props.rate
        : intl('108764', '供应商')
    } else if (link.props && link.props.supplier_props && link.props.supplier_props.reportPeriodBid) {
      _label = link.props.supplier_props
        ? '供应商：招投标公告日期 ' + wftCommon.formatTime(link.props.supplier_props.reportPeriodBid)
        : intl('108764', '供应商')
    } else {
      _label = intl('108764', '供应商')
    }
  }

  var bidStr = ''
  var bidContent = ''
  if (t === 'bid') {
    var ps = link.props.bid_props || {}
    var psStr = ''
    if (ps.bidTime) {
      psStr = '中标时间：' + ps.bidTime
      bidStr = psStr
    }
    if (ps.bidContent) {
      bidStr += ' 中标物：' + ps.bidContent
      psStr += ' 中标物：' + ps.bidContent
      bidContent = ps.bidContent
    }
    _label = psStr
  }

  if (t === 'guarantee') {
    var tprops = link.props.guarantee_props
    if (tprops) {
      var method = tprops.granMethod || ''
      method = method ? method + ', ' : ''
      var unit = tprops.currency || ''
      var amount = tprops.amount || ''
      amount = amount ? wftCommon.formatMoney(amount) + unit + ', ' : ''
      var time = wftCommon.formatTime(tprops.transactionDate) || '',
        tprops = method + amount + time
    }
    _label = tprops ? '担保(' + tprops + ')' : intl('27494', '担保')
  }

  if (t === 'classmate') {
    var tprops = link.props.classmate_props
    if (tprops) {
      var schoolName = tprops.schoolName || ''
      var schoolYear = tprops.year || ''
      var schoolClass = tprops.class || ''
      tprops = schoolName ? schoolName + '-' : ''
      tprops += schoolYear + schoolClass
    }
    _label = tprops ? tprops : window.en_access_config ? 'classmate' : '同学'
  }

  if (label) {
    return _label ? label + ', ' + _label : label
  } else {
    return _label || ''
  }
}

/**
 *
 * @param {*} multi, 是否多对一触达类型
 */
function GraphChartComp({
  multi = false,
  sourceNodes,
  targetNodes,
  relativeTypes,
  waterMask = true,
  saveImgName = '关联关系图',
  forceUpdate,
}) {
  const domRef = useRef(null)

  var keyNames = {} // 节点名称集合
  var nodeMaps = {}
  var objs = { Nodes: [], Links: [] } // 数据结构转换
  var nodes = []
  var links = []
  var levels = []
  var nodeLinks = {}
  var paths = []
  let isDoubelClickLock = false // 双击事件与单击事件区分锁
  let isMouseUpLock = false // 拖动锁

  var lineSelColor = '#2277a2' // 路径高亮颜色
  var lineSelFontSize = '16' // 路径高亮后文本字体
  var lineSelWidth = 2 // 路劲高亮后线粗细宽度

  var lineTxtColorOne = '#999' // 初始路径文本颜色
  var lineFontSize = '12' // 初始路径文本字体
  var lineWidthOne = 1 // 初始路径线粗细宽度
  var nodeTxtColorOne = '#333' // 节点文本字体颜色
  var nodeOpacityTwo = 0.2 // 透明节点透明度

  var leftNodeColor = '#906F54' // 棕色
  var leftNodeBorderColor = '#c7b7a9' // 棕色
  var rightNodeColor = '#2277A2' // 深蓝
  var rightNodeBoderColor = '#90bbd0' // 深蓝
  var targetNodeBoderWidth = 4

  var nodeColor = '#bcd6e3' // 普通节点颜色
  var nodeBorderColor = '#90bbd0'

  const leftId = sourceNodes?.id || null
  const rightId = targetNodes?.id || null
  const relative = relativeTypes || ''

  const [leftCompany, setLeftCompany] = useState(leftId)
  const [rightCompany, setReftCompany] = useState(rightId)
  const [relativeType, setRelativeType] = useState(relative)
  const [mapData, setMapData] = useState(null)
  const [loading, setLoaded] = useState(true)
  const [noFoundNodes, setNoFoundNodes] = useState([])
  const [moreFilter, setMoreFilter] = useState(false)

  useEffect(() => {
    if (leftId !== leftCompany) setLeftCompany(leftId)
    if (rightId !== rightCompany) setReftCompany(rightId)
    if (relative.length !== relativeType.length) setRelativeType(relative)
    CompanyChart.leftCompany = leftId
  }, [leftId, rightId, relative])

  const fetchDataSuccessFn = (res) => {
    !window.en_access_config && setLoaded(false)

    if (res?.ErrorCode == global.USE_FORBIDDEN) {
      // 无权限，需要弹出vip付费弹框
      setMapData(null)
      setLoaded(false)
      VipPopup()
    } else if (res?.ErrorCode == global.USE_OUT_LIMIT || res?.ErrorCode == global.VIP_OUT_LIMIT) {
      // 使用超限，已在axios层处理
      setMapData(null)
      setLoaded(false)
    } else if (res?.ErrorCode == '0') {
      if (res?.data && res.data?.paths?.length) {
        if (window.en_access_config) {
          var tmpNodes = []
          var tmpNodesObj = {}
          res.data.nodes.map(function (t) {
            tmpNodes.push(t)
          })
          wftCommon.zh2en(
            res.data.nodes,
            (endata) => {
              endata.map(function (t, idx) {
                endata[idx].windId = tmpNodes[idx].windId
                tmpNodesObj[tmpNodes[idx].windId] = endata[idx]
                if (!t.level) {
                  t.level = 0
                } else {
                  t.level = t.level - 0
                }
              })
              res.data.nodes = endata
              tmpNodes = endata

              res.data.paths.map(function (t) {
                t.nodes.map(function (tt) {
                  tt.nodeName = tmpNodesObj[tt.windId].nodeName
                })
              })
              setLoaded(false)
              setMapData(res.data)
            },
            null,
            () => {
              setLoaded(false)
              setMapData(res.data)
            }
          )
        } else {
          setMapData(res.data)
        }
      } else {
        setLoaded(false)
        setMapData(null)
      }
    } else {
      setLoaded(false)
      setMapData(null)
    }
  }

  const getMultiMapData = (type) => {
    getrelationpathmulti({
      startKeywords: leftCompany,
      endKeyword: rightCompany,
      relativeType: relativeType || '',
      limit: 10,
      type: type ? type : 1,
      expoVer: 0,
    }).then(fetchDataSuccessFn, () => {
      setLoaded(false)
      setMapData(null)
    })
  }

  const getSingleData = () => {
    setLoaded(true)
    getrelationpath({
      startKeyword: leftCompany,
      endKeyword: rightCompany,
      startNodeLabel: 'company',
      endNodeLabel: 'company',
      historyInfo: [
        {
          companyName: sourceNodes?.name,
          companyCode: leftCompany,
        },
        {
          companyName: targetNodes?.name,
          companyCode: rightCompany,
        },
      ],
      relativeType: relativeType || '',
      expoVer: 0,
    }).then(fetchDataSuccessFn, () => {
      setLoaded(false)
      setMapData(null)
    })
  }

  const getMapData = multi ? getMultiMapData : getSingleData

  useEffect(() => {
    CompanyChart.leftParams = leftCompany
    CompanyChart.rightParams = rightCompany
    debounceFetchData(getMapData)
    setMoreFilter(false)
  }, [leftCompany, rightCompany, relativeType, forceUpdate])

  useEffect(() => {
    if (mapData && mapData.paths?.length) {
      changeTheData(mapData)
    } else {
      return
    }

    var ids = sourceNodes.id.split(',')
    var foundNames = []
    var notFound = []
    for (var i = 0; i < mapData.nodes.length; i++) {
      var item = mapData.nodes[i]
      if (ids.indexOf(item.windId) > -1) {
        foundNames.push(ids.indexOf(item.windId))
      }
      var t = {
        Category: item.nodeType == 'company' ? 0 : 2,
        KeyNo: item.windId,
        Level: item.level,
        Name: item.nodeName || item.windId,
        nodeType: item.nodeType,
        _nodeid: item.nodeId,
        obj: {
          properties: {
            KeyNo: item.windId,
            name: item.nodeName || item.windId,
            id: item.windId,
          },
        },
      }
      objs.Nodes.push(t)
      if (!keyNames[item.windId]) {
        keyNames[item.windId] = item.nodeName || item.windId
      }
    }
    if (multi) {
      // 多对一触达才需要找未匹配节点
      sourceNodes.name.map((t, idx) => {
        if (foundNames.indexOf(idx) == -1) {
          notFound.push(t)
        }
      })
      setNoFoundNodes(notFound)
    }

    for (var i = 0; i < mapData.routes.length; i++) {
      var link = mapData.routes[i]
      if (!link.startId) {
        var t = {
          Relation: 'N/A',
          Source: keyNames[link.startId] || 'left',
          Target: keyNames[link.endId] || 'right',
          relId: link.relId,
          _props: 'N/A',
          _sourceId: link.startId,
          _targetId: link.endId,
          // _realProps: bidStr ? bidStr : '',
          // _bidCon: bidContent ? bidContent : '',
        }
        objs.Links.push(t)
        continue
      }
      var type = link.relType?.split('|')
      var label = ''
      if (type.length) {
        for (var _i = 0; _i < type.length; _i++) {
          label = makeLinks(link, type[_i], allColorsObj, label)
        }
      }
      if (label == '高管') {
        label = intl('64504')
      } else if (label == '法人') {
        label = intl('138733')
      } else if (label == '同学') {
        label = window.en_access_config ? 'classmate' : '同学'
      } else if (label == '经理') {
        label = window.en_access_config ? 'manage' : '经理'
      } else if (label == '董事长') {
        label = window.en_access_config ? 'chairman' : '董事长'
      } else if (/^[\u4e00-\u9fa5]/.test(label)) {
        label = window.en_access_config ? '' : label
      }
      var t = {
        Relation: label ? [label] : '',
        Source: keyNames[link.startId] || 'left',
        Target: keyNames[link.endId] || 'right',
        relId: link.relId,
        _props: link.props,
        _sourceId: link.startId,
        _targetId: link.endId,
        // _realProps: bidStr ? bidStr : '',
        // _bidCon: bidContent ? bidContent : '',
      }
      objs.Links.push(t)
    }

    objs.Nodes.map(function (node, i) {
      if (node.Category == 0 && (leftId.indexOf(node.KeyNo) > -1 || rightId.indexOf(node.KeyNo) > -1)) {
        // 目标企业
        nodes.push({
          name: node.Name,
          keyNo: node.KeyNo,
          nodeType: node.nodeType,
          level: node.Level,
          label: {
            txt: window.en_access_config
              ? node.Name.replace(/(.{12})(?=.)/g, '$1\n')
              : node.Name.replace(/(.{4})(?=.)/g, '$1\n'),
            color: '#fff',
            fontSize: 14,
          },
          symbol: 'circle',
          symbolSize: window.en_access_config ? [140, 140] : [90, 90],
          itemStyle: {
            normal: {
              color: leftId.indexOf(node.KeyNo) > -1 ? leftNodeColor : rightNodeColor,
              borderWidth: targetNodeBoderWidth,
              borderColor: leftId.indexOf(node.KeyNo) > -1 ? leftNodeBorderColor : rightNodeBoderColor,
              label: {
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontFamily: '微软雅黑',
                  fontSize: 14,
                  fontStyle: 'normal',
                },
              },
            },
          },
          _type: 2,
        })
      } else {
        // 普通企业
        nodes.push({
          name: node.Name,
          keyNo: node.KeyNo,
          nodeType: node.nodeType,
          level: node.Level,
          fixed: true,
          label: {
            txt: window.en_access_config
              ? node.Name.replace(/(.{12})(?=.)/g, '$1\n')
              : node.Name.replace(/(.{4})(?=.)/g, '$1\n'),
            color: nodeTxtColorOne,
            fontSize: 13,
            opacity: 1,
          },
          symbol: 'circle',
          symbolSize: window.en_access_config ? [120, 120] : [72, 72],
          itemStyle: {
            normal: {
              color: nodeColor,
              borderWidth: '2',
              borderColor: nodeBorderColor,
              opacity: 1,
            },
          },
          _itemStyleHigh: {
            normal: {
              color: nodeColor,
              borderWidth: 2,
              borderColor: nodeBorderColor,
              label: {
                position: 'inside',
                textStyle: {
                  color: '#555',
                  fontFamily: '微软雅黑',
                  fontSize: 13,
                  fontStyle: 'normal',
                },
              },
            },
          },
          // white 表示当前需要展示的是高亮路径之外的节点样式
          _itemStyleWhite: {
            normal: {
              color: '#e8f1f6',
              borderWidth: '2',
              borderColor: '#e8f1f6',
              opacity: nodeOpacityTwo,
            },
          },
          _type: 4,
        })
      }
    })

    objs.Links.map(function (link, i) {
      for (var j = 0; j < links.length; j++) {
        if (links[j].source == link.Source && links[j].target == link.Target) {
          links[j].name += ',' + link.Relation
          links[j].itemStyle.normal.text = links[j].name
          return
        }
        if (links[j].source == link.Target && links[j].target == link.Source) {
          // 两条双向的线
          link.curveness = 0.2 + (links[j].curveness ? links[j].curveness : 0)
          links[j].lineStyle = { curveness: 0.2 + (links[j].curveness ? links[j].curveness : 0) }
        }
      }

      //将radio的值填充
      var radioNameArr = []
      var radioName = ''
      var showNameArr = []
      var showName = ''
      var spanItem = link.Relation ? link.Relation[0].split(', ') : []
      for (var ti = 0; ti < spanItem.length; ti++) {
        var nameText = spanItem[ti].split(' ')
        if (nameText.length == 2) {
          radioNameArr.push(nameText[1])
          showNameArr.push(nameText[0])
        } else {
          radioNameArr.push('0')
          showNameArr.push(nameText[0])
        }
      }
      radioName = radioNameArr.join(', ')
      showName = showNameArr.join(', ')
      links.push({
        relId: link.relId,
        source: link.Source,
        target: link.Target,
        name: link.Relation ? link.Relation.join('') : '',
        weight: 1,
        _bidCon: link._bidCon,
        _realProps: link._realProps,
        _props: link._props,
        _sourceId: link._sourceId,
        _targetId: link._targetId,
        lineStyle: {
          color: lineTxtColorOne,
          opacity: 1, // 为0时，link不展示，包括上面的label
          width: lineWidthOne,
        },
        label: {
          color: lineTxtColorOne,
          fontSize: lineFontSize,
        },
        lineStyle: link.curveness
          ? {
              curveness: link.curveness,
            }
          : {},
      })
    })

    nodes.map(function (node, idx) {
      if (!nodeLinks[node.keyNo]) {
        nodeLinks[node.keyNo] = []
      }

      if (!nodeMaps[node.keyNo]) {
        nodeMaps[node.keyNo] = node
      }

      for (var i = 0; i < links.length; i++) {
        var t = links[i]
        if (nodeLinks[node.keyNo].indexOf(t) < 0) {
          if (t.source == node.name || t.target == node.name) {
            nodeLinks[node.keyNo].push(t)
          }
        }
      }
    })

    var rootPath = mapData.paths
    rootPath = rootPath.sort(function (a, b) {
      return a.routes.length - b.routes.length
    })

    paths = calPathNew(nodeMaps, rootPath)
    CompanyChart.allPaths = paths
    filterNodes(nodes, paths)
    calcPos(nodes, paths, domRef.current.clientWidth * 0.98, domRef.current.clientHeight)
    createChart()
  }, [mapData])

  const createChart = () => {
    if (!nodes.length) return

    nodes.map((t, idx) => {
      t.draggable = true
    })

    var legendData = []
    var legendSelected = {}
    for (var i = 0; i < paths.length; i++) {
      legendData.push(intl('138431', '路径') + (i + 1))
      legendSelected[intl('138431', '路径') + (i + 1)] = false
    }
    const options = {
      title: {
        // text: 'wind',
      },
      tooltip: {
        show: false,
      },
      // animationDurationUpdate: 1500,
      // animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: 'chart_cgx',
          type: 'graph',
          layout: 'none',
          roam: 'move',
          label: {
            show: true, // 节点上的文本
            formatter: (params) => {
              return params.data?.label?.txt
            },
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [1, 10],
          edgeLabel: {
            // 线上文本
            fontSize: 12,
            color: 'red',
            show: true,
            formatter: (params) => {
              return params.data.name.replace(/(.{22})(?=.)/g, '$1\n')
            },
            positon: 'inside',
          },
          symbol: 'circle',
          symbolSize: [90, 90], // 这里可以设置一个默认的节点大小，差异性的节点大小通过各自做处理
          cursor: 'pointer',
          nodes: nodes,
          links: links,
        },
      ],
    }
    const chart = echarts.init(domRef.current)
    chart.setOption(options)

    chart.on('dblclick', { dataType: 'node' }, (params) => {
      if (isDoubelClickLock) {
        clearTimeout(isDoubelClickLock)
        isDoubelClickLock = false
      }
    })

    chart.on('click', { seriesName: 'chart_cgx' }, (params) => {
      isMouseUpLock = true
      if (params?.componentType === 'series') {
        if (params?.data) {
          // 内容区域的点击
        } else {
          // 空白区域点击
          nodes.map((t) => {
            nodeNotHigh(t)
          })
          links.map((t) => {
            lineBlank(t, lineTxtColorOne, lineWidthOne, lineFontSize)
          })
          chart.setOption(options)
        }
      }
    })

    chart.on('click', { dataType: 'node' }, (params) => {
      try {
        params.event.event.stopPropagation()
      } catch (e) {}
      if (isDoubelClickLock) {
        clearTimeout(isDoubelClickLock)
        isDoubelClickLock = false
        return
      }
      isDoubelClickLock = setTimeout(() => {
        isDoubelClickLock = false
        // 单击事件逻辑处理 延迟200ms

        var id = params?.data?.keyNo
        if (!id) return false
        var secondClickNodeId = null // 记录此前已经高亮的节点
        if (id == CompanyChart.leftParams || id == CompanyChart.rightParams || leftId.indexOf(id) > -1) return // 左右目标节点 不高亮

        // CompanyChart.currentClick = CompanyChart.currentClick || []
        CompanyChart.currentClick = []

        // 如果已经高亮的 先去除
        if (CompanyChart.currentClick[id]) {
          secondClickNodeId = id
          delete CompanyChart.currentClick[id]
        }

        var arr = [] // 计算需要高亮的路径集合
        if (secondClickNodeId == id) {
          // 当期点击动作是取消已经高亮的节点
          for (var k in CompanyChart.allPathObj) {
            if (Object.keys(CompanyChart.currentClick).length) {
              var needHighLight = true // 当前高亮节点是否经过当前路径，初始设置为 true
              for (var ck in CompanyChart.currentClick) {
                if (k.indexOf(ck) < 0) {
                  // 只要有一个节点不在当前路径 说明当前路径未命中所有高亮节点 则不高亮当前路径
                  needHighLight = false
                }
              }
              if (needHighLight) {
                arr.push(CompanyChart.allPathObj[k]._idx)
              }
            }
          }
        } else {
          for (var k in CompanyChart.allPathObj) {
            if (Object.keys(CompanyChart.currentClick).length) {
              // 当前已有高亮的节点 则判断路径上是否同时存在当前节点和已经高亮的节点，是则选中
              if (k.indexOf(id) > -1) {
                var needHighLight = true // 当前高亮节点是否经过当前路径，初始设置为 true
                for (var ck in CompanyChart.currentClick) {
                  if (k.indexOf(ck) < 0) {
                    // 只要有一个节点不在当前路径 说明当前路径未命中所有高亮节点 则不高亮当前路径
                    needHighLight = false
                  }
                }
                if (needHighLight) {
                  arr.push(CompanyChart.allPathObj[k]._idx)
                }
              }
            } else {
              if (k.indexOf(id) > -1) {
                arr.push(CompanyChart.allPathObj[k]._idx)
              }
            }
          }
        }

        var curNode = [] // 需要高亮处理的点集
        // arr：需要高亮的路径编号(idx)集合
        if (arr && arr.length) {
          // 1 清空样式 找出需要高亮和取消高亮的节点
          for (var i = 0; i < nodes.length; i++) {
            if (secondClickNodeId) {
              // 如果此前点击的节点已经高亮，则此处用 currentClick 来匹配该次需要高亮的节点
              if (CompanyChart.currentClick[nodes[i].keyNo]) {
                curNode.push(nodes[i])
              }
              if (secondClickNodeId == nodes[i].keyNo) {
                secondClickNodeId = nodes[i]
              }
            } else {
              // 如果当前点击不是此前已经高亮的节点 则将当前点击节点记录高亮
              if (nodes[i].keyNo == id) {
                curNode.push(nodes[i])
              }
            }
            nodeBlank(nodes[i], nodeOpacityTwo) // 节点样式先置为虚拟白圈
          }
          // 2 把需要取消高亮的节点先取消高亮
          if (!secondClickNodeId) {
            // 当前点击的节点此前没高亮，则记录到 currentClick
            CompanyChart.currentClick[id] = id
          } else {
            // 否则，将当前节点背景还原
            nodeBlank(secondClickNodeId, nodeOpacityTwo)
          }
          // 3 关系还原
          for (var i = 0; i < links.length; i++) {
            lineHide(links[i], lineTxtColorOne, lineTxtColorOne)
          }
          // 4 需要高亮的节点执行高亮动作，以及关系高亮动作
          if (curNode && curNode.length) {
            // 高亮节点
            curNode.forEach(function (tt) {
              nodeHigh(tt)
              tt.itemStyle.normal.borderWidth = tt.itemStyle.normal.borderWidth + 2
            })
            arr.forEach(function (t, idx) {
              t = t - 0
              var path = paths[t - 0]
              for (var i = 0; i < path.length - 1; i++) {
                var node1 = path[i]
                var node2 = path[i + 1]

                nodeHigh(node1)
                nodeHigh(node2)

                for (var j = 0; j < links.length; j++) {
                  if (
                    (links[j].source == node1.name && links[j].target == node2.name) ||
                    (links[j].source == node2.name && links[j].target == node1.name)
                  ) {
                    lineHigh(links[j], lineSelColor, lineSelWidth, lineSelColor, lineSelFontSize)
                  }
                }
              }
            })
          }
        } else {
          // 1 找出需要高亮的节点和取消高亮的节点
          for (var i = 0; i < nodes.length; i++) {
            if (secondClickNodeId) {
              // 如果此前点击的节点已经高亮，则此处用 currentClick 来匹配该次需要高亮的节点
              if (CompanyChart.currentClick[nodes[i].keyNo]) {
                curNode.push(nodes[i])
              }
              if (secondClickNodeId == nodes[i].keyNo) {
                secondClickNodeId = nodes[i]
              }
            } else {
              // 如果当前点击不是此前已经高亮的节点 则将当前点击节点记录高亮
              if (nodes[i].keyNo == id) {
                curNode.push(nodes[i])
              }
            }
            nodeNotHigh(nodes[i])
          }
          // 2 把需要取消高亮的节点先取消高亮
          if (!secondClickNodeId) {
            // 当前点击的节点此前没高亮，则记录到 currentClick
            CompanyChart.currentClick[id] = id
          } else {
            // 否则，将当前节点背景还原
            nodeNotHigh(secondClickNodeId)
          }
          // 3 高亮需要高亮的节点
          if (curNode && curNode.length) {
            // 高亮节点
            curNode.forEach(function (tt) {
              nodeHigh(tt)
            })
          }
          // 4 还原关系
          for (var i = 0; i < links.length; i++) {
            lineBlank(links[i], lineTxtColorOne, lineWidthOne, lineFontSize)
          }
        }
        // 该方法会有轻微偏移，暂未找到更好方案
        const ponitInPixel = [params.event.offsetX, params.event.offsetY]
        const pixel = chart.convertFromPixel({ seriesIndex: params.seriesIndex }, ponitInPixel)
        nodes[params.dataIndex].x = pixel[0]
        nodes[params.dataIndex].y = pixel[1]

        chart.setOption(options)
      }, 200)
    })
    chart.on('click', { dataType: 'edge' }, (params) => {
      try {
        params.event.event.stopPropagation()
      } catch (e) {}
    })

    const domResizeAction = () => {
      chart && chart.resize()
    }
    const domClickAction = (e) => {
      setTimeout(() => {
        if (isMouseUpLock) {
          nodes.map((t) => {
            nodeNotHigh(t)
          })
          links.map((t) => {
            lineBlank(t, lineTxtColorOne, lineWidthOne, lineFontSize)
          })
          chart.setOption(options)
        }
        isMouseUpLock = false
      }, 100)
    }
    window.addEventListener('resize', domResizeAction)
    document.addEventListener('click', domClickAction)
    return () => {
      chart.dispose()
    }
  }

  const saveAction = () => {
    if (!multi) {
      // 查关系 保存图片
      pointBuriedByModule(922602100992)
      pointBuriedByModule(922602100341)
    } else {
      pointBuriedByModule(922602101007)
    }
    var canvas = domRef.current.querySelector('canvas')
    var imgdata = canvas.toDataURL()
    var shuiying = new Image()
    var name = saveImgName || '全球企业库'
    var originalImage = null // 目标img
    shuiying.src = sy2
    if (waterMask) {
      shuiying.width = 200
      shuiying.height = 200
    } else {
      shuiying.width = 0
      shuiying.height = 0
    }
    originalImage = new Image()
    originalImage.src = imgdata

    originalImage.onload = function (e) {
      var canvas = document.createElement('canvas') //准备空画布
      canvas.width = originalImage.width
      canvas.height = originalImage.height
      var context = canvas.getContext('2d') //取得画布的2d绘图上下文
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(originalImage, 0, 0)
      setTimeout(function () {
        var wlen = canvas.width / 8
        var hlen = canvas.height / 8
        wlen = wlen < 238 ? 238 : wlen
        hlen = hlen < 238 ? 238 : hlen
        for (var x = 10; x < canvas.width; x += wlen) {
          for (var y = 10; y < canvas.height; y += hlen) {
            context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
          }
        }
        var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!'
        context.font = '14px 微软雅黑'
        context.fillStyle = '#aaaaaa'
        context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)
        downloadimg(name, canvas)
      })
    }
  }
  const refreshAction = () => {
    getMapData()
  }

  return (
    <div className="chart-graph-box">
      {!loading ? (
        !mapData ? null : (
          <div className="chart-graph-nav">
            {multi ? (
              <div className="chart-graph-nav-more">
                <Checkbox
                  checked={moreFilter}
                  onChange={() => {
                    const checked = !moreFilter
                    setMoreFilter(checked)
                    getMapData(checked ? 3 : 1)
                  }}
                  data-uc-id="25aG_VMJvQ"
                  data-uc-ct="checkbox"
                >
                  <span>{window.en_access_config ? 'More' : '探索更多路径'}</span>
                </Checkbox>
              </div>
            ) : null}
            <div className="chart-graph-icons">
              <SaveO onClick={saveAction} data-uc-id="iM53NVxiPh" data-uc-ct="saveo" />
              <RefreshO onClick={refreshAction} data-uc-id="Nd8zuEIoL" data-uc-ct="refresho" />
            </div>
          </div>
        )
      ) : null}
      {!loading ? (
        !mapData ? (
          <div className="chart-graph-empty">{intl('138403', '暂无关联路径数据')} </div>
        ) : (
          <>
            <div ref={domRef} style={{ width: '100%', height: '100%' }} className="chart-graph-cgx"></div>
            {noFoundNodes.length ? (
              <div className="chart-graph-nofound">
                {noFoundNodes.map((t, idx) => {
                  return (
                    <span>
                      {idx ? '、' : ''}
                      {t}
                    </span>
                  )
                })}
                {noFoundNodes.length > 1 ? noFoundNodes.length + (' ' + intl('138213', '家企业')) : ''}{' '}
                {intl('437676', '未找到最短路径')}
              </div>
            ) : null}
            <div className="chart-graph-bottom">
              {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
            </div>
          </>
        )
      ) : (
        <Spin className="chart-graph-loading" tip="Loading..."></Spin>
      )}
    </div>
  )
}

export default GraphChartComp
