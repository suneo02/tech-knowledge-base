/** @format */

import React, { useState, useEffect } from 'react'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import { SaveO, RefreshO } from '@wind/icons'
import { Button, Spin, message } from '@wind/wind-ui'
import { getinvestpath } from '../../api/chartApi'
import PreInput from '../../components/common/search/PreInput'
import { useRef } from 'react'
import * as echarts from 'echarts'
import { Row } from '@wind/wind-ui'
import './ShareholderGraph.less'
import demoPng from '../../assets/imgs/chart/gqgl.png'
import sy2 from '../../assets/imgs/chart/sy2.png'
import companyPng from '../../assets/imgs/chart/company.png'
import companyTargetPng from '../../assets/imgs/chart/c-company.png'
import { pointBuriedGel } from '../../api/configApi'

const CompanyChart = {}

function ShareholderChartComp({
  sourceNodes,
  targetNodes,
  relativeTypes,
  waterMask = true,
  saveImgName = '持股路径图',
  forceUpdate,
  actions,
}) {
  const domRef = useRef(null)

  var nodes = []
  var links = []
  var paths = []

  var lineTxtColorOne = '#999' // 初始路径文本颜色
  var lineFontSize = '12' // 初始路径文本字体
  var lineWidthOne = 1 // 初始路径线粗细宽度

  const leftId = sourceNodes?.id || null
  const rightId = targetNodes?.id || null
  const relative = relativeTypes || ''

  const [leftCompany, setLeftCompany] = useState(leftId)
  const [rightCompany, setReftCompany] = useState(rightId)
  const [relativeType, setRelativeType] = useState(relative)
  const [mapData, setMapData] = useState(null)
  const [loading, setLoaded] = useState(true)

  useEffect(() => {
    if (leftId !== leftCompany) setLeftCompany(leftId)
    if (rightId !== rightCompany) setReftCompany(rightId)
    if (relative.length !== relativeType.length) setRelativeType(relative)

    CompanyChart.leftCorpName = sourceNodes?.name
    CompanyChart.leftCompany = leftId
    CompanyChart.rightCorpName = targetNodes?.name
    CompanyChart.rightCompany = rightId
  }, [leftId, rightId, relative])

  const getMapData = () => {
    getinvestpath({
      windcode: `${leftId},${rightId}`,
      historyInfo: [
        { companyName: sourceNodes?.name, companyCode: leftId },
        { companyName: targetNodes?.name, companyCode: rightId },
      ],
      expoVer: 0,
    }).then(
      (res) => {
        !window.en_access_config && setLoaded(false)
        if (res?.code == '0') {
          if (
            res?.data &&
            res.data?.routeList &&
            res.data.routeList?.length &&
            res.data?.nodeList?.length &&
            res.data?.relationList?.length
          ) {
            if (window.en_access_config) {
              res.data.nodeList.map(function (t) {
                if (!t.depth) t.depth = '0'
              })
              wftCommon.zh2en(
                res.data.nodeList,
                function (endata) {
                  res.data.nodeList = endata
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
            setMapData(null)
          }
        } else {
          setMapData(null)
        }
      },
      () => {
        setMapData(null)
        setLoaded(false)
      }
    )
  }

  useEffect(() => {
    CompanyChart.leftParams = leftCompany
    CompanyChart.rightParams = rightCompany
    getMapData()
  }, [leftCompany, rightCompany, relativeType, forceUpdate])

  useEffect(() => {
    if (mapData && mapData.routeList?.length) {
      changeTheData(mapData)
    } else {
      return
    }

    var nodeLists = ''
    var keyNames = {}
    var nodeMaps = {}
    var objs = { Nodes: [], Links: [] } // 数据结构转换
    mapData.nodes.forEach(function (t) {
      if (t.nodeType === 'company' && t.windId.indexOf('$') < 0) {
        if (nodeLists) {
          nodeLists += ',' + t.windId
        } else {
          nodeLists = t.windId
        }
      }
    })

    for (var i = 0; i < mapData.nodes.length; i++) {
      var item = mapData.nodes[i]
      var t = {
        _Root: item.windId == CompanyChart.companyCode ? true : false,
        Category: item.nodeType == 'company' ? 0 : 2,
        KeyNo: item.windId,
        Level: item.level,
        Name: item.nodeName,
        nodeType: item.nodeType,
        imageIdT: item.imageIdT,
        pathCounts: item.pathCounts,
        obj: {
          properties: {
            KeyNo: item.windId,
            name: item.nodeName,
            id: item.nodeId,
          },
        },
        actCtrl: item.actCtrl,
        benifciary: item.benifciary,
        indirectRatio: item.indirectRatio,
      }
      objs.Nodes.push(t)
      if (!keyNames[item.windId]) {
        keyNames[item.windId] = item.nodeName
      }
    }

    for (var i = 0; i < mapData.routes.length; i++) {
      var link = mapData.routes[i]
      var t = {
        Relation: link.props,
        Source: keyNames[link.startId] || 'left',
        Target: keyNames[link.endId] || 'right',
      }
      objs.Links.push(t)
    }

    var levels = [],
      nodeLinks = {}

    var startNode = {},
      endNode = {}

    objs.Nodes.map((node, i) => {
      var fontSize = 12
      var corpBgColor = '#ffffff'
      var corpTxtColor = '#333333'
      node.imageIdT = null
      const item = {
        category: [1, 2],
        name: node.Name,
        keyNo: node.KeyNo,
        nodeType: node.nodeType,
        level: node.Level,
        pathCounts: node.pathCounts,
        fixX: true,
        fixY: true,
        label: {
          txt: node.Name,
          color: '#333',
          fontSize: 14,
        },
        symbol: 'image://' + companyPng,
        symbolSize: [60, 60],
        itemStyle: {
          normal: {
            borderRadius: '5%',
            color: corpBgColor,
            borderWidth: '1',
            borderColor: '#ddd',
            label: {
              // position: 'inside',
              position: 'bottom',
              textStyle: {
                color: corpTxtColor,
                fontFamily: '微软雅黑',
                fontSize: fontSize,
                fontStyle: 'normal',
              },
            },
          },
        },
        actCtrl: node.actCtrl,
        benifciary: node.benifciary,
        indirectRatio: node.indirectRatio,
      }
      if (leftId.indexOf(node.KeyNo) > -1) {
        item.symbol = 'image://' + companyTargetPng
        item.symbolSize = [90, 90]
        startNode = node
      } else if (rightId.indexOf(node.KeyNo) > -1) {
        item.symbol = 'image://' + companyTargetPng
        item.symbolSize = [90, 90]
        endNode = node
      }
      nodes.push(item)
    })

    var pathNum = 1
    objs.Links.map((link, i) => {
      for (var j = 0; j < links.length; j++) {
        if (links[j].source == link.Source && links[j].target == link.Target) {
          links[j].name += ',' + link.Relation
          links[j].itemStyle.normal.text = links[j].name
          return
        }
      }

      links.push({
        source: link.Source,
        target: link.Target,
        name: link.Relation,
        weight: 1,
        label: {
          color: '#00aec7',
          fontSize: lineFontSize,
        },
        lineStyle: {
          color: lineTxtColorOne,
          opacity: 1, // 为0时，link不展示，包括上面的label
          width: lineWidthOne,
        },
      })
    })

    nodes.map((node, idx) => {
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

    paths = calPath(nodes, links)

    if (paths.length > 0) {
      filterNodes()
    }

    calcPos(pathNum)

    //计算路径(前端计算)
    function calPath(nodes, links) {
      var paths = []
      var counter = 0
      getNext(startNode, [startNode])

      function getNext(node, path) {
        counter++
        if (counter > 20000) return
        for (var i = 0; i < links.length; i++) {
          if (links[i].source == node.name || links[i].target == node.name) {
            var nextNodeName
            if (links[i].source == node.name) {
              nextNodeName = links[i].target
            } else {
              nextNodeName = links[i].source
            }
            var nextNode = CompanyChart.getNodeByKey(nodes, 'name', nextNodeName)

            if (nextNode && !existNode(nextNode, path) && node.level <= nextNode.level) {
              var cPath = path.concat()
              cPath.push(nextNode)
              if (mapData.endNodes.indexOf(nextNode.keyNo) > -1) {
                paths.push(cPath)
              } else {
                getNext(nextNode, cPath)
              }
            }
          }
        }
      }
      paths = paths.sort(function (a, b) {
        return a.length - b.length
      })
      return paths
    }

    //计算节点坐标位置
    function calcPos(pathCounts) {
      var levels = {}
      var len = 0
      var keys = null

      var mwidth = domRef.current.clientWidth * 0.9,
        mheight = domRef.current.clientHeight

      nodes.map((node, index) => {
        if (!levels[node.level]) {
          levels[node.level] = []
        }
        levels[node.level].push(node)
      })
      keys = Object.keys(levels)
      len = keys.length

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
                // node.initial[0] = xSpan * j * len + (xSpan / 2) + 50;
                node.initial[0] = xSpan * j * len
              } else {
                node.initial[0] = xSpan * j * len + xSpan / 2
              }
              // node.initial[0] = xSpan * j * len + (xSpan / 2);
              node.initial[1] = area.height / 2 // + (30 * (j % 2));

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
            height: mwidth,
          }
          var xSpan = area.width / xLen // x 间隔

          sameLevelNodes.map((node, i) => {
            node.initial = []
            if (k == '0') {
              node.initial[0] = xSpan * level + xSpan / 2 + 20
            } else {
              node.initial[0] = xSpan * level + xSpan / 2
            }
            node.initial[1] = area.height / 2

            if (level != 0 && level != len - 1) {
              if (sameLevelNodes.length == 1 && pathCounts > 1) {
                // 如果是当前只有一个节点 稍微偏移一下 否则容易造成线路重叠
                var ySpan = area.height
                var ySpanMargin = ySpan / 3
                node.initial[1] = i * ySpan + ySpanMargin - 30 * (rcount % 2)
              } else {
                var ySpan = area.height / sameLevelNodes.length // y
                var ySpanMargin = ySpan / 2
                node.initial[1] = i * ySpan + ySpanMargin - 30 * (rcount % 2)
              }
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

    nodes.map((t, idx) => {
      t.draggable = true
    })

    const chart = echarts.init(domRef.current)
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
              if (leftId.indexOf(params.data?.keyNo) > -1) {
                if (window.en_access_config) {
                  return `${params.data?.label?.txt}\n\n{red|Holdings ${params.data?.indirectRatio}}`
                }
                return `${params.data?.label?.txt}\n\n{red|累计持股比例 ${params.data?.indirectRatio}}`
              }
              return params.data?.label?.txt
            },
            rich: {
              red: {
                color: 'red',
                fontSize: 13,
                align: 'center',
              },
            },
            position: 'bottom',
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
      // graphic: {
      //   elements: [
      //     {
      //       type: 'circle',
      //       left: (ec) => {
      //         const series = ec.getSeriesByIndex(0)
      //         const data = series.getData()
      //         const node = data.getItemLayout(0)
      //         return node ? node[0] - 10 : 0
      //       },
      //       top: (ec) => {
      //         const series = ec.getSeriesByIndex(0)
      //         const data = series.getData()
      //         const node = data.getItemLayout(0)
      //         return node ? node[1] + 50 : 0
      //       },
      //       shape: {
      //         cx: 500,
      //         cy: 500,
      //         r: 40,
      //       },
      //       style: {
      //         fill: 'blue',
      //         stroke: 'black',
      //         lineWidth: 3,
      //       },
      //       draggable: true,
      //     },
      //   ],
      // },
    }
    chart.setOption(options)

    // const ZRender = chart.getZr()
    // const shapeList = ZRender.storage.getDisplayList()
    // const imageShape = new echarts.graphic.Image({
    //   style: {
    //     image: companyTargetPng,
    //     width: 100,
    //     height: 100,
    //     x: shapeList[18].parent.transform[4] - 61,
    //     y: shapeList[18].parent.transform[5] - 75,
    //   },
    //   draggable: false,
    // })
    // chart._zr.add(imageShape)

    // return () => {
    //   chart.dispose()
    // }
  }, [nodes])

  const saveAction = () => {
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

  // 监听triggerSave变化
  useEffect(() => {
    console.log('actions?.triggerSave', actions?.triggerSave)
    if (actions?.triggerSave && actions.triggerSave > 0) {
      saveAction()
    }
  }, [actions?.triggerSave])

  // 监听triggerRefresh变化
  useEffect(() => {
    console.log('actions?.triggerRefresh', actions?.triggerRefresh)
    if (actions?.triggerRefresh && actions.triggerRefresh > 0) {
      refreshAction()
    }
  }, [actions?.triggerRefresh])

  return (
    <div className="shareholderchart-box">
      {!loading ? (
        !mapData || actions ? null : (
          <div className="shareholderchart-nav">
            <div className="shareholderchart-icons">
              <SaveO onClick={saveAction} data-uc-id="Ec34ywstd" data-uc-ct="saveo" />
              <RefreshO onClick={refreshAction} data-uc-id="aSCRsLGDmv" data-uc-ct="refresho" />
            </div>
          </div>
        )
      ) : null}
      {!loading ? (
        !mapData ? (
          <div className="shareholderchart-empty">{window.en_access_config ? 'No Data' : '暂无持股路径数据'}</div>
        ) : (
          <>
            <div ref={domRef} style={{ width: '100%', height: '100%', background: '#fff' }} className="chart-cgx"></div>
            <div className="shareholderchart-bottom">
              {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
            </div>
          </>
        )
      ) : (
        <Spin className="shareholderchart-loading" tip="Loading..."></Spin>
      )}
    </div>
  )
}

function ShareholderGraph({ actions }) {
  const [preInputLeft, setPreInputLeft] = useState(null)
  const [preInputRight, setPreInputRight] = useState(null)
  const [showChart, setShowChart] = useState(false)
  const [relativeType, setRelativeType] = useState('')
  const [nodes, setNodes] = useState({})
  const [forceUpdate, setForceUpdate] = useState(Date.now())
  const exampleCodesOne = [
    {
      name: '北京百度网讯科技有限公司',
      id: '1015492834',
    },
    {
      name: '北京百慧聚鑫投资合伙企业（有限合伙）',
      id: '1201523198',
    },
  ]

  const gotoSample = () => {
    setPreInputLeft(exampleCodesOne[0])
    setPreInputRight(exampleCodesOne[1])
    setNodes({
      left: exampleCodesOne[0],
      right: exampleCodesOne[1],
    })

    setTimeout(() => {
      setShowChart(true)
    }, 50)
  }
  const gotoSearch = () => {
    if (preInputLeft && preInputRight) {
      setRelativeType('')
      setNodes({
        left: preInputLeft,
        right: preInputRight,
      })
      setForceUpdate(Date.now())
      setTimeout(() => {
        setShowChart(true)
      }, 50)
    } else {
      message.info('请选择双方企业!')
    }
  }

  useEffect(() => {
    // todo 持股路径埋点，缺省，先用查关系记录，参数上区分
    // 查关系- 探查
    pointBuriedGel('922602100665', '持股路径', 'cgljView', {
      opActive: 'loading',
      currentPage: 'cgljView',
      opEntity: '持股路径',
    })
  }, [])

  return (
    <div className="shareholdergraph-chart-container">
      <Row type="flex" className="search-relation-input">
        <PreInput defaultValue={preInputLeft?.name} selectItem={setPreInputLeft} needRealCode={true}></PreInput>
        <span className="icon-search-relation"></span>
        <PreInput defaultValue={preInputRight?.name} selectItem={setPreInputRight} needRealCode={true}></PreInput>
        <Button size="default" type="primary" onClick={gotoSearch} data-uc-id="8FiQBDnMQr" data-uc-ct="button">
          {intl('437659', '探查')}
        </Button>
      </Row>
      {showChart ? null : (
        <div style={{ marginTop: '125px' }}>
          <div className="search-relation-label"> {intl('312993', '全面探查任意两个企业之间的持股结构')}</div>
          <Row type="flex" justify={'space-around'} className="search-relation-sample">
            <div
              onClick={() => {
                gotoSample()
              }}
              data-uc-id="CJeyxjzPGw"
              data-uc-ct="div"
            >
              <img src={demoPng} alt="" />
            </div>
          </Row>
        </div>
      )}
      {showChart ? (
        <div className="relation-chart-main">
          <ShareholderChartComp
            sourceNodes={nodes.left}
            targetNodes={nodes.right}
            relativeTypes={relativeType}
            forceUpdate={forceUpdate}
            actions={actions}
            data-uc-id="NrD66jePYE"
            data-uc-ct="shareholderchartcomp"
          ></ShareholderChartComp>
        </div>
      ) : null}
    </div>
  )
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

function changeTheData(data) {
  var pathObjs = {}
  var tmpData = {
    nodes: [],
    routes: [],
    endNodes: [],
  }
  var tnodes = {}
  data.routeList.forEach((path) => {
    path.forEach((node) => {
      if (!pathObjs[node['Id']]) {
        pathObjs[node['Id']] = [path]
      } else {
        pathObjs[node['Id']].push(path)
      }
      pathObjs[node['Id']]._pathCount = pathObjs[node['Id']].length

      if (!tnodes[node['Id']]) {
        tnodes[node['Id']] = node
      }
    })
  })

  for (var k in tnodes) {
    var addKeys = {}
    for (var i = 0; i < data.nodeList.length; i++) {
      var nd = data.nodeList[i]
      if (nd.Id === k && !addKeys[k]) {
        addKeys[k] = 1
        var tmpnd = {
          level: nd.depth,
          nodeId: nd.Id,
          nodeName: nd.name || 'node',
          nodeType: nd.type || 'company',
          windId: nd.Id,
          imageIdT: nd.imageIdT,
          actCtrl: nd.actCtrl,
          indirectRatio: wftCommon.formatPercent(nd.stockShare),
          benifciary: nd.benifciary ? nd.benifciary : false,
          pathCounts: pathObjs[nd.Id] ? pathObjs[nd.Id]._pathCount : 1, // 当前节点在几条path上出现过
        }
        if (!window.en_access_config) {
          if (CompanyChart.leftCompany == nd.Id) {
            tmpnd.nodeName = CompanyChart.leftCorpName
          }
        }
        tmpData.nodes.push(tmpnd)
      }
    }
  }

  data.relationList.forEach(function (nd) {
    var tmplink = {
      endId: nd.targetId,
      endNode: nd.targetId,
      props: wftCommon.formatPercent(nd.ratio),
      startId: nd.sourceId,
      startNode: nd.sourceId,
    }
    tmpData.routes.push(tmplink)
  })

  data.routeList.forEach(function (path) {
    tmpData.endNodes.push(path[0].Id)
  })
  tmpData.pathObjs = pathObjs
  data.nodes = tmpData.nodes
  data.routes = tmpData.routes
  data.endNodes = tmpData.endNodes
  data.pathObjs = tmpData.pathObjs
  return tmpData
}

export default ShareholderGraph
