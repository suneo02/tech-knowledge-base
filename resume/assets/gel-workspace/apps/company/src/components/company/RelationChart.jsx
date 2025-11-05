/** @format */

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Button, Col, Row, Spin } from '@wind/wind-ui'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import styled from 'styled-components'
import { getGroupDataApi } from '../../api/groupApi'
import { useGroupStore } from '../../store/group'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { gqctLabelSecond, gqctLabelFirst } from '../../views/Charts/utils'
import { linkToCompany } from '../../views/Charts/handle'

let CompanyChart = {}

function RelationshipChart(props) {
  const { basicInfo } = useGroupStore()
  const groupName = basicInfo?.groupSystemName
  const groupId = basicInfo.groupSystemId
  const [loading, setLoaded] = useState(true)
  const domRef = useRef(null)

  let companyCode = null
  if (companyCode && companyCode.length > 10) {
    companyCode = companyCode.substr(2, 10)
  }

  const handleAjaxData = (res, call) => {
    setLoaded(false)

    if (res && res.Data && (res.Data.shareHolderTree || res.Data?.investTree)) {
      if (window.en_access_config) {
        let count = 0
        wftCommon.zh2en(
          res.Data.shareHolderTree,
          (data) => {
            res.data.shareHolderTree = data
            res.Data.shareHolderTree = data
            count++
            if (count == 2) {
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
            if (res.data?.investTree) {
              res.data.investTree = data
            }

            res.Data.investTree = data
            count++
            if (count == 2) {
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
    } else {
      call({})
    }
  }

  const getAjaxData = (param, call) => {
    !loading && setLoaded(true)
    getGroupDataApi(props.api, { groupId }).then((res) => {
      const { Data } = res
      // let investTree = []
      if (Data?.investTree && !Array.isArray(Data.investTree)) {
        Data.investTree = Data.investTree.children
      }
      handleAjaxData(res, call)
    })
  }

  const redirectToChart = () => {
    pointBuriedByModule(922602100984)
    const url = `GroupChart.html?groupId=${groupId}&groupName=${groupName}#chart_newgqct`
    wftCommon.jumpJqueryPage(url)
  }

  const _refreshLists = (d) => {
    if (d.type === 'company') {
      return linkToCompany(d.Id, true, false, false)
    }
  }

  const [data, setData] = useState(null)

  const freshChart = (fresh) => {
    fresh && document.querySelector('.gqct-graph-content').removeChild(document.querySelector('.relatedsvg'))
    getAjaxData({ groupId }, (res) => {
      // // console.log(res);
      if (res?.Data) {
        setData(res.Data)
      }
    })
  }

  useEffect(() => {
    freshChart()
  }, [])

  useEffect(() => {
    processingData()
  }, [data])

  const processingData = () => {
    if (data == null || data.length == 0) {
      return false
    }
    let rootData = Object.assign({}, data)
    if (
      (rootData.investTree && rootData.investTree.length) ||
      (rootData.shareHolderTree && rootData.shareHolderTree.length)
    ) {
      rootData.name = groupName
      rootData.Id = groupId
      rootData.children = []
      rootData.shareHolderTree = rootData.shareHolderTree || {}
      // 1 将股权数据统一放置上方 添加isup标识
      // rootData.shareHolderTree = changeDataSchema(rootData.shareHolderTree);
      // 2 将股权、投资的子节点依次放置到根节点后
      rootData.shareHolderTree &&
        rootData.shareHolderTree.length &&
        rootData.shareHolderTree.map(function (t) {
          rootData.children.push(t)
        })
      rootData.investTree = rootData.investTree || {
        children: [],
      }
      rootData.investTree.map(function (t) {
        rootData.children.push(t)
      })
      rootData = changeThirdData(rootData)
      drawThird(rootData)
    }
  }

  function thirdSaveEvent(e) {
    var serializer = new XMLSerializer()
    var svgCopy = document.querySelector('.relatedsvg')
    var toExport = svgCopy.cloneNode(true)
    var bb = svgCopy.getBBox()
    // toExport.setAttribute('background', 'url(../images/Company/sy.png) no-repeat center center;');
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
    // shuiying.src = '../resource/images/Company/sy2.png?t=' + (Date.now()).toString();
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
        // context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
        var wlen = canvas.width / 10
        var hlen = canvas.height / 8
        wlen = wlen < 238 ? 238 : wlen
        hlen = hlen < 238 ? 238 : hlen
        for (var x = 10; x < canvas.width; x += wlen) {
          for (var y = 10; y < canvas.height; y += hlen) {
            context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
          }
        }
        let a = document.createElement('a')
        a.download = groupName + '_股权穿透' + '.png'
        a.href = canvas.toDataURL('image/jpeg', qual)
        a.click()
      })
    }
    return
  }

  function changeThirdData(val) {
    var data = {}
    data.investTree = {
      Id: groupId,
      depth: 0,
      name: groupName,
      children: val.investTree && val.investTree.length ? val.investTree : [],
    }
    data.shareHolderTree = {
      Id: groupId,
      depth: 0,
      name: groupName,
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
        if (d.listed || d.issued || d.newInRecentYear) {
          d._multiline = true // 有标签 展示多行
        }
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
    data._namelen = data.name?.length ? data.name.length : 0
    if (data.listed || data.issued || data.newInRecentYear) {
      if (data.depth) {
        data._multiline = true
      }
    }
    return data
  }

  const drawThird = (demodata) => {
    let pLeft = domRef.current.offsetLeft || 0
    let initW = document.getElementsByClassName('gqct-graph-content')[0].offsetWidth // 16 对应 paddingleft
    let initH = document.getElementsByClassName('gqct-graph-content')[0].offsetHeight
    let widthFromLeftScreen = initW + pLeft + 16
    let duration = 400,
      childNum = 2,
      // 节点矩形宽度
      rectWidth = 160,
      // 节点矩形高度
      rectHeight = 60,
      // 图形之间的水平间隙
      gapX = 100,
      // 图形之间的竖直间隙
      gapY = 250
    let zoom = null
    let data1 = demodata.shareHolderTree
    let data2 = demodata.investTree
    var lockTime = Date.now()

    var investChartId = 0
    var shareholderChartId = 0

    var defaultSize = 11
    if (defaultSize) {
      if (data1.children && data1.children.length > defaultSize - 1) {
        data1.children[defaultSize - 1] = {}
        data1.children[defaultSize - 1].Id = '$$$1'
        data1.children[defaultSize - 1].name = window.en_access_config ? 'More' : '更多节点，点击查看'
        data1.children[defaultSize - 1].type = 'more'
        data1.children.length = defaultSize
      }
      if (data2.children && data2.children.length > defaultSize - 1) {
        data2.children[defaultSize - 1] = {}
        data2.children[defaultSize - 1].Id = '$$$2'
        data2.children[defaultSize - 1].name = window.en_access_config ? 'More' : '更多节点，点击查看'
        data2.children[defaultSize - 1].type = 'more'
        data2.children.length = defaultSize
      }
    }

    initCharts()
    function initCharts() {
      // 1 绘制svg 画布
      // if(document.getElementsByClassName('relatedsvg').length>0){
      //     // // console.log(d3.select('.graph-content'));
      //     // console.log( d3);

      // }else{
      drawsvg()

      // }

      // 2. 绘制图形;
      // if (data1.children && data1.children.length || (data2.children && data2.children.length)) { // children.length不同时为0
      //    setTimeout(() => {

      drawRight()
      //     }, 200); // 绘制图形
      // }

      function drawsvg() {
        d3.select('svg').remove()
        let svg = d3
          .select('.gqct-graph-content')
          .append('svg')
          .attr('class', 'relatedsvg')
          .attr('viewBox', [-widthFromLeftScreen / 2 + 200, -initH / 2 + 20, initW, initH])
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', initW)
          .attr('height', initH)
        let g = svg.append('g').attr('class', 'gBox') // 用来承载 svg子元素 做移动处理

        let zooms = d3.behavior.zoom().scaleExtent([0.7, 1.5]).on('zoom', zoomed)
        zoom = zooms
        svg.call(zoom)
        CompanyChart.zoom = zoom
        CompanyChart.container = g
        svg.call(zoom).on('dblclick.zoom', null) // 去除鼠标双击放大效果

        function zoomed() {
          g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
        }
      }

      function getAllNodes(data, obj) {
        data.id = ++investChartId
        var list = obj.list || []
        if (window.en_access_config) {
          data._nameIsEn = true
        } else {
          if (data.name.charCodeAt(0) < 255 && data.name.charCodeAt(data.name.length - 1) < 255) {
            data._nameIsEn = true
          }
        }
        data._namelen = data._nameIsEn ? data.name.length / 2 : data.name.length
        if (data.listed || data.issued || data.newInRecentYear) {
          data._multiline = true // 有标签 展示多行
        }
        var list = obj.list || []
        if (data.children && data.children.length) {
          obj.list = list.concat(data.children)
          data.children.forEach((t) => {
            getAllNodes(t, obj)
          })
        }
      }

      function getAllNodesLeft(data, obj) {
        data.id = ++shareholderChartId
        var list = obj.list || []
        // data._namelen = data.name.length;
        if (window.en_access_config) {
          data._nameIsEn = true
        } else {
          if (data.name.charCodeAt(0) < 255 && data.name.charCodeAt(data.name.length - 1) < 255) {
            data._nameIsEn = true
          }
        }
        data._namelen = data._nameIsEn ? data.name.length / 2 : data.name.length
        if (data.listed || data.issued || data.newInRecentYear) {
          data._multiline = true // 有标签 展示多行
        }
        if (data.children && data.children.length) {
          obj.list = list.concat(data.children)
          data.children.forEach((t) => {
            getAllNodesLeft(t, obj)
          })
        }
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
      function drawRight() {
        traverseTreeId(data1)
        traverseTreeId(data2)
        var root = _initTreeData(data1, 'r') // 右边
        var root1 = _initTreeData(data2, 'l') // 左边
        // 公司名称过长的话要换行
        // 中文的话超过15就直接截断换行
        // 英文的话超过25就按照空格截断换行
        // 暂时简单处理
        var showNameArr = []
        if (/^[\u4e00-\u9fa5-（-）]+$/g.test(root.name)) {
          // 只含中文以及中文括号
          var name = root.name,
            len = name.length,
            minLen = 15,
            n = (len / minLen) >> 0
          showNameArr.push(name.slice(0, 16))
          for (var i = 1; i < n; i += 1) {
            var tmp = name.slice(15 * i + 1, 15 * i + 16)
            tmp && showNameArr.push(tmp)
          }
          if (n && len > n * minLen) {
            showNameArr.push(name.slice(n * minLen + 1))
          }
        }
        if (/^[a-zA-Z0-9-\s]+$/g.test(root.name)) {
          // 只含英文以及空格
          var name = root.name,
            nameArr = name?.split(' '),
            len = nameArr.length
          var i = 0,
            j = 1
          while (j + 1 < len) {
            var tmp = nameArr.slice(i, j + 1).join(' ')
            if (tmp.length >= 25) {
              showNameArr.push(tmp)
              i = j
              j = i + 1
            } else {
              j += 1
            }
          }
        }
        var g = d3.select('.gBox')
        var cluster = d3.layout
          .tree()
          .nodeSize([200, 150])
          .separation((a, b) => {
            return 1
          })
        // node节点
        var gnode = g.append('g').attr('class', 'gnode')
        var glink = g.append('g').attr('class', 'glink') // 子元素向左边延伸的线

        // ========= 右边节点结构
        var gnode2 = g.append('g').attr('class', 'gnode') // 动画用
        var glinks2 = g.append('g').attr('class', 'glinks') // 动画用

        var borderColor = '#90bbd0'
        var borderPersonColor = '#fac38b'
        var ipoBgColor = '#dad0e6'
        var ipoColor = '#8662AC'
        var deptBgColor = '#d0e2d5'
        var deptColor = '#63A074'
        var newcorpBgColor = '#F9D6D7'
        var newcorpColor = '#DF262C'
        var zxCorpBgColor = '#f4f4f4'
        var zxCorpColor = '#333'

        var _toggle = (d, bol) => {
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
              update(d)
            } else {
              updateLeft(d)
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
              update(d, d._children && d._children.length ? true : false)
            } else {
              updateLeft(d, d._children && d._children.length ? true : false)
            }
            return
          }
          if (!bol) {
            getThirdData(d)
          } else {
            getThirdData(d, bol)
          }
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

          // --------------------------------------------------------------------------------------
          // 上市 标识
          var tagIpoRects = nodeEnter
            .filter(function (t) {
              return t.listed
            })
            .append('rect')
            .attr('class', 'corp_tag_ipo')
            .attr('x', 5)
            .attr('y', 35)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', window.en_access_config ? 45 : 40)
            .attr('fill', ipoBgColor)
          var tagIpoTexts = nodeEnter
            .filter(function (t) {
              return t.listed
            })
            .append('text')
            .attr('class', 'ipotext')
            .attr('fill', ipoColor)
            .attr('font-size', '12px')
            .attr('y', 50)
            .attr('x', 13)
          tagIpoTexts.append('tspan').text(function (t) {
            return '上市'
          })

          // --------------------------------------------------------------------------------------
          // 发债标识
          var tagDebtRects = nodeEnter
            .filter(function (t) {
              return t.issued
            })
            .append('rect')
            .attr('class', 'corp_tag_debt')
            .attr('x', function (t) {
              var distance = 5
              if (t.listed) {
                distance = 50
              }
              return distance
            })
            .attr('y', 35)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', window.en_access_config ? 45 : 40)
            .attr('fill', deptBgColor)
          var tagDebtTexts = nodeEnter
            .filter(function (t) {
              return t.issued
            })
            .append('text')
            .attr('class', 'debttext')
            .attr('fill', deptColor)
            .attr('font-size', window.en_access_config ? '10px' : '12px')
            .attr('y', 50)
            .attr('x', function (t) {
              var distance = 13
              if (t.listed) {
                distance = 58
              }
              return distance
            })
          tagDebtTexts.append('tspan').text(function (t) {
            return window.en_access_config ? 'Bonded' : intl('259109', '发债')
          })

          // --------------------------------------------------------------------------------------
          // 新进/注销 标识
          var tagNewRects = nodeEnter
            .filter(function (t) {
              if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) return true
              return t.newInRecentYear
            })
            .append('rect')
            .attr('class', 'corp_tag_newin')
            .attr('x', function (t) {
              return t.reg_status && t.reg_status.length < 5 ? 120 : 100
            })
            .attr('y', 40)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', function (t) {
              return t.reg_status && t.reg_status.length < 5 ? 40 : 60
            })
            .attr('fill', function (t) {
              return wftCommon.unNormalStatus.indexOf(t.reg_status) > -1 ? '#c5c5c5' : newcorpBgColor
            })
            .attr('fill-opacity', '0.6')
          var tagNewTexts = nodeEnter
            .filter(function (t) {
              if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) return true
              return t.newInRecentYear
            })
            .append('text')
            .attr('class', 'newintext')
            .attr('fill', function (t) {
              return wftCommon.unNormalStatus.indexOf(t.reg_status) > -1 ? '#666' : newcorpColor
            })
            .attr('font-size', '12px')
            .attr('y', 54)
            .attr('x', function (t) {
              if (t.reg_status && t.reg_status.length == 4) {
                return 120
              }
              if (t.newInRecentYear) return 130
              return t.reg_status && t.reg_status.length < 5 ? 130 : 110
            })
          tagNewTexts.append('tspan').text(function (t) {
            if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) {
              return t.reg_status.length < 4
                ? t.reg_status
                : window.en_access_config
                  ? intl('36489', '注销')
                  : '注/吊销'
            }
            return window.en_access_config ? 'New' : '新进'
          })

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
            .attr('cy', 69)
            .attr('fill', function (d) {
              return '#fff'
            })
            .attr('stroke', function (d) {
              return '#2277a2'
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
            .attr('fill', '#2277a2')
            .attr('stroke', '#2277a2')
            .attr('stroke-width', '0.1')
            .attr('transform', `translate(80,69)`)
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

          nodeEnter
            .filter(function (d) {
              return d.depth !== 0
            })
            .append('path')
            .attr('fill', '#c5c5c5')
            .attr('target-hover-arrow', function (d) {
              return d.code + '|' + d.depth
            })
            .attr('target-hover-arrow-child', function (d) {
              if (d.parent && d.parent.depth) {
                // console.log(d.parent)
                return d.parent.code + '|' + d.parent.depth
              }
            })
            .attr('d', function (d) {
              return 'M75 -10 L80 0 L85 -10Z'
            })

          nodeEnter
            .filter((d) => d.depth == 0)
            .append('rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .attr('fill', '#2277A2')
            .style('opacity', '1')
            .attr('stroke', function (d) {
              return d.type == 'bond' ? '#ddd' : '#90bbd0'
            })
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .attr('rx', 2)
            .attr('ry', 2)

          var rectBoxG = nodeEnter.append('g').attr('class', 'react-box-g')

          var reactBoxChild = rectBoxG
            .filter((d) => d.depth > 0)
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

          var labelTxts = rectBoxG
            .append('text')
            .attr('dx', (d) => {
              if (d.depth == 0) {
                return rectWidth / 2
              }
              return window.en_access_config ? 5 : 10
            })
            .attr('dy', (d) => {
              if (d._multiline) {
                if (d._namelen > 12) {
                  return 13
                }
                return 20
              }
              if (d._namelen > 10) {
                return 25
              }
              return 35
            })

          labelTxts
            .append('tspan')
            .style('font-size', (d) => {
              if (d.depth == 0) return window.en_access_config ? 14 : 16
              if (d._multiline) {
                if (d._namelen > 10) {
                  return 11
                } else {
                  return 14
                }
              } else {
                if (d._namelen > 20) {
                  return 11
                }
              }
              return 14
            })
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
            .style('font-size', (d) => {
              if (d.depth == 0) return window.en_access_config ? 14 : 16
              if (d._multiline) {
                if (d._namelen > 10) {
                  return 11
                } else {
                  return 14
                }
              } else {
                if (d._namelen > 20) {
                  return 11
                }
              }
              return 14
            })
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
              return d.depth ? (window.en_access_config ? 5 : 10) : 80
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
              if (d.type == 'more') return ''
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
            .attr('y', -15)
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
              return d.target.code + '|' + d.target.depth
            })
            .attr('path-id', function (t) {
              return t.source.Id + '|' + t.target.code
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
              var a1 = 'M' + (d.source.x + rectWidth / 2) + ',' + (d.source.y + rectHeight + (d.source.depth ? 20 : 0))
              var a2 =
                'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a4 =
                'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a5 = 'L' + (d.target.x + rectWidth / 2) + ',' + d.target.y
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
              var a1 = 'M' + (d.source.x + rectWidth / 2) + ',' + (d.source.y + rectHeight + (d.source.depth ? 20 : 0))
              var a2 =
                'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a4 =
                'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a5 = 'L' + (d.target.x + rectWidth / 2) + ',' + d.target.y
              return a1 + a2 + a4 + a5
            })
          var linkexit = linkP3.exit()
          linkexit.remove()
          descendants.forEach((d) => {
            d.x0 = d.x
            d.y0 = d.y
          })
        }

        var updateLeft = (source, removeSonTree) => {
          var nodess2 = cluster.nodes(root)
          var links2 = cluster.links(nodess2)
          var tmp = { list: [demodata.shareHolderTree] }
          getAllNodesLeft(demodata.shareHolderTree, tmp)
          cluster(root) // 计算左边的树形结构
          var descendants2 = tmp.list
          var vertical2 = [],
            minY = 0,
            maxY = 0
          descendants2.forEach((d, i) => {
            d.y *= -1
          }) // 初始计算的时候是 右边的树形结构，乘以-1变成左边的树形结构
          descendants2.forEach((d, i) => {
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

          nodeEnter2
            .filter(function (d) {
              if (!d.depth) return false
              return (d.children && d.children.length) || (d._children && d._children.length) || d.spread
            })
            .append('circle')
            .attr('class', 'ctrl_circle')
            .attr('r', 8)
            .attr('cx', 80)
            .attr('cy', -9)
            .attr('fill', function (d) {
              return '#fff'
            })
            .attr('stroke', function (d) {
              return '#2277a2'
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
            .attr('fill', '#2277a2')
            .attr('stroke', '#2277a2')
            .attr('stroke-width', '0.1')
            .attr('transform', `translate(80,-9)`)
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

          // --------------------------------------------------------------------------------------
          // 上市 标识
          var tagIpoRects = nodeEnter2
            .filter(function (t) {
              return t.listed
            })
            .append('rect')
            .attr('class', 'corp_tag_ipo')
            .attr('x', 5)
            .attr('y', 35)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', window.en_access_config ? 45 : 40)
            .attr('fill', ipoBgColor)
          var tagIpoTexts = nodeEnter2
            .filter(function (t) {
              return t.listed
            })
            .append('text')
            .attr('class', 'ipotext')
            .attr('fill', ipoColor)
            .attr('font-size', '12px')
            .attr('y', 50)
            .attr('x', 13)
          tagIpoTexts.append('tspan').text(function (t) {
            return intl('258784', '上市')
          })

          // --------------------------------------------------------------------------------------
          // 发债标识
          var tagDebtRects = nodeEnter2
            .filter(function (t) {
              return t.issued
            })
            .append('rect')
            .attr('class', 'corp_tag_debt')
            .attr('x', function (t) {
              var distance = 5
              if (t.listed) {
                distance = 50
              }
              return distance
            })
            .attr('y', 35)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', window.en_access_config ? 45 : 40)
            .attr('fill', deptBgColor)

          var tagDebtTexts = nodeEnter2
            .filter(function (t) {
              return t.issued
            })
            .append('text')
            .attr('class', 'debttext')
            .attr('fill', deptColor)
            .attr('font-size', window.en_access_config ? '10px' : '12px')
            .attr('y', 50)
            .attr('x', function (t) {
              var distance = 13
              if (t.listed) {
                distance = 58
              }
              return distance
            })
          tagDebtTexts.append('tspan').text(function (t) {
            return window.en_access_config ? 'Bonded' : intl('259109', '发债')
          })

          // --------------------------------------------------------------------------------------
          // 新进/注销 标识
          var tagNewRects = nodeEnter2
            .filter(function (t) {
              if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) return true
              return t.newInRecentYear
            })
            .append('rect')
            .attr('class', 'corp_tag_newin')
            .attr('x', 120)
            .attr('y', 40)
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', 40)
            .attr('fill', function (t) {
              return wftCommon.unNormalStatus.indexOf(t.reg_status) > -1 ? '#c5c5c5' : newcorpBgColor
            })
            .attr('fill-opacity', '0.6')
          var tagNewTexts = nodeEnter2
            .filter(function (t) {
              if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) return true
              return t.newInRecentYear
            })
            .append('text')
            .attr('class', 'newintext')
            .attr('fill', function (t) {
              return wftCommon.unNormalStatus.indexOf(t.reg_status) > -1 ? '#666' : newcorpColor
            })
            .attr('font-size', '12px')
            .attr('y', 54)
            .attr('x', function (t) {
              if (t.reg_status && t.reg_status.length == 4) {
                return 120
              }
              if (t.newInRecentYear) return 130
              return t.reg_status && t.reg_status.length < 5 ? 130 : 110
            })
          tagNewTexts.append('tspan').text(function (t) {
            if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) {
              return t.reg_status.length < 4
                ? t.reg_status
                : window.en_access_config
                  ? intl('36489', '注销')
                  : '注/吊销'
            }
            return window.en_access_config ? 'New' : '新进'
          })

          // --------------------------------------------------------------------------------------
          // 实际控制人 标识
          var tagCtrlRects = nodeEnter2
            .filter(function (t) {
              return t.actCtrl
            })
            .append('rect')
            .attr('class', 'corp_tag_ctrl')
            .attr('x', function (t) {
              return 0
            })
            .attr('y', function (t) {
              return 60
            })
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', 80)
            .attr('fill', function (t) {
              return '#f68717'
            })
            .attr('fill-opacity', '0.6')

          var tagCtrlTexts = nodeEnter2
            .filter(function (t) {
              return t.actCtrl
            })
            .append('text')
            .attr('class', 'ctrltext')
            .attr('fill', '#ffffff')
            .attr('font-size', '12px')
            .attr('y', function (t) {
              return 75
            })
            .attr('x', function (t) {
              return 10
            })
          tagCtrlTexts.append('tspan').text(function (t) {
            if (t.actControlType == 'A0774') {
              return intl('13270', '实际控制人')
            } else {
              return intl('261456', '疑似实控人')
            }
          })
          // --------------------------------------------------------------------------------------
          // 最终受益人 标识
          var tagBenRects = nodeEnter2
            .filter(function (t) {
              return t.benifciary
            })
            .append('rect')
            .attr('class', 'corp_tag_ctrl')
            .attr('x', function (t) {
              if (t.actCtrl) return 80
              return 0
            })
            .attr('y', function (t) {
              return 60
            })
            .attr('ry', 2)
            .attr('rx', 2)
            .attr('height', 20)
            .attr('width', 80)
            .attr('fill', function (t) {
              return '#2277a2'
            })
            .attr('fill-opacity', '0.6')
          var tagBenTexts = nodeEnter2
            .filter(function (t) {
              return t.benifciary
            })
            .append('text')
            .attr('class', 'ctrltext')
            .attr('fill', '#ffffff')
            .attr('font-size', '12px')
            .attr('y', function (t) {
              return 75
            })
            .attr('x', function (t) {
              if (t.actCtrl) return 80 + 10
              return 10
            })
          tagBenTexts.append('tspan').text(intl('138180', '最终受益人'))

          nodeEnter2
            .filter(function (d) {
              return d.depth !== 0
            })
            .append('path')
            .attr('fill', '#c5c5c5')
            .attr('target-hover-arrow', function (d) {
              return (d.code || '') + '|' + d.depth
            })
            .attr('target-hover-arrow-child', function (d) {
              if (d.parent && d.parent.depth) {
                return d.parent.code + '|' + d.parent.depth
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
            .attr('fill', '#2277A2')
            .style('opacity', '1')
            .attr('stroke', function (d) {
              return d.type == 'bond' ? '#ddd' : '#90bbd0'
            })
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .attr('rx', 2)
            .attr('ry', 2)

          var rectBoxG2 = nodeEnter2.append('g').attr('class', 'react-box-g')

          var reactBoxChild2 = rectBoxG2
            .filter((d) => d.depth > 0)
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
            .append('title')
            .text((d) => {
              var t = d.name
              return t
            })

          var labelTxts = rectBoxG2
            .append('text')
            .attr('dx', (d) => {
              if (d.depth == 0) {
                return rectWidth / 2
              }
              return window.en_access_config ? 5 : 10
            })
            .attr('dy', (d) => {
              if (d._multiline) {
                if (d._namelen > 12) {
                  return 13
                }
                return 20
              }
              if (d._namelen > 10) {
                return 25
              }
              return 35
            })

          labelTxts
            .append('tspan')
            .style('font-size', (d) => {
              if (d.depth == 0) return window.en_access_config ? 14 : 16
              if (d._multiline) {
                if (d._namelen > 10) {
                  return 11
                } else {
                  return 14
                }
              } else {
                if (d._namelen > 20) {
                  return 11
                }
              }
              return 14
            })
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
            .style('font-size', (d) => {
              if (d.depth == 0) return window.en_access_config ? 14 : 16
              if (d._multiline) {
                if (d._namelen > 10) {
                  return 11
                } else {
                  return 14
                }
              } else {
                if (d._namelen > 20) {
                  return 11
                }
              }
              return 14
            })
            .style('cursor', 'pointer')
            .style('font-weight', (d) => (!d.depth ? 'bold' : 'normal'))
            .on('click', function (d) {
              d.depth && d.Id && _refreshLists(d)
            })
            .text(gqctLabelSecond)
            .style('text-anchor', (d) => (d.depth == 0 ? 'middle' : 'start')) // .attr('fill',d=>d.data.color)
            .attr('fill', (d) => (d.depth == 0 ? '#fff' : '#333'))
            .attr('x', function (d) {
              return d.depth ? (window.en_access_config ? 5 : 10) : 80
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
              if (d.type == 'more') return ''
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
              return d.target.code + '|' + d.target.depth
            })
            .attr('path-id', function (t) {
              return t.source.Id + '|' + t.target.code
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
              var a1 = 'M' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + rectHeight)
              var a2 =
                'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a4 =
                'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a5 = 'L' + (d.source.x + rectWidth / 2) + ',' + (d.source.y - (d.source.depth ? 20 : 0))
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
              var a1 = 'M' + (d.target.x + rectWidth / 2) + ',' + (d.target.y + rectHeight)
              var a2 =
                'L' + (d.target.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a4 =
                'L' + (d.source.x + rectWidth / 2) + ',' + ((d.target.y - d.source.y) / 2 + d.source.y + rectHeight / 2)
              var a5 = 'L' + (d.source.x + rectWidth / 2) + ',' + (d.source.y - (d.source.depth ? 20 : 0))
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
          descendants2.forEach((d) => {
            d.x0 = d.x
            d.y0 = d.y
          })
        }
        update(root1)
        updateLeft(root)
        CompanyChart._thirdUpdate = update
        CompanyChart._thirdUpdateLeft = updateLeft
      }
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

  function handleThirdApi(res, d, left) {
    // console.log(res)
    function call(endata, newdata) {
      var data = null
      data = newdata ? newdata : endata
      try {
        // 数据结构转换
        var changeDataSchema = function (data) {
          data.isup = 1
          if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
              var t = data[i]
              changeDataSchema(t)
            }
          }
          return data
        }
        if (d) {
          d.children = data
          if (!left) {
            CompanyChart._thirdUpdate(d)
          } else {
            CompanyChart._thirdUpdateLeft(d)
          }
        }
      } catch (e) {
        // console.log(e)
      }
    }
    setLoaded(false)

    if (window.en_access_config) {
      wftCommon.zh2en(res.Data, (res) => {
        call(res.Data, null)
      })
    } else {
      call(res.Data, null)
    }
  }

  function getThirdData(d, left) {
    !loading && setLoaded(true)

    /** 这个地方很特殊 */
    if (!d.Id) return
    const id = d.Id.slice(2, 12)
    getGroupDataApi(props.api, { corpId: id, groupId }).then((res) => {
      if (res?.Data?.investTree?.children?.length) {
        handleThirdApi({ Data: res.Data.investTree.children }, d, left)
      } else {
        handleThirdApi(res, d, left)
      }
    })
  }

  return (
    <div style={{ marginBottom: '32px', overflow: 'hidden' }} ref={domRef}>
      <Box className="gqct-chart">
        <Row className="gqct-header">
          <Col span="18" className="gqct-header-name">
            {window.en_access_config ? window.__GELgroupNAMEEN__ : props.groupname}
          </Col>
          <Col className="gqct-header-btn">
            <Button
              onClick={() => {
                redirectToChart()
              }}
            >
              {intl('437439', '全屏查看')}
            </Button>
            <Button
              onClick={() => {
                freshChart(1)
              }}
            >
              {intl('138765', '还原')}
            </Button>
            <Button
              onClick={(e) => {
                thirdSaveEvent(e)
              }}
            >
              {intl('421570', '保存图片')}
            </Button>
          </Col>
        </Row>

        <div
          className="gqct-graph-content"
          style={!loading && !data ? { height: '84px', borderLeft: 'none', borderRight: 'none' } : null}
        >
          {loading ? <Spin className="gqct-spin"></Spin> : null}

          {!loading && !data ? (
            <div className="wind-ui-table-empty">
              <span>
                {' '}
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
                )}{' '}
                {intl('132725', '暂无数据')}
              </span>
            </div>
          ) : null}
        </div>
      </Box>
    </div>
  )
}

const Box = styled.div`
  //   margin-bottom: 52px;
  margin-top: 12px;

  .gqct-graph-content {
    width: 100%;
    height: 430px;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    border-left: 1px solid #dfdfdf;
    border-right: 1px solid #dfdfdf;
    // background: rgba(0,0,0,0.05);
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
      &:last-child {
        // margin-right: 0;
      }
    }
  }
  .tspan-- {
    display: none;
  }
  .gqct-graph-tips {
    margin-bottom: -30px;
    color: #999;
  }
  . window-locale-en-US {
  }
  .gqct-spin {
    line-height: 400px;
  }
`
export default RelationshipChart
