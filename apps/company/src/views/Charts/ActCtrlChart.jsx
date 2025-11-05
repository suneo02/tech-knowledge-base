/** @format */

import React, { useEffect, useRef, useState } from 'react'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import { RefreshO, SaveO } from '@wind/icons'
import { Spin } from '@wind/wind-ui'
import { myWfcAjax } from '../../api/common'
import * as echarts from 'echarts'
import './ActCtrlChart.less'
import sy2 from '../../assets/imgs/chart/sy2.png'
import { parseQueryString } from '../../lib/utils'
import { calcPathByFont, downloadimg, filterNodes, formatLongString, getMaxDepth, getNodeByKey } from './utils'
import global from '../../lib/global'
import { VipPopup } from '../../lib/globalModal'
import Empty from '../../components/charts/empty'
import { LinkByRowCompatibleCorpPerson } from '../../components/company/link/CorpOrPersonLink'
import { linkToCompany } from './handle'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

function changeTheData(data) {
  var pathObjs = {}
  var tmpData = {
    nodes: [],
    routes: [],
    endNodes: [],
    nodeNames: {},
  }
  var tnodes = {}
  data.routeList.forEach((path) => {
    path.forEach((node) => {
      if (!pathObjs[node['nodeId']]) {
        pathObjs[node['nodeId']] = [path]
      } else {
        pathObjs[node['nodeId']].push(path)
      }
      pathObjs[node['nodeId']]._pathCount = pathObjs[node['nodeId']].length

      if (!tnodes[node['nodeId']]) {
        tnodes[node['nodeId']] = node
      }
    })
  })

  for (var k in tnodes) {
    var addKeys = {}
    for (var i = 0; i < data.nodeList.length; i++) {
      var nd = data.nodeList[i]
      if (nd.nodeId === k && !addKeys[k]) {
        addKeys[k] = 1
        var tmpnd = {
          level: nd.depth,
          nodeId: nd.nodeId,
          nodeName: nd.nodeName || 'node',
          nodeType: nd.type || 'company',
          windId: nd.nodeId,
          actCtrl: nd.actCtrl,
          indirectRatio: wftCommon.formatPercent(nd.stockShare),
          benifciary: nd.benifciary ? nd.benifciary : false,
          pathCounts: pathObjs[nd.nodeId] ? pathObjs[nd.nodeId]._pathCount : 1, // 当前节点在几条path上出现过
        }
        if (tmpData.nodeNames[tmpnd.nodeName]) {
          tmpData.nodeNames[tmpnd.nodeName] = tmpData.nodeNames[tmpnd.nodeName] + 1
          tmpnd.nodeName = tmpnd.nodeName + '$$$$' + tmpData.nodeNames[tmpnd.nodeName]
        } else {
          tmpData.nodeNames[tmpnd.nodeName] = 1
        }
        tmpData.nodes.push(tmpnd)
      }
    }
  }

  data.relationList.forEach(function (nd) {
    var tmplink = {
      endId: nd.targetId,
      endNode: nd.targetId,
      props: nd.ratio ? wftCommon.formatPercent(nd.ratio) : '',
      startId: nd.sourceId,
      startNode: nd.sourceId,
    }
    tmpData.routes.push(tmplink)
  })

  data.routeList.forEach(function (path) {
    tmpData.endNodes.push(path[0].nodeId)
  })
  tmpData.pathObjs = pathObjs
  data.nodes = tmpData.nodes
  data.routes = tmpData.routes
  data.endNodes = tmpData.endNodes
  data.pathObjs = tmpData.pathObjs
  return tmpData
}

/**
 * 控制人图
 * @param {*} companycode 公司code，不传的情况下会从url上读取
 * @param {*} waterMask 有无wind水印，默认true
 * @param {*} saveImgName 保存图片的名称，默认实际控制人图
 * @param {*} bottom 底部是否显示，默认false
 * @returns
 */
function ActCtrlChart({ companycode, watermask = true, saveImgName = intl('356113', '实控人图谱'), bottom = false }) {
  const qsParam = parseQueryString()
  const companyCode = companycode || qsParam['companycode']
  const waterMask = qsParam.nowatermask ? false : watermask
  const linksource = qsParam.linksource || ''
  const linkSourceRIME = linksource === 'rime' ? true : false
  const domRef = useRef(null)
  const nodes = []
  const links = []

  const personColor = '#fac38b'
  const corpColor = '#90bbd0'
  const personSize = [120, 48]
  const corpSize = [160, 48]
  const lineTxtColorOne = '#999' // 初始路径文本颜色
  const lineFontSize = '12' // 初始路径文本字体
  const lineWidthOne = 1 // 初始路径线粗细宽度
  const [mapData, setMapData] = useState(null)
  const [loading, setLoaded] = useState(true)
  const [levelLen, setLevelLen] = useState(3)
  const [startNode, setStartNode] = useState(null)
  const [endNode, setEndNode] = useState([])
  const [rootData, setRootData] = useState(null)
  const [actCtrlInfo, setActCtrlInfo] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [paths, setPaths] = useState([])

  useEffect(() => {
    if (linksource === 'pcai') {
      document.body.classList.add('pcai-mode')
    }
    return () => {
      document.body.classList.remove('pcai-mode')
    }
  }, [linksource])

  useEffect(() => {
    pointBuriedByModule(922602100364)
    getActCtrlInfo()
    getMapData()
  }, [companyCode])

  const getActCtrlInfo = () => {
    myWfcAjax(`graph/company/getactcontroinfo/${companyCode}`, { companycode: companyCode }).then(
      (res) => {
        if (res.ErrorCode == global.SUCCESS && res.Data?.length) {
          setActCtrlInfo(res.Data)
          setCompanyName(res.Data[0].corpName)
        } else {
          if (actCtrlInfo.length) {
            setActCtrlInfo([])
          }
        }
      },
      () => {
        if (actCtrlInfo.length) {
          setActCtrlInfo([])
        }
      }
    )
  }

  const getMapData = () => {
    myWfcAjax('graph/company/getactualcontrollerroute/' + companyCode, {})
      .then(
        (res) => {
          if (res.ErrorCode == global.USE_FORBIDDEN) {
            // 无权限，需要弹出vip付费弹框
            VipPopup({ title: intl('356113', '实控人图谱') })
          } else if (res.ErrorCode == global.USE_OUT_LIMIT || res.ErrorCode == global.VIP_OUT_LIMIT) {
            // 使用超限，已在axios层处理
          } else if (res.ErrorCode == global.SUCCESS && res.Data && res.Data.nodeList?.length) {
            // if (window.en_access_config) {
            //   wftCommon.zh2en(res.Data, (endata) => {
            //     console.log('endata', endata)
            //   })
            // }

            const maxDepth = getMaxDepth(res.Data.nodeList)
            const endNodeTmp = []
            res.Data.nodeList.map((t) => {
              if (!t.depth) {
                setStartNode(t)
              } else if (t.depth == maxDepth) {
                endNodeTmp.push(t)
              }
            })
            setLoaded(false)
            setEndNode(endNodeTmp)
            setLevelLen(maxDepth)
            setRootData(res.Data)
          } else {
            setMapData(null)
            setLoaded(false)
          }
        },
        () => {
          setMapData(null)
          setLoaded(false)
        }
      )
      .finally(() => {
        setLoaded(false)
      })
  }

  useEffect(() => {
    if (!rootData) return
    // TODO 后端需要调整数据接口，返回paths nodes routes，先前端计算path
    const tmpPaths = calcPathByFont(rootData.nodeList, rootData.relationList, startNode, endNode)
    setPaths(tmpPaths)
    rootData.routeList = tmpPaths
    setMapData(rootData)
  }, [rootData])

  useEffect(() => {
    if (!mapData || !mapData.routeList?.length) return
    changeTheData(mapData)

    const keyNames = {}
    const objs = { Nodes: [], Links: [] } // 数据结构转换
    for (let i = 0; i < mapData.nodes.length; i++) {
      const item = mapData.nodes[i]
      const t = {
        name: item.nodeName,
        keyNo: item.windId,
        nodeType: item.nodeType,
        level: item.level,
        pathCounts: item.pathCounts,
        fixX: true,
        fixY: true,
        label: {
          txt: item.nodeName,
          color: '#333',
          fontSize: 14,
          lineHeight: 18,
        },
        symbol: 'rect',
        symbolSize: item.nodeType == 'company' ? corpSize : personSize,
        itemStyle: {
          borderRadius: '2%',
          color: '#ffffff',
          borderWidth: '1',
          borderColor: item.nodeType == 'company' ? corpColor : personColor,
        },
        actCtrl: item.actCtrl,
        benifciary: item.benifciary,
        indirectRatio: item.indirectRatio,
      }

      nodes.push(t)
      objs.Nodes.push(t)
      if (!keyNames[item.windId]) {
        keyNames[item.windId] = item.nodeName
      }
    }

    for (let i = 0; i < mapData.routes.length; i++) {
      const link = mapData.routes[i]
      const t = {
        Relation: link.props,
        Source: keyNames[link.startId] || 'left',
        Target: keyNames[link.endId] || 'right',
      }
      objs.Links.push(t)
    }

    objs.Links.map((link, i) => {
      for (var j = 0; j < links.length; j++) {
        if (links[j].source == link.Source && links[j].target == link.Target) {
          links[j].name += ',' + link.Relation
          return
        }
      }
      links.push({
        source: link.Source,
        target: link.Target,
        name: link.Relation,
        label: {
          color: '#333',
          fontSize: lineFontSize,
        },
        lineStyle: {
          color: lineTxtColorOne,
          opacity: 1, // 为0时，link不展示，包括上面的label
          width: lineWidthOne,
        },
      })
    })

    if (paths.length > 0) {
      filterNodes(nodes, paths)
    }

    calcPos(paths.length)

    //计算节点坐标位置
    function calcPos(pathCounts) {
      var levels = {}
      var len = 0
      var keys = null
      var maxLevel = 0

      var mwidth = domRef.current.clientWidth * 0.98,
        mheight = domRef.current.clientHeight * 0.96

      mwidth = linkSourceRIME ? mwidth * 0.8 : mwidth
      mheight = linkSourceRIME ? mheight * 0.8 : mheight

      nodes.map((node, index) => {
        if (!levels[node.level]) {
          levels[node.level] = []
        }
        levels[node.level].push(node)
        if (maxLevel < node.level) maxLevel = node.level
      })
      keys = Object.keys(levels)
      len = keys.length

      var ySpan = levelLen > 4 ? '128' : mheight / (levelLen + 1)

      // 当所有路径与点刚好绘制成一个圆时
      if (paths.length > 1 && nodes.length === len) {
        for (var i = 0; i < paths.length; i++) {
          var path = paths[i]

          if (path.length > 2) {
            var area = {
              width: mwidth,
              height: mheight,
            }
            for (var j = 0; j < path.length; j++) {
              var node = path[j]
              node = getNodeByKey(nodes, 'keyNo', node.nodeId)
              node.initial = []
              node.initial[0] = area.width / 2
              node.initial[1] = node.initial[1] ? node.initial[1] : area.height - (ySpan * j + ySpan / 2)
              if (node.level != 0 && node.level != len - 1) {
                var xSpan = area.width / path.length // X 横向
                var xSpanMargin = xSpan / 2
                node.initial[0] = i * xSpan + xSpanMargin * (i - 1)
              }

              node.x = node.initial[0]
              node.y = node.initial[1]
            }
          } else {
            var area = {
              width: mwidth,
              height: mheight,
            }
            for (var j = 0; j < path.length; j++) {
              var node = path[j]
              node = getNodeByKey(nodes, 'keyNo', node.nodeId)
              node.initial = []
              if (node.level == maxLevel) {
                node.initial[1] = area.height - ySpan * j * len
              } else {
                node.initial[1] = area.height - (node.initial[1] ? node.initial[1] : ySpan * j * len + ySpan / 2)
              }
              node.initial[0] = area.width / 2
              node.x = node.initial[0]
              node.y = node.initial[1]
            }
          }
        }
        return
      }

      var rcount = 0

      for (var k in keys) {
        var xLen = len
        // 如果最长的level比level个数len大，说明中间有间隔，需要单独处理x间隔
        if (keys[len - 1] - (len - 1)) {
          xLen = len + (keys[len - 1] - (len - 1))
        }

        var level = keys[k]
        var sameLevelNodes = levels[level]
        if (sameLevelNodes) {
          var area = {
            width: mwidth,
            height: mheight,
          }
          // var ySpan = area.height / xLen // Y 间隔 也即是从上往下的间隔
          sameLevelNodes.map((node, i) => {
            node.initial = []
            if (k == maxLevel) {
              node.initial[1] = 0
              // node.initial[1] = ySpan * (maxLevel - level) + ySpan / 2 + 20
            } else {
              node.initial[1] = ySpan * (maxLevel - level) + ySpan / 2
            }
            node.initial[0] = area.width / 2

            if (level != 0 && level != len - 1) {
              if (sameLevelNodes.length == 1 && pathCounts > 1) {
                // 如果是当前只有一个节点 稍微偏移一下 否则容易造成线路重叠
                var xSpan = area.width
                var xSpanMargin = xSpan / 3
                node.initial[0] = i * xSpan + xSpanMargin - 30 * (rcount % 2)
              } else {
                var xSpan = area.width / sameLevelNodes.length // y
                var xSpanMargin = xSpan / 2
                node.initial[0] = i * xSpan + xSpanMargin - 30 * (rcount % 2)
              }
            } else if (level == len - 1 && sameLevelNodes.length > 1) {
              // 最顶层节点，可能有多个的情况下，需要对x进行均分
              var xSpan = area.width / sameLevelNodes.length
              var xSpanMargin = xSpan / sameLevelNodes.length
              if (xSpanMargin < node.symbolSize[0]) {
                // 如果span过小，则用node宽度替代
                xSpanMargin = node.symbolSize[0]
              }
              node.initial[0] = i * xSpan + xSpanMargin
            }
            if (window.en_access_config && keys.length > 3) {
              rcount++
            }
            node.x = node.initial[0]
            node.y = node.initial[1]
          })
        }
      }
    }
  }, [mapData])

  useEffect(() => {
    if (!nodes.length) return

    // 销毁前一次的ECharts实例，不然上一次的高度、宽度，会被保留
    if (domRef.current) {
      echarts.dispose(domRef.current)
    }

    nodes.map((t, idx) => {
      t.draggable = true
    })

    const chart = echarts.init(domRef.current, { antialias: true })
    const options = {
      renderer: 'svg',
      series: [
        {
          name: 'chart_ctrl',
          type: 'graph',
          layout: 'none',
          roam: 'move',
          label: {
            show: true, // 节点上的文本
            formatter: (params) => {
              let name = params.data?.label?.txt || '--'
              if (name.indexOf('$$$$') > -1) {
                name = name.split('$$$$')[0]
              }
              const nameLen = name.length || 0
              if (nameLen > 11) {
                return formatLongString(name, 10, 2)
              }
              return name
            },
            position: 'inside',
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [1, 8],
          edgeLabel: {
            // 线上文本
            fontSize: 12,
            show: true,
            formatter: (params) => {
              return params.data.name.replace(/(.{22})(?=.)/g, '$1\n')
            },
            positon: 'bottom',
          },
          cursor: 'pointer',
          nodes: nodes,
          links: links,
        },
      ],
    }
    chart.setOption(options)

    chart.on('click', { dataType: 'node' }, (params) => {
      if (params && params.data) {
        _refreshLists({
          Id: params.data.keyNo,
          type: params.data.nodeType,
        })
      }
    })

    // 返回一个清理函数，以便在组件卸载时销毁ECharts实例
    // return () => {
    //   echarts.dispose(domRef.current);
    // };
  }, [nodes])

  const saveAction = () => {
    var canvas = domRef.current.querySelector('canvas')
    var imgdata = canvas.toDataURL()
    var shuiying = new Image()
    var name = saveImgName ? (companyName ? companyName + '_' : '') + saveImgName : '全球企业库'
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
        if (waterMask) {
          for (var x = 10; x < canvas.width; x += wlen) {
            for (var y = 10; y < canvas.height; y += hlen) {
              context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
            }
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
    setLoaded(true)
    getMapData()
  }

  const _refreshLists = (d) => {
    return linkToCompany(d.Id, d.type === 'company', d.type === 'person', linkSourceRIME)
  }

  const renderNames = (t) => {
    if (linkSourceRIME) {
      return (
        <a
          className="chart-info-primary"
          onClick={() => {
            if (t.ActControId && t.ActControId.length) {
              if (t.ActControId?.length > 15) {
                linkToCompany(t.ActControId, false, true, true)
              } else {
                linkToCompany(t.ActControId, true, false, true)
              }
            }
          }}
        >
          {t.ActControName}
        </a>
      )
    }
    return (
      <LinkByRowCompatibleCorpPerson
        className={'chart-info-primary'}
        nameKey={'ActControName'}
        idKey={'ActControId'}
        row={t}
        typeKey="typeName"
      />
    )
  }

  return (
    <div className={` sjkzr-chart-instance ${linkSourceRIME ? 'rime-sjkzr-chart-instance' : ''} `}>
      {!loading ? (
        !mapData ? (
          <Empty></Empty>
        ) : (
          <>
            <div className="chart-icons">
              <SaveO onClick={saveAction} />
              <RefreshO onClick={refreshAction} />
            </div>
            {/* <div className="chart-tag">
              <MyIcon name={'actor11'}></MyIcon>
              <span>一致行动人,编号一致的为一组关系</span>
            </div> */}
            <div className="sjkzr-chart-left">
              {actCtrlInfo.map((t, idx) => {
                return (
                  <div className="sjkzr-chart-info" key={idx}>
                    <span>{intl('419991', '实际控制人')} </span>
                    {renderNames(t)}
                    <span>{intl('420007', '实际持股比例')} </span>
                    <span className="chart-info-primary">
                      {t.ActInvestRate > 0 ? wftCommon.formatPercent(t.ActInvestRate) : '--'}
                    </span>
                  </div>
                )
              })}
            </div>
            {loading ? null : (
              <div
                ref={domRef}
                style={{ width: '100%', height: levelLen > 4 ? '150%' : '100%', background: '#fff' }}
                className={`chart-content ${waterMask ? 'chart-content-watermask' : ''}`}
              ></div>
            )}
            {bottom ? (
              <div className="chart-bottom">
                {intl('261373', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
              </div>
            ) : null}
          </>
        )
      ) : (
        <Spin className="chart-loading" tip="Loading..."></Spin>
      )}
    </div>
  )
}

export default ActCtrlChart
