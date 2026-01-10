import React, { useEffect, useRef, useState } from 'react'
import { Button, message, Spin, Radio } from '@wind/wind-ui'
import { FileTextO, RefreshO, SaveO } from '@wind/icons'
import * as d3 from 'd3'
import { myWfcAjax } from '../../api/common'
import './RelateChart.less'
import { parseQueryString } from '../../lib/utils'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import Empty from '../../components/charts/empty'
import ChartCard from '../Chart/ChartCard'
import * as globalActions from '../../actions/global'
import global from '../../lib/global'
import store from '../../store/store'
import sy2 from '../../assets/imgs/chart/sy2.png'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { linkToCompany, exportRelateChart } from './handle'

// 上交所
const RelateType_02 = {
  1: intl('358514', '母公司/控股股东'),
  2: intl('478667', '控股股东'),
  3: intl('358515', '直接或间接持股5%及以上的自然人'),
  4: intl('358516', '直接或间接持股5%及以上的企业'),
  5: intl('286077', '董监高'),
  6: intl('358497', '子公司|控股企业'),
  7: intl('358517', '母公司的控股企业'),
  8: intl('358518', '母公司的董监高'),
  9: intl('358498', '控股股东的控股企业'),
  10: intl('358499', '直接或间接持股5%及以上的自然人的任职企业'),
  11: intl('358519', '直接或间接持股5%及以上的自然人的控股企业'),
  12: intl('358520', '董监高的任职企业'),
  13: intl('358521', '董监高的控股企业'),
  14: intl('358500', '持股10%及以上的自然人'),
  15: intl('358522', '持股10%及以上的企业'),
  16: intl('358523', '母公司的董监高的控股企业'),
  17: intl('358524', '母公司的董监高的任职企业'),
}

// 2,3,5,8,14 - 人物  深交所
const RelateType_03 = {
  1: intl('358514', '母公司/控股股东'),
  2: intl('478667', '控股股东'),
  3: intl('358515', '直接或间接持股5%及以上的自然人'),
  4: intl('358516', '直接或间接持股5%及以上的企业'),
  5: intl('286077', '董监高'),
  6: intl('358497', '子公司|控股企业'),
  7: intl('358517', '母公司的控股企业'),
  8: intl('358518', '母公司的董监高'),
  9: intl('358498', '控股股东的控股企业'),
  10: intl('358499', '直接或间接持股5%及以上的自然人的任职企业'),
  11: intl('358519', '直接或间接持股5%及以上的自然人的控股企业'),
  12: intl('358520', '董监高的任职企业'),
  13: intl('358521', '董监高的控股企业'),
  16: intl('358523', '母公司的董监高的控股企业'),
  17: intl('358524', '母公司的董监高的任职企业'),
}

// 会计准则
const RelateType_04 = {
  1: intl('358514', '母公司/控股股东'),
  2: intl('478667', '控股股东'),
  3: intl('358501', '直接或间接持股20%及以上的自然人'),
  4: intl('358525', '直接或间接持股20%及以上的企业'),
  5: intl('286077', '董监高'),
  6: intl('358497', '子公司|控股企业'),
  7: intl('358517', '母公司的控股企业'),
  8: intl('358518', '母公司的董监高'),
  9: intl('358498', '控股股东的控股企业'),
  11: intl('358519', '直接或间接持股20%及以上的自然人的控股企业'),
  13: intl('358521', '董监高的控股企业'),
  16: intl('358523', '母公司的董监高的控股企业'),
}

// 银行
const RelateType_05 = {
  1: intl('358514', '母公司/控股股东'),
  2: intl('478667', '控股股东'),
  3: intl('358527', '实控人及持股5%及以上的自然人'),
  4: intl('358502', '实控人及持股5%以上法人股东'),
  5: intl('286077', '董监高'),
  6: intl('358497', '子公司|控股企业'),
  7: intl('358517', '母公司的控股企业'),
  8: intl('358518', '母公司的董监高'),
  9: intl('358498', '控股股东的控股企业'),
  10: intl('358499', '直接或间接持股5%及以上的自然人的任职企业'),
  11: intl('358519', '直接或间接持股5%及以上的自然人的控股企业'),
  12: intl('358520', '董监高的任职企业'),
  13: intl('358521', '董监高的控股企业'),
  14: intl('358500', '持股10%及以上的自然人'),
  15: intl('358522', '持股10%及以上的企业'),
  16: intl('358523', '母公司的董监高的控股企业'),
  17: intl('358524', '母公司的董监高的任职企业'),
  18: intl('358528', '实控人及持股5%以上法人股东的控股企业'),
  19: intl('358529', '实控人及持股5%以上法人股东的实控人及持股50%以上法人股东'),
  20: intl('358530', '实控人及持股5%以上法人股东的实控人及持股50%以上自然人股东'),
}

function resetName(data, nameObj) {
  if (!data || !data.length) return
  var len = data.length
  for (var i = 0; i < len; i++) {
    var t = data[i]

    if (!t.collection || !t.collection.length) {
      data.splice(i, 1)
      i--
      len--
    } else {
      if (nameObj[t.type]) {
        t.name = nameObj[t.type]
        t._type = t.type - 0
      }
      if (t.children && t.children.length) {
        resetName(t.children, nameObj)
      }
    }
  }
}

const CompanyChart = {}

function RelateChart({ companycode, companyname, watermask = true, bottom = false }) {
  const [loading, setLoaded] = useState(true)
  const domRef = useRef(null)
  const qsParam = parseQueryString()
  let code = companycode || qsParam['companycode']
  const disableExportExcel = qsParam.disableExportExcel ? true : false
  const rootScale = qsParam.scale && qsParam.scale !== 'undefined' ? qsParam.scale - 0 : 1 // 参数中支持带入scale
  const waterMask = qsParam.nowatermask ? false : watermask
  const linksource = qsParam.linksource || ''
  const linkSourceRIME = linksource === 'rime' ? true : false
  const linkSourceF9 = linksource === 'f9' ? true : false
  const primary_color = linkSourceRIME ? global.THEME_RIME.primary_color : '#00aec7'
  if (code && code.length > 10) {
    code = code.substr(2, 10)
  }
  const [selType, setSelType] = useState(-1)
  const [companyName, setCorpName] = useState(companyname || '')
  const [isfinical, setIsfinical] = useState(false)
  const [relateTypeObj, setRelateTypeObj] = useState(null)
  const [data, setData] = useState(null)
  const companyCode = code

  useEffect(() => {
    if (linksource === 'pcai') {
      document.body.classList.add('pcai-mode')
    }
    return () => {
      document.body.classList.remove('pcai-mode')
    }
  }, [linksource])

  const glgxTypes = [
    {
      label: intl('358256', '企业会计准则'),
      val: 4,
    },
    {
      label: intl('358257', '上交所规则'),
      val: 2,
    },
    {
      label: intl('358236', '深交所规则'),
      val: 3,
    },
    {
      label: intl('358258', '银保监规则'),
      val: 5,
    },
  ]

  const ajaxParam = {
    companyCode: companyCode,
    refresh: selType,
  }

  const removeSvgChildDom = () => {
    if (document.querySelector('.relate-graph-content')) {
      if (document.querySelector('.glgxsvg')) {
        document.querySelector('.relate-graph-content').removeChild(document.querySelector('.glgxsvg'))
      }
    }
  }

  useEffect(() => {
    pointBuriedByModule(922602100891)
    myWfcAjax('detail/company/getcorpbasicname/' + companyCode, {}).then((res) => {
      if (res?.ErrorCode == '0' && res?.Data) {
        setCorpName(res.Data.companyName)
        setSelType(4)
        if (res.Data.is_financial == '1') {
          setIsfinical(true)
        } else {
          isfinical && setIsfinical(false)
        }
      }
    })
    if (selType > 0 && relateTypeObj) {
      freshChart()
    }
  }, [companyCode])

  useEffect(() => {
    if (selType < 0) return
    switch (selType) {
      case 3:
        setRelateTypeObj(RelateType_03)
        break
      case 4:
        setRelateTypeObj(RelateType_04)
        break
      case 5:
        setRelateTypeObj(RelateType_05)
        break
      default:
        setRelateTypeObj(RelateType_02)
        break
    }
  }, [selType])

  useEffect(() => {
    if (!relateTypeObj) return
    freshChart()
  }, [relateTypeObj])

  function chanGLF(data, tmpObj) {
    if (data.collection && data.collection.length) {
      data.collection.map(function (d) {
        if (d.windId && !tmpObj[d.windId]) {
          tmpObj[d.windId] = d.name
        }
      })
    }
    if (data.children && data.children.length) {
      data.children.map(function (d) {
        chanGLF(d, tmpObj)
      })
    }
  }

  const requestGLGX = (demoData2, corpNameObj) => {
    var instanceEle = document.querySelector('.relate-chart-instance')
    var initW = instanceEle?.clientWidth
      ? instanceEle?.clientWidth
      : document.documentElement.clientWidth || document.body.clientWidth
    var initH = instanceEle
      ? instanceEle.clientHeight - 2
      : (document.documentElement.clientHeight || document.body.clientHeight) - 44
    var svg = d3
      .select('.relate-graph-content')
      .append('svg')
      .attr('width', initW)
      .attr('height', initH)
      .attr('class', 'glgxsvg') // .attr("cursor", "move");
    var root = svg
      .append('g')
      .attr('class', 'gBox')
      .attr('transform', 'scale(' + rootScale + ')')
    var tree = d3.layout
      .tree()
      .nodeSize([280, 350])
      .separation(function (t, e) {
        return 1.2
      })

    var zooms = d3.behavior
      .zoom()
      .scaleExtent([1 - rootScale + 0.5, 1 - rootScale + 1.3])
      .on('zoom', zoomed)
    var zoom = zooms
    CompanyChart.zoom = zoom
    svg.call(zoom)
    svg.call(zoom).on('dblclick.zoom', null) // 去除鼠标双击放大效果

    function zoomed() {
      let scale = d3.event.scale ? d3.event.scale : rootScale
      scale = scale + rootScale - 1
      root.attr('transform', 'translate(' + d3.event.translate + ')scale(' + scale + ')')
    }

    var d = {
      default: {
        title: '关联方图谱',
        centerTextMax: window.en_access_config ? 27 : 13,
        centerWidth: 233,
        radius: 2,
        nodeSize: [290, 400],
        scaleRange: [0.3, 2.3],
        box: {},
        boxSetting: {
          width: 290,
          borderColor: '#ddd',
          top: {
            company: {
              height: 40,
              fontSize: 12,
              fontColor: '#000',
              subTitleFontSize: 12,
              subTitleFontColor: '#000',
              backgroundColor: '#e3e3e3',
              leftFontColor: '#333',
              leftFontSize: 12,
              rightFontColor: '#333',
              rightFontSize: 12,
            },
            person: {
              height: 40,
              fontSize: 12,
              fontColor: '#000',
              subTitleFontSize: 12,
              subTitleFontColor: '#000',
              backgroundColor: '#e3e3e3',
              leftFontColor: '#333',
              leftFontSize: 12,
              rightFontColor: '#333',
              rightFontSize: 12,
            },
          },
          item: {
            height: 40,
            fontSize: 12,
            fontColor: '#000',
            subTitleFontSize: 12,
            subTitleFontColor: '#000',
          },
          bottom: { height: 40, fontSize: 12, fontColor: '#000' },
        },
      },
    }

    demoData2.name = demoData2.collection[0].name
    demoData2.windId = demoData2.collection[0].windId

    resetName(demoData2.children, relateTypeObj)

    var upNew = {
      name: corpNameObj[demoData2.windId] ? corpNameObj[demoData2.windId] : demoData2.name || companyName,
      windId: demoData2.windId,
      depth: demoData2.depth,
      children: [],
    }
    var downNew = {
      name: corpNameObj[demoData2.windId] ? corpNameObj[demoData2.windId] : demoData2.name || companyName,
      windId: demoData2.windId,
      depth: demoData2.depth,
      children: [],
    }

    demoData2.children.forEach(function (t, idx) {
      if (t._type < 5) {
        upNew.children.push(t)
      } else {
        if (!downNew.children.length) {
          downNew.children.push(t)
        } else {
          if (t._type < downNew.children[downNew.children.length - 1]._type) {
            // 兼容后端没排序 导致 type5在type6后面
            downNew.children.splice(downNew.children.length - 1, 0, t)
          } else {
            downNew.children.push(t)
          }
        }
      }
    })
    demoData2.upNew = upNew
    demoData2.downNew = downNew

    var deptUp = []
    var deptDown = []
    upNew.children &&
      upNew.children.map(function (t, idx) {
        if (t.children && t.children.length) {
          t.children.map(function (d) {
            deptUp.push(d)
          })
        }
      })
    downNew.children &&
      downNew.children.map(function (t, idx) {
        if (t.children && t.children.length) {
          t.children.map(function (d) {
            deptDown.push(d)
          })
        }
      })
    demoData2.deptUp = deptUp
    demoData2.deptDown = deptDown

    var upLevelsInfo = []
    var downLevelsInfo = []

    var top = upNew
    var down = downNew
    var depthUp = deptUp
    var depthDown = deptDown
    var e = false

    var containerCenterH = initH / 2
    if (!top.children.length) {
      containerCenterH = '150'
    }
    if (!down.children.length) {
      containerCenterH = '600'
    }
    if (!down.children.length && !top.children.length) {
      return
    }
    var topContainer = root.append('g').attr('transform', 'translate(' + initW / 2 + ', ' + containerCenterH + ')')
    var downContainer = root.append('g').attr('transform', 'translate(' + initW / 2 + ', ' + containerCenterH + ')')
    var topLinksContainer = topContainer.append('g').classed('links', true)
    var topNodesContainer = topContainer.append('g').classed('nodes', true)
    var downLinksContainer = downContainer.append('g').classed('links', true)
    var downNodesContainer = downContainer.append('g').classed('nodes', true)
    top.children && top.children.length && updateTree(true, top)
    down.children && down.children.length && updateTree(false, down)

    function updateTree(t, e) {
      var n = t ? topNodesContainer : downNodesContainer,
        i = t ? topLinksContainer : downLinksContainer
      var o = e
      var s = tree(o)
      var descendants = s
      if (t) {
        descendants.forEach((ttt) => {
          ttt.y *= -1
        })
      } else {
        descendants.forEach((ttt) => {
          if (ttt.depth == 1) {
            ttt.y = ttt.y - 250
          } else if (ttt.depth) {
            ttt.y = ttt.y - ttt.depth * 120
          }
        })
      }
      var r = descendants
      r = initBoxSize(r)
      shortenLine(s, t)
      prepareNodes(r, t)
      var nn = tree.nodes(o)
      if (t) {
        nn = r
        nn.forEach((ttt) => {
          ttt.y *= -1
        })
      } else {
        nn.forEach((ttt) => {
          if (ttt.depth == 1) {
            ttt.y = ttt.y - 250
          } else if (ttt.depth) {
            ttt.y = ttt.y - ttt.depth * 120
          }
        })
      }
      var l = tree.links(nn)
      drawLinks(i, l, t)
      drawBoxes(n, r)
      drawItems(n, r)
      drawArrow(i, l, t)
    }

    function drawArrow(t) {
      var n = this,
        i = t.append('g').selectAll('g').data(e).enter().append('g')
      var a
      i.append('polygon')
        .attr('points', function (t) {
          var e,
            n,
            i = t.source.depth > t.target.depth ? t.source : t.target,
            o = 3,
            s = 10,
            r = null,
            l = null
          return (
            'IN' === t.target.data.Direction
              ? a
                ? ((l = i.y + i.position.height + 20), (r = i.x), (e = (l += 33) - s), (n = l - s))
                : ((l = i.y), (r = i.x), (e = (l -= 50) + s), (n = l + s))
              : 'OUT' === t.target.data.Direction &&
                (a
                  ? ((l = i.y + i.position.height + 20), (r = i.x), (e = (l -= 15) + s), (n = l + s))
                  : ((l = i.y), (r = i.x), (e = (l -= 5) - s), (n = l - s))),
            r + ',' + l + ' ' + (r - o) + ',' + e + ' ' + (r + o) + ',' + n
          )
        })
        .attr('fill', function (t) {
          return getArrowColor(t)
        })
        .attr('stroke-width', 0)
      i.append('rect')
        .attr('x', function (t) {
          return (t.source.depth > t.target.depth ? t.source : t.target).x - 2
        })
        .attr('y', function (t) {
          var e,
            n = t.source.depth > t.target.depth ? t.source : t.target
          return (
            a ? ((e = n.y + n.position.height + 20), (e -= 10)) : ((e = n.y), (e -= 40)),
            'IN' === t.target.data.Direction
              ? a
                ? ((e = n.y + n.position.height + 20), (e -= 5))
                : ((e = n.y), (e -= 35))
              : 'OUT' === t.target.data.Direction &&
                (a ? ((e = n.y + n.position.height + 20), (e += 7)) : ((e = n.y), (e -= 45))),
            e
          )
        })
        .attr('width', 3)
        .attr('height', 20)
        .attr('fill', 'white')
      i.append('text')
        .attr('x', function (t) {
          return (t.source.depth > t.target.depth ? t.source : t.target).x
        })
        .attr('y', function (t) {
          var e,
            n = t.source.depth > t.target.depth ? t.source : t.target
          return a ? ((e = n.y + n.position.height + 20), (e += 10)) : ((e = n.y), (e -= 30)), e
        })
        .attr('dx', -15)
        .attr('dy', function (t) {
          return 'IN' === t.target.data.Direction
            ? a
              ? 0
              : 10
            : 'OUT' === t.target.data.Direction
              ? a
                ? 10
                : 0
              : void 0
        })
        .attr('fill', function (t) {
          return getArrowColor(t)
        })
        .text(function (t) {
          return t.target.data.Operation
        })
    }

    function isPerson(t) {
      var ptype = [2, 3, 5, 8, 14]
      if (!t) return false
      if (t._type && ptype.indexOf(t._type) > -1) {
        return true
      }
      return false
    }

    function getArrowColor(t) {
      return '#128bed'
    }

    function calcColor(t) {
      var color = '#fff'
      var globalColors = ['#2277a2', '#E05D5D']
      if (t.type == 'item') {
        return color
      }
      if (t.type == 'bottom') {
        return '#f4f4f4'
      }
      if (t.node) {
        if (isPerson(t.node)) {
          // 人物
          color = globalColors[1]
        } else {
          color = globalColors[0]
        }
      }
      return color
    }

    function drawItems(t, e) {
      var a = this,
        i = this,
        o = initBoxItems(e),
        s = t.append('g').selectAll('g').data(o).enter().append('g')
      s.append('rect')
        .attr('stroke', d.default.boxSetting.borderColor)
        .attr('fill', function (t) {
          return calcColor(t)
        })
        .attr('cursor', 'move')
        .attr('border-radius', 0)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 1)
        .attr('fill-opacity', 0)
        .attr('width', function (t) {
          return d.default.boxSetting.width
        })
        .attr('height', d.default.boxSetting.item.height)
        .attr('fill-opacity', 1)
        .attr('x', function (t) {
          return t.x - t.box.position.width / 2
        })
        .attr('y', function (t) {
          return t.y
        })
        .attr('rx', d.default.radius)
        .attr('ry', 0)
        .attr('pointer-events', 'none')
      s.append('text')
        .attr('x', function (t) {
          return t.x - t.box.position.width / 2 + 15
        })
        .attr('y', function (t) {
          return t.y + 25
        })
        .attr('font-size', function (t) {
          var name = corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name
          if (name && name.length > 18) return 12
          return 'top' === t.type ? 14 : 'item' === t.type || 'bottom' === t.type ? 12 : void 0
        })
        .attr('class', (t) => {
          if ('bottom' === t.type) return 'tspan-extra'
          if ('top' === t.type) return 'tspan-txt'
          if (t.windId || t.nodeId) return 'tspan-link'
          return 'tspan-txt'
        })
        .attr('cursor', 'pointer')
        .attr('fill', function (t) {
          return 'top' === t.type ? 'white' : 'item' === t.type ? '#333' : 'bottom' === t.type ? '#999' : 'red'
        })
        .text(function (t) {
          var name = corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name
          t.name = name || '--N/A--'
          var e = t.name,
            a = 36
          'item' === t.type && (a = 38)
          new RegExp('[一-龥]+').test(e) || (a = 32)
          for (var n = 0, i = 0, o = 0; o < e.length; o++) {
            var s = e.charCodeAt(o)
            if ((n += s > 0 && s <= 128 ? 1 : 2) > a) {
              i = o
              break
            }
          }
          return i && ((e = e.substring(0, i)), (e += '...')), e
        })
        .on('mouseover', function (t) {
          if ((highLightNode(t.node), t.Id)) {
            var v
            var n
            v.select(this).attr('fill', '#128bed')
            var e = n(window.event.target),
              a = e.position()
            if (0 === a.left && 0 === a.top) {
              var o = e[0].getBoundingClientRect()
              a = {
                left: o.x,
                top: o.y,
              }
            }
            a.left -= 10
            var s = {
              width: e.width(),
              height: e.height(),
            }
            if (0 === s.width && 0 === s.height) {
              var r = e[0].getBBox()
              s = {
                width: r.width,
                height: r.height,
              }
            }
            i.emit('onDataMouseOver', {
              data: t,
              size: s,
              position: a,
            })
          }
        })
        .on('mouseout', function (t) {
          t.Id && d3.select(this).attr('fill', '#333')
          unHighLightNode(t)
        })
        .on('click', function (t) {
          if (d3.event.defaultPrevented) return // when drag， forbidden click
          // text click
          if (t.type == 'bottom') {
            if (!t.node.collection || !t.node.collection.length) return false
            openCorpList(t.box ? t.box.name : '', t.node._type)
          } else {
            if (t.windId || t.nodeId) {
              var code = t.windId || t.nodeId
              if (code && code.length > 15) {
                _refreshLists({
                  Id: code,
                  type: 'person',
                })
              } else {
                _refreshLists({
                  Id: code,
                  type: 'company',
                })
              }
            }
          }
        })
      s.append('text')
        .filter(function (t) {
          return t._type
        })
        .attr('x', function (t) {
          var e = 0
          return (
            t.count && (e = 9 * ((t.count + '').length - 1)),
            t.x - t.box.position.width / 2 + d.default.boxSetting.width - 25 - e
          )
        })
        .attr('y', function (t) {
          return t.y + 25
        })
        .attr('fill', '#fff')
        .text(function (t) {
          return t.count
        })

      s.append('title').text(function (t) {
        var name = corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name
        t.name = name
        return t.name
      })
    }

    async function openCorpList(name, type) {
      store.dispatch(
        globalActions.setGolbalModal({
          className: linkSourceRIME ? 'chart-card-modal rime-chart-card-modal' : 'chart-card-modal',
          width: 620,
          height: 400,
          visible: true,
          onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
          title: name || '全部相关信息列表',
          destroyOnClose: true, // 强制刷新
          content: (
            <ChartCard
              cardType="chartglgx"
              companyCode={companyCode}
              nodeType={type}
              glgxtype={selType}
              linkSourceRIME={linkSourceRIME}
            />
          ),
          footer: [],
        })
      )
    }

    function initBoxItems(t) {
      var a = []
      t.forEach(function (t) {
        if (t.collection) {
          a.push({
            node: t,
            name: corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name,
            type: 'top',
            _type: t._type,
            count: t.total,
            index: 0,
            box: t,
            x: t.x,
            y: t.y,
          })
          t.collection.forEach(function (e, n) {
            if (n < 5) {
              e.node = t
              e.index = n + 1
              e.type = 'item'
              e.box = t
              e.x = t.x
              e.y = t.y + d.default.boxSetting.item.height * (n + 1)
              a.push(e)
            }
          })
          var n = t.y + d.default.boxSetting.item.height * (t.total + 1)
          t.total > 5 && (n = t.y + 6 * d.default.boxSetting.item.height)
          a.push({
            node: t,
            name: isPerson(t)
              ? window.en_access_config
                ? 'All ' + t.total + ' people >'
                : '查看全部' + t.total + '位人员>'
              : window.en_access_config
                ? 'All ' + t.total + ' company >'
                : '查看全部' + t.total + '家企业>',
            type: 'bottom',
            count: t.total,
            index: 6,
            box: t,
            x: t.x,
            y: n,
          })
        } else {
          if (t.depth) {
            a.push({
              node: t,
              name: corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name,
              type: 'top',
              _type: t._type,
              count: '',
              index: 0,
              box: t,
              x: t.x,
              y: t.y,
            })
          }
        }
      })

      return a
    }

    function drawBoxes(t, e) {
      t.append('g')
        .selectAll('g')
        .data(e)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('id', function (t) {
          if (0 === t.depth) return 'center'
        })
        .attr('transform', function (t) {
          return 'translate('.concat(t.x, ', ').concat(t.y, ')')
        })
        .append('rect')
        .attr('stroke', function (t) {
          return 0 === t.depth ? primary_color : '#eee'
        })
        .attr('fill', function (t) {
          return 0 === t.depth ? primary_color : 'white'
        })
        .attr('fill-opacity', function (t) {
          return 0 === t.depth ? 1 : 0
        })
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 1)
        .attr('y', 0)
        .attr('x', function (t) {
          return -t.position.width / 2
        })
        .attr('width', function (t) {
          return t.position.width
        })
        .attr('height', function (t) {
          return t.position.height
        })
        .attr('border-radius', d.default.radius)
        .attr('rx', function (t) {
          return d.default.radius
        })
        .attr('ry', function (t) {
          return d.default.radius
        })
        .attr('pointer-events', 'visiblePoint')
        .on('mouseover', function (t) {
          highLightNode(t)
        })
        .on('mouseout', function (t) {
          unHighLightNode(t)
        })
        .on('click', function (t) {
          // click box
        })
      var n = e[0].position.rows,
        i = e[0].name,
        o = []
      1 === n
        ? o.push({
            name: i.substr(0, i.length),
            row: 'last',
            root: e[0].depth === 0 ? true : false,
          })
        : 2 === n
          ? o.push({
              name: i.substr(0, d.default.centerTextMax),
              row: 1,
            }) &&
            o.push({
              name: i.substr(d.default.centerTextMax),
              row: 'last',
            })
          : 3 === n
            ? o.push({
                name: i.substr(0, d.default.centerTextMax),
                row: 1,
              }) &&
              o.push({
                name: i.substr(d.default.centerTextMax, d.default.centerTextMax),
                row: 2,
              }) &&
              o.push({
                name: i.substr(2 * d.default.centerTextMax),
                row: 'last',
              })
            : 4 === n
              ? o.push({
                  name: i.substr(0, d.default.centerTextMax),
                  row: 1,
                }) &&
                o.push({
                  name: i.substr(d.default.centerTextMax, d.default.centerTextMax),
                  row: 2,
                }) &&
                o.push({
                  name: i.substr(2 * d.default.centerTextMax, d.default.centerTextMax),
                  row: 3,
                }) &&
                o.push({
                  name: i.substr(3 * d.default.centerTextMax),
                  row: 'last',
                })
              : 5 === n &&
                o.push({
                  name: i.substr(0, d.default.centerTextMax),
                  row: 1,
                }) &&
                o.push({
                  name: i.substr(d.default.centerTextMax, d.default.centerTextMax),
                  row: 2,
                }) &&
                o.push({
                  name: i.substr(2 * d.default.centerTextMax, d.default.centerTextMax),
                  row: 3,
                }) &&
                o.push({
                  name: i.substr(3 * d.default.centerTextMax, d.default.centerTextMax),
                  row: 4,
                }) &&
                o.push({
                  name: i.substr(4 * d.default.centerTextMax),
                  row: 'last',
                })
      var s = t
        .selectAll('#center')
        .append('text')
        .attr('font-size', '16px')
        .attr('x', -d.default.centerWidth / 2 + 12)
        .attr('y', 2)
      s.selectAll('tspan')
        .data(o)
        .enter()
        .append('tspan')
        .attr('fill', '#fff')
        .attr('x', function (t) {
          var e = s.attr('x')
          if (t.root) {
            return e
          }
          if ('last' === t.row) {
            var a = d.default.centerWidth - 16 * t.name.length
            e = parseFloat(a / 2) + parseFloat(e) - 12
          }
          return e
        })
        .attr('dy', 20)
        .text(function (t) {
          var name = corpNameObj[t.windId] ? corpNameObj[t.windId] : t.name
          t.name = name
          return t.name
        })
    }

    function drawLinks(t, e, a) {
      var n = this
      t.append('g')
        .selectAll('path')
        .attr('class', 'line-g')
        .data(e)
        .enter()
        .append('path')
        .attr('d', function (t) {
          var e = t.source.x,
            i = t.source.y,
            o = t.target.x,
            s = t.target.y,
            r = 50
          if (a)
            if (((s += t.target.position.height), 0 !== t.source.depth)) {
              var l = 280
              t.target.depth > 1 && (l = 280 - (280 - upLevelsInfo[t.target.depth - 1]))
              r = -r - (l - t.source.position.height)
            } else r = -r
          else {
            i += t.source.position.height
            0 !== t.source.depth && (r += 100 - t.source.position.height)
          }

          return 'M' + e + ',' + i + 'V' + (i + r) + 'H' + o + 'V' + s
        })
        .attr('fill', 'none')
        .attr('stroke', '#d6d6d6')
        .attr('stoke-width', 0.5)
        .attr('storke-width', 1)
    }

    function highLightNode(t) {
      d3.selectAll('.node rect')
        .attr('stroke', function (e) {
          if (t.id === e.id) return e.isPerson ? '#ffe4e7' : '#cfe7fa'
        })
        .attr('stroke-width', function (e) {
          return t.id === e.id ? 6 : 1
        })
        .attr('cursor', 'pointer')
      d3.selectAll('.gBox path')
        .classed('link-flow-in', function (e) {
          if (e && (e.source.id === t.id || e.target.id === t.id))
            // return "IN" === e.target.data.Direction
            return false
        })
        .classed('link-flow-out', function (e) {
          if (e && (e.source.id === t.id || e.target.id === t.id))
            // return "OUT" === e.target.data.Direction
            return false
        })
        .attr('stroke', function (a) {
          if (a) return a.source.id === t.id || a.target.id === t.id ? getArrowColor(a) : '#D6D6D6'
        })
    }

    function unHighLightNode(t) {
      d3.selectAll('.gBox path').attr('stroke', '#d6d6d6')
      d3.selectAll('.node rect')
        .attr('stroke', function (e) {
          return e.id === t.id ? '#eee' : '#128bed'
        })
        .attr('stroke-width', function (e) {
          return e.id === t.id ? 1 : 0
        })
      d3.selectAll('path')
        .classed('link-flow-in', function (t) {
          return !1
        })
        .classed('link-flow-out', function (t) {
          return !1
        })
    }

    function prepareNodes(t, e) {
      t.forEach(function (t, n) {
        t.id = n ? (e ? 'up' : 'down') + n : 0
        t.isPerson = !!+t.depth && isPerson(t.data)
        if (t.depth) {
          t.y = e ? t.y - 250 : t.y - 200
        }
        if (e) {
          if (t.depth) {
            if (t.parent.children.length > 1) {
              t.y = -t.y - t.position.height
            } else {
              t.y = -t.y - t.position.height
            }
          } else {
            t.y = -t.y
          }
        }
        if (e) {
          upLevelsInfo[t.depth] || (upLevelsInfo[t.depth] = 0)
          var i = upLevelsInfo[t.depth]
          t.position.height > i && (upLevelsInfo[t.depth] = t.position.height)
          if (t.depth > 1) {
            t.y += 280 - upLevelsInfo[t.depth - 1]
          }
        } else {
          downLevelsInfo[t.depth] || (downLevelsInfo[t.depth] = 0)
          var o = downLevelsInfo[t.depth]
          t.position.height > o && (downLevelsInfo[t.depth] = t.position.height)
        }
      })
    }

    function shortenLine(t, e) {
      if (!t.children || !t.children.length) return !1
      if (1 === t.children.length) {
        var n = 0
        0 !== t.depth && t.position && (n = 280 - t.position.height)
        e && depthUp[t.depth] && 1 === depthUp[t.depth].length && (t.children[0].y = t.children[0].y + 80 + n - 100)
        !e && depthDown[t.depth] && 1 === depthDown[t.depth].length && (t.children[0].y = t.children[0].y - 80 - n + 40)
      }
      t.children.forEach(function (t) {
        shortenLine(t, e)
      })
    }

    function initBoxSize(tt) {
      var e = this
      tt.forEach(function (t) {
        t.position = {}
        if (t.depth) {
          t.position.width = d.default.boxSetting.width
          t.position.height = getBoxHeight(t.collection, t)
        } else {
          t.position.width = d.default.centerWidth
          t.position.height = getCenterHeight(t)
        }
      })
      return tt
    }

    function getCenterHeight(t) {
      var e = t.name.length,
        a = parseInt(e / d.default.centerTextMax)
      return e % d.default.centerTextMax && (a += 1), (t.position.rows = a), 19 * a + 14
    }

    function getBoxHeight(t, e) {
      var a = isPerson(e) ? d.default.boxSetting.top.person.height : d.default.boxSetting.top.company.height
      return e.total
        ? e.total <= 5
          ? a + d.default.boxSetting.item.height * (e.total + 1)
          : a + 5 * d.default.boxSetting.item.height + d.default.boxSetting.bottom.height
        : a
    }
  }

  const handleAjaxData = (res, call) => {
    !window.__LOCALEEN__ && setLoaded(false)

    if (res.ErrorCode == '0' && res && res.Data && res.Data.collection?.length && res.Data.children?.length) {
      var tmpObj = {}
      chanGLF(res.Data, tmpObj)
      if (window.en_access_config) {
        wftCommon.translateService(tmpObj, function (endata) {
          tmpObj = endata
          requestGLGX(res.Data, tmpObj)
        })
      } else {
        requestGLGX(res.Data, tmpObj)
      }
    } else if (res.ErrorCode == '-10') {
      // 无权限，需要弹出vip付费弹框
      call({})
      //   VipPopup()
    } else if (res.ErrorCode == '-9' || res.ErrorCode == '-13') {
      // 使用超限，已在axios层处理
      call({})
    } else {
      // 暂无数据
      setLoaded(false)
      call({})
    }
  }

  const getAjaxData = (param, successCall, errCall) => {
    !loading && setLoaded(true)

    const newApi = '/graph/company/getIPOGraph/' + param.companyCode
    const newApiF9 = '/graph/company/getIPOGraphForF9/' + param.companyCode
    myWfcAjax(linkSourceF9 ? newApiF9 : newApi, param).then(
      (res) => {
        successCall && successCall(res)
        handleAjaxData(res, errCall)
      },
      () => {
        setLoaded(false)
        errCall && errCall({})
      }
    )
  }

  const _refreshLists = (d) => {
    return linkToCompany(d.Id, d.type === 'company', d.type === 'person', linkSourceRIME)
  }

  const freshChart = () => {
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

  function saveAction(e) {
    pointBuriedByModule(922602100958)
    var serializer = new XMLSerializer()
    var svgCopy = document.querySelector('.glgxsvg')
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

        // var marker = intl('478649', '基于公开信息和第三方数据利用大数据技术独家计算生成!')
        // context.font = '14px 微软雅黑'
        // context.fillStyle = '#aaaaaa'
        // context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)

        var marker2 = intl('358256', '企业会计准则')
        if (selType == 3) {
          marker2 = intl('358236', '深交所规则')
        }
        if (selType == 2) {
          marker2 = intl('358257', '上交所规则')
        }
        context.font = '14px 微软雅黑 bold'
        context.fillStyle = '#333333'
        context.fillText(marker2, 20, 22)

        let a = document.createElement('a')
        a.download = companyName + '_关联方图谱' + '.png'
        a.href = canvas.toDataURL('image/jpeg', qual)
        a.click()
      })
    }
  }

  function glgxChartExportEvent() {
    exportRelateChart({
      companyCode,
      selType,
      companyName,
      linkSourceRIME,
    })
  }

  return (
    <div
      className={` relate-chart-instance chart-body  ${linkSourceRIME ? 'rime-relate-chart-instance' : ''} `}
      ref={domRef}
    >
      {loading || !data ? null : (
        <div className="chart-icons">
          {disableExportExcel ? null : (
            <FileTextO onClick={glgxChartExportEvent} data-uc-id="HTgwaDrOqC" data-uc-ct="filetexto" />
          )}
          <SaveO onClick={saveAction} data-uc-id="JfjyRhUL6X" data-uc-ct="saveo" />
          <RefreshO onClick={freshChart} data-uc-id="uvb3FR5O0_" data-uc-ct="refresho" />
        </div>
      )}
      <div className={`chart-tabs ${loading ? 'chart-tabs-dark' : ''}`}>
        <Radio.Group
          value={selType}
          onChange={(e) => {
            pointBuriedByModule(922602100956)
            setSelType(e.target.value)
          }}
          data-uc-id="eCEeK4GDb"
          data-uc-ct="radio"
        >
          {glgxTypes.map((t) => {
            if (t.val === 5 && !isfinical) return null
            return (
              <Radio key={t.val} value={t.val} data-uc-id="eDCFHshqqJ" data-uc-ct="radio" data-uc-x={t.val}>
                {t.label}
              </Radio>
            )
          })}
        </Radio.Group>
      </div>
      <div
        className={`relate-graph-content ${waterMask ? 'chart-content-watermask' : ''}`}
        style={!loading && !data ? { borderLeft: 'none', borderRight: 'none' } : null}
      >
        {loading && companyCode ? <Spin className="chart-loading" tip="Loading..."></Spin> : null}
        {(!loading && !data) || !companyCode ? <Empty></Empty> : null}
      </div>
      {bottom ? (
        <div className="chart-bottom">
          {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
        </div>
      ) : null}
    </div>
  )
}

export default RelateChart
