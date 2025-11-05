import * as d3 from 'd3'
import { wftCommon } from '../../utils/utils'
import { renderToStaticMarkup } from 'react-dom/server'
import { actCtrl, benifciary, actor1, actor2, actor3, actor4, actor5, actor6 } from './svg'
import intl from '../../utils/intl'

/**
 * 图标类型的枚举对象，定义了不同的图标类型常量。,值是对应的取值字段，不可更改
 * @typedef {Object} IconTypeEnum
 */
export const IconTypeEnum = {
  /**
   * 最终受益人
   * @type {string}
   */
  BENIFCIARY: 'benifciary',
  /**
   * 一致行动人
   * @type {string}
   */
  ACTOR: 'actor',
  /**
   * 实际控制人
   * @type {string}
   */
  ACTCTRL: 'actCtrl',
}
export const TagTypeEnum = {
  LISTED: 'listed', // 上市
  ISSUED: 'issued', // 发债
  NEWINRECENTYEAR: 'newInRecentYear', //新进
}

export const sourceData = [
  { name: '实际控制人', key: IconTypeEnum.ACTCTRL, imageUrl: actCtrl, label: intl('419991', '实际控制人') },
  { name: '最终受益人', key: IconTypeEnum.BENIFCIARY, imageUrl: benifciary, label: intl('138180', '最终受益人') },
  {
    name: '一致行动人',
    key: IconTypeEnum.ACTOR,
    imageUrl: [actor1, actor2, actor3, actor4, actor5, actor6],
    label: intl('419912', '一致行动人,编号一致的为一组关系'),
  },
]

/**
 * 将string格式的svg转img，添加到SVG容器中
 * @param {str} imageUrl
 * @returns
 */
export const svgRenderToImg = (imageUrl) => {
  const imgStr = renderToStaticMarkup(imageUrl)
  // 使用DOMParser将HTML字符串转换为DOM节点
  const parser = new DOMParser()
  const doc = parser.parseFromString(imgStr, 'image/svg+xml')
  // 使用XMLSerializer将DOM节点转换为SVG字符串
  const imgStrSerialized = new XMLSerializer().serializeToString(doc.documentElement)
  return imgStrSerialized
}

// 节点矩形宽度
export const rectWidth = 168,
  // 节点矩形高度
  rectHeight = 60,
  // 定义图片宽度
  imageWidth = 16,
  // 定义图片高度
  imageHeight = 16,
  // 定义图片之间的间距
  spacing = 10,
  // 定义border的间距
  borderWidth = 0

const tagColor = '#2277A2' //标签默认背景色
const textColor = '#fff' //标签文本色

const newcorpBgColor = '#E05D5D' //新进 背景色
const revokeBgColor = '#c5c5c5'
const width = 30 // 标签宽度
const height = 18 // 标签高度
const radius = 2 // 圆角
const tag_spacing = window.en_access_config ? 2 : 8 // 标签间距
const fontSize = '10px'

const padding_left = window.en_access_config ? 1 : 5
/**
 * 创建图标的函数，根据不同的类型在指定的矩形框内添加相应的图标。
 * @param {Array} rectBoxG2 - 包含数据的矩形框集合。绑定的数据对象应包含
 * actor:[]
 * benifciary:Boolean
 * actCtrl:Boolean
 * @param {IconTypeEnum} type - 图标类型，用于确定添加哪种图标。
 */
export const createIcon = (rectBoxG2, type, align = 'left') => {
  var startY = rectHeight - imageHeight - borderWidth

  var startX = rectWidth - imageWidth - borderWidth
  switch (type) {
    // 一致行动人
    case IconTypeEnum.ACTOR:
      var actorRectBoxG2 = rectBoxG2.filter(function (t) {
        return t[type]?.length
      })

      actorRectBoxG2[0].map((tt) => {
        const data = d3.select(tt).datum()
        const actor = data.actor
        const benifciary = data.benifciary ? 1 : 0
        const actCtrl = data.actCtrl ? 1 : 0
        actor.map((item, idx) => {
          d3.select(tt)
            .append('g')
            .attr('class', 'image')
            .attr('x', function (d, i, index) {
              if (align === 'left') {
                return spacing + (idx + benifciary + actCtrl) * (imageWidth + spacing)
              }
              // 起始位置最右边 往左边排
              return startX - idx * (imageWidth + spacing)
            })
            .attr('y', startY)
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .html((d, i) => {
              // 设置图像的来源，即URL
              const imageUrl = sourceData.find((i) => i.key === IconTypeEnum.ACTOR)?.imageUrl[item - 1 || 0]
              return svgRenderToImg(imageUrl)
            })
            .attr('transform', (d, i) => {
              let x = ''
              const y = startY
              if (align === 'left') {
                x = spacing + (idx + benifciary + actCtrl) * (imageWidth + spacing)
              } else {
                // 起始位置最右边 往左边排
                x = startX - idx * (imageWidth + spacing)
              }
              return `translate(${x}, ${y})scale(0.44444444)`
            })
        })
      })
      break
    case IconTypeEnum.BENIFCIARY:
      // 最终受益人
      var benifciaryRectBoxG2 = rectBoxG2.filter(function (t) {
        return t?.[type]
      })

      benifciaryRectBoxG2[0].map((tt) => {
        const data = d3.select(tt).datum()
        const actor = data.actor || []
        d3.select(tt)
          .append('g')
          .attr('class', 'image')
          .attr('x', function (d, i, index) {
            // 起始位置最右边 往左边排
            let rank = actor.length
            const actCtrl = data.actCtrl ? 1 : 0
            if (align === 'left') {
              return actCtrl * (imageWidth + spacing) + spacing
            }

            return startX - rank * (imageWidth + spacing)
          })
          .attr('y', startY + 1)
          .attr('width', imageWidth - 3)
          .attr('height', imageHeight - 3)
          .html((d, i) => {
            // 设置图像的来源，即URL
            const imageUrl = sourceData.find((i) => i.key === IconTypeEnum.BENIFCIARY)?.imageUrl
            return svgRenderToImg(imageUrl)
          })
          .attr('transform', (d, i) => {
            let x = ''
            const y = startY + 1
            let rank = actor.length
            const actCtrl = data.actCtrl ? 1 : 0
            if (align === 'left') {
              x = (imageWidth + spacing) * actCtrl + spacing
            } else {
              // 起始位置最右边 往左边排

              x = startX - rank * (imageWidth + spacing)
            }
            return `translate(${x}, ${y})scale(0.44444444)`
          })
      })
      break
    case IconTypeEnum.ACTCTRL:
      // 实际控制人
      var actCtrlRectBoxG2 = rectBoxG2.filter(function (t) {
        return t?.[type]
      })

      actCtrlRectBoxG2[0].map((tt) => {
        const data = d3.select(tt).datum() || {}
        const actor = data.actor || []
        const benifciary = data.benifciary ? 1 : 0
        d3.select(tt)
          .append('g')
          .attr('class', 'image')
          .attr('x', function (d, i, index) {
            if (align === 'left') {
              return spacing
            } else {
              // 起始位置最右边 往左边排
              let rank = actor.length + benifciary
              return startX - rank * (imageWidth + spacing)
            }
          })
          .attr('y', startY + 1)
          .attr('width', imageWidth - 3)
          .attr('height', imageHeight - 3)
          .html((d, i) => {
            // 设置图像的来源，即URL
            const imageUrl = sourceData.find((i) => i.key === IconTypeEnum.ACTCTRL)?.imageUrl
            return svgRenderToImg(imageUrl)
          })
          .attr('transform', (d, i) => {
            let x = ''
            const y = startY + 1
            if (align === 'left') {
              x = spacing
            } else {
              // 起始位置最右边 往左边排
              let rank = actor.length + benifciary
              x = startX - rank * (imageWidth + spacing)
            }
            return `translate(${x}, ${y})scale(0.44444444)`
          })
      })
    default:
      break
  }
}

/**
 * 创建标签
 * @param {Object} rectBoxG2 - 用于绑定标签的图形元素
 * @param {string} type - 标签的类型，有效值包括：
 *  - 'LISTED' 表示上市
 *  - 'ISSUED' 表示发债
 *  - 'NEWINRECENTYEAR' 表示新进/吊销
 */
export const createTag = (rectBoxG2, type) => {
  /**
   * 创建标签详细信息的函数
   * @param {Object} options - 创建标签的配置选项
   * @param {Object} options.node - 绑定标签的节点
   * @param {number|string|Function} options.x - 标签的x坐标或者计算x坐标的函数
   * @param {number|string|Function} options.y - 标签的y坐标或者计算y坐标的函数
   * @param {number} options.width - 标签的宽度
   * @param {number} options.height - 标签的高度
   * @param {string|Function} options.tagColor - 标签的颜色或者计算颜色的函数
   * @param {string|Function} options.text - 标签的文本或者计算文本的函数
   * @param {string} options.textColor - 标签文本的颜色
   * @param {Function} options.filter - 过滤节点的函数
   */

  const createTagDetail = ({
    node,
    x = 0,
    y = 0,
    width,
    height,
    tagColor = '#2277A2',
    text = '',
    textColor = '#fff',
    filter,
    padding_left = 5,
  }) => {
    node
      .filter(filter)
      .append('rect')
      .attr('class', 'corp_tag_ipo')
      .attr('x', x)
      .attr('y', y)
      .attr('ry', radius)
      .attr('rx', radius)
      .attr('height', height / 2 + radius)
      .attr('width', width)
      .attr(
        'fill',
        typeof tagColor === 'function'
          ? function (t) {
              return tagColor(t)
            }
          : tagColor
      )

    node
      .filter(filter)
      .append('rect')
      .attr('class', 'corp_tag_ipo')
      .attr('x', x)
      .attr('y', y / 2)
      .attr('height', height / 2)
      .attr('width', width)
      .attr(
        'fill',
        typeof tagColor === 'function'
          ? function (t) {
              return tagColor(t)
            }
          : tagColor
      )

    var tagIpoTexts = node
      .filter(filter)
      .append('text')
      .attr('class', 'ipotext')
      .attr('fill', textColor)
      .attr('font-size', fontSize)
      .attr('y', -5)
      .attr(
        'x',
        typeof x === 'function'
          ? function (t) {
              return x(t) + padding_left
            }
          : x + padding_left
      )
    tagIpoTexts.append('tspan').text(function (t) {
      return typeof text === 'function' ? text(t) : text
    })
  }

  switch (type) {
    // 上市
    case TagTypeEnum.LISTED:
      createTagDetail({
        node: rectBoxG2,
        x: 0,
        y: -height,
        tagColor,
        textColor,
        width,
        height,
        text: intl('258784', '上市'),
        filter: function (t) {
          return t.listed
        },
        padding_left,
      })

    // 发债
    case TagTypeEnum.ISSUED:
      createTagDetail({
        node: rectBoxG2,
        x: function (t) {
          var distance = 0
          if (t.listed) {
            distance = width + tag_spacing
          }
          return distance
        },
        y: -height,
        tagColor,
        width: window.en_access_config ? 38 : width,
        height,
        textColor,
        text: window.en_access_config ? 'Bonded' : intl('259109', '发债'),
        filter: function (t) {
          return t.issued
        },
        padding_left,
      })

    // 新进/吊销
    case TagTypeEnum.NEWINRECENTYEAR:
      createTagDetail({
        node: rectBoxG2,
        x: rectWidth - width,
        y: -height,
        tagColor: function (t) {
          return wftCommon.unNormalStatus.indexOf(t.reg_status) > -1 ? revokeBgColor : newcorpBgColor
        },
        width,
        height,
        textColor,
        text: function (t) {
          if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) {
            return t.reg_status.length < 4 ? t.reg_status : window.en_access_config ? intl('36489') : '注/吊销'
          }
          return window.en_access_config ? 'New' : '新进'
        },
        filter: function (t) {
          if (wftCommon.unNormalStatus.indexOf(t.reg_status) > -1) return true
          return t.newInRecentYear
        },
      })

    default:
      break
  }
}

/**
 * 创建图例 的函数。
 * @param {Selection} svg - D3.js选择器，用于选择SVG元素。
 * @param {Boolean} onlyActor - 是否只展示一致行动人。
 *
 * @returns {void} 无返回值。
 */
export const createLegend = (svg, onlyActor = false) => {
  let data = sourceData
  if (onlyActor) {
    data = sourceData.filter((i) => i.key === 'actor')
  }

  let [dx, dy] = svg.attr('viewBox')?.split(',') || [0, 0]
  let legendBox = svg
    .append('g')
    .attr('class', 'imageBox')
    .attr('transform', function (d, i) {
      // 为每个<g>元素设置transform属性，以便在SVG中定位
      let [dx, dy, w, h] = svg.attr('viewBox')?.split(',') || [0, 0]

      let initH = svg.attr('height') // 获取SVG的高度
      let initW = svg.attr('width') // 获取SVG的宽度
      let yPosition = Number(dy) + Number(initH) - data.length * 30 - 0 // 计算图例项的垂直位置，从SVG的中间向下排列，每个图例项间隔30px
      let xPosition = Number(dx) + spacing // 计算图例项的水平位置，从SVG的左侧向右排列，起始位置为SVG宽度的一半减去160px
      return `translate(${xPosition},${yPosition})` // 返回transform属性值，用于平移<g>元素到计算出的位置
    })

  setTimeout(() => {
    legendBox
      .append('rect') // 添加一个矩形作为背景
      .attr('width', 250) // 设置矩形的宽度
      .attr('height', data.length * 30 - 10) // 设置矩形的高度
      .attr('fill', 'transparent') // 设置矩形的填充颜色
      .attr('opacity', 1) // 设置矩形的填充不透明度为1，即完全不透明
      .style('opacity', 1)

    let legend = legendBox
      .selectAll('.legend') // 选择SVG中所有的.legend元素，如果没有则创建一个空集合
      .data(data) // 绑定数据到选择集，sourceData是外部传入的数据源
      .enter() // 处理数据绑定后进入的元素，即新元素
      .append('g') // 为每个数据项创建一个<g>元素
      .attr('class', 'legend') // 为新创建的<g>元素添加class属性，值为'legend'
      .attr('transform', function (d, i) {
        // 为每个<g>元素设置transform属性，以便在SVG中定位
        let yPosition = (data.length - 1) * 30 // 计算图例项的垂直位置，从SVG的中间向下排列，每个图例项间隔30px
        let xPosition = spacing * (i + 1) + i * 100 // 计算图例项的水平位置
        return `translate(${xPosition},${yPosition})` // 返回transform属性值，用于平移<g>元素到计算出的位置
      })

    /**
     * 为每个图例项添加一个图像元素。
     */
    legend
      .append('g')
      .attr('class', 'image') // 为图像元素添加class属性，值为'image'
      .attr('width', function (d) {
        return d.key === IconTypeEnum.ACTOR ? imageWidth + 3 : imageWidth
      }) // 设置图像的宽度，imageWidth是外部定义的变量
      .attr('height', function (d) {
        return d.key === IconTypeEnum.ACTOR ? imageHeight + 3 : imageHeight
      }) // 设置图像的高度，imageHeight是外部定义的变量
      .attr('y', function (d) {
        return d.key === IconTypeEnum.ACTOR ? -1 : 0
      })
      .html((d, i) => {
        // 设置图像的来源，即URL
        let imageUrl = data?.[i].imageUrl // 获取数据源中当前图例项的图像URL
        if (Array.isArray(imageUrl)) {
          // 如果URL是一个数组，则取数组的第一个元素
          imageUrl = imageUrl[0]
        }
        return svgRenderToImg(imageUrl)
      })
      .attr('transform', 'scale(0.44444444)')

    /**
     * 为每个图例项添加一个文本元素。
     */
    legend
      .append('text') // 为每个图例项添加一个文本元素
      .attr('x', imageWidth + spacing) // 设置文本的x坐标，即图像宽度加上间隔spacing
      .attr('y', imageHeight / 2) // 设置文本的y坐标，即图像高度的一半

      .attr('dy', '0.35em') // 设置文本相对于基线的偏移量，以便垂直居中
      .append('tspan')
      .text(function (d) {
        return d.label
      })
      .attr('fill', '#666') // 设置文本的y坐标，即图像高度的一半
      .style('font-size', '14px')
  }, 0)
}

/**
 * 创建图例 的函数。
 * @param {Selection} svg - D3.js选择器，用于选择SVG元素。
 * @param {Boolean} onlyActor - 是否只展示一致行动人。
 *
 * @returns {void} 无返回值。
 */
export const createText = (node) => {
  // 节点文本内容
  var labelTxts = node
    .append('text')
    .attr('dx', (d) => {
      if (d.depth == 0) {
        return rectWidth / 2 - 3
      }
      return window.en_access_config || d._nameIsUpper ? 5 : 10
    })
    .attr('dy', (d) => {
      if (d._multiline) {
        if (d._namelen > 12) {
          return 13
        }
        return 20
      }
      if (d._namelen > 10) {
        // 有icon的上移一点
        if (hasIcon(d)) {
          return 20
        }
        return 25
      }
      return 35
    })
  return labelTxts
}

/**
 * 判断d3的某个数据是否有IconTypeEnum中的icon
 * @param {Object} d - d3的某个数据

 */
const hasIcon = (d) => {
  if (!d) return false
  return d[IconTypeEnum.ACTOR]?.length || d[IconTypeEnum.ACTCTRL] || d[IconTypeEnum.BENIFCIARY]
}

/**
 * 将canvas保存本地img
 *
 * @param {any} name , img名称前缀
 * @param {any} canvas , canvas对象
 */
export function downloadimg(name, canvas) {
  let qual = 0.8 // 图片质量
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
  const imgdata = canvas.toDataURL('image/jpeg', qual)
  const filename = name + '_' + new Date().toLocaleDateString() + '.jpeg'
  const a = document.createElement('a')
  const event = new MouseEvent('click')
  a.download = filename
  a.href = imgdata
  a.dispatchEvent(event)
}

/**
 * 通过[key]键查找node节点
 * @param {*} nodes
 * @param {*} key
 * @param {*} val
 * @returns node
 */
export function getNodeByKey(nodes, key, val) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i][key] == val) {
      return nodes[i]
    }
  }
}

/**
 * 判断node节点是否存在
 * @param {*} node
 * @param {*} nodes
 * @returns true/false
 */
export function existNode(node, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (node.name && nodes[i].name == node.name) {
      return true
    }
    if (node.nodeName && nodes[i].nodeName == node.nodeName) {
      return true
    }
  }
  return false
}

/**
 * paths里的nodes与全量nodes可能不匹配，优先使用paths中nodes进行数据匹配，返回新nodes，否则links缺失
 * @param {*} nodes
 * @param {*} paths
 * @returns nodes
 */
export function filterNodes(nodes, paths) {
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

/**
 * 长文本换行处理，超出maxLine展示...
 * @param {*} curStr 原始str
 * @param {*} maxChineseLen 中文最大长度
 * @param {*} maxLine 最大行数
 * @returns
 */
export function formatLongString(curStr, maxChineseLen, maxLine) {
  // 定义每行的最大字符数
  const maxChineseChars = maxChineseLen || 10
  const maxEnglishChars = maxChineseChars * 1.5
  const maxLines = maxLine || 2

  // 用于存储处理后的字符串
  let result = ''
  let currentLine = ''
  let lineCount = 0

  // 遍历每个字符
  for (let i = 0; i < curStr.length; i++) {
    const char = curStr[i]

    // 检查字符是中文还是英文
    const isChinese = /[\u4e00-\u9fa5]/.test(char)
    const isEnglish = /[a-zA-Z]/.test(char)

    if (isChinese) {
      // 中文字符处理
      if (currentLine.length + 1 > maxChineseChars) {
        lineCount++
        if (lineCount >= maxLines) {
          result += currentLine
        } else {
          result += currentLine + '\n'
        }
        currentLine = char
        if (lineCount >= maxLines) break
      } else {
        currentLine += char
      }
    } else if (isEnglish) {
      // 英文字符处理
      if (currentLine.length + 1 > maxEnglishChars) {
        lineCount++
        // 检查当前行是否可以完整添加单词
        if (currentLine.includes(' ')) {
          const lastSpaceIndex = currentLine.lastIndexOf(' ')
          const newLine = currentLine.slice(0, lastSpaceIndex)
          const remaining = currentLine.slice(lastSpaceIndex + 1) + char
          if (lineCount >= maxLines) {
            result += newLine
          } else {
            result += newLine + '\n'
          }
          currentLine = remaining
          if (lineCount >= maxLines) break
        } else {
          if (lineCount >= maxLines) {
            result += currentLine
          } else {
            result += currentLine + '\n'
          }
          currentLine = char
          if (lineCount >= maxLines) break
        }
      } else {
        currentLine += char
      }
    } else {
      // 其他字符直接添加
      if (currentLine.length + 1 > maxChineseChars) {
        lineCount++
        if (lineCount >= maxLines) {
          result += currentLine
        } else {
          result += currentLine + '\n'
        }
        currentLine = char
        if (lineCount >= maxLines) break
      } else {
        currentLine += char
      }
    }
  }

  // 添加最后一行
  if (currentLine && lineCount < maxLines) {
    result += currentLine
  }

  // 如果超过2行，添加省略号
  if (lineCount >= maxLines) {
    result += '...'
  }

  return result
}

/**
 * 获取Array中最大depth
 * @param {*} arr
 * @returns
 */
export function getMaxDepth(arr) {
  // 检查输入是否为数组
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array')
  }

  // 使用 reduce 方法找到最大 depth
  return arr.reduce((max, obj) => {
    if (typeof obj.depth !== 'number') {
      throw new Error('Each object in the array must have a "depth" property that is a number')
    }
    return Math.max(max, obj.depth)
  }, -Infinity)
}

/**
 * 前端计算路径
 * @param {*} nodes
 * @param {*} links
 * @param {*} startNode
 * @param {*} endNode
 * @returns paths
 */
export function calcPathByFont(nodes, links, startNode, endNode) {
  var paths = []
  var counter = 0
  getNext(startNode, [startNode])

  function getNext(node, path) {
    counter++
    if (counter > 30) return // 最多30条
    for (var i = 0; i < links.length; i++) {
      if (links[i].sourceId.includes(node.nodeId) || links[i].targetId.includes(node.nodeId)) {
        var nextNodeId
        if (links[i].sourceId.includes(node.nodeId)) {
          nextNodeId = links[i].targetId
        } else {
          nextNodeId = links[i].sourceId
        }
        var nextNode = getNodeByKey(nodes, 'nodeId', nextNodeId)
        if (nextNode && !existNode(nextNode, path) && node.depth <= nextNode.depth + 5) {
          var cPath = path.concat()
          cPath.push(nextNode)

          endNode.map((t) => {
            if (nextNode.nodeId.includes(t.nodeId)) {
              paths.push(cPath)
            } else {
              getNext(nextNode, cPath)
            }
          })
        }
      }
    }
  }
  paths = paths.sort(function (a, b) {
    return a.length - b.length
  })
  return paths
}

/**
 * 暂无数据
 */
export const NoneData = () => {
  return (
    <div className="wind-ui-table-empty">
      <span>
        {!window.en_access_config ? null : (
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
  )
}

export const gqctLabelFirst = (d) => {
  if (d._multiline) {
    if (!d.name) return '--'
    // 1如果下面有 上市 发债等关键词
    if (!d._nameIsEn) {
      // 中文 12 个字 换行
      if (d._namelen > 12) {
        var t = d.name
        t = t.substr(0, 12) + '...'
        return t
      }
      return d.name || '--'
    } else {
      // 英文 26 个字换行, 且需要考虑单词换行问题
      if (d._namelen > 13) {
        var tmp = d.name.substr(0, 26)
        if (tmp[25]) {
          // 说明最后一个单词被折行了，此时单独处理 不能让其折行
          var tmp2 = []
          tmp.split(' ').map(function (t) {
            tmp2.push(t)
          })
          var tmp4 = tmp2.pop()
          return tmp2.join(' ')
        }
        return tmp
      }
      return d.name || '--'
    }
  } else {
    if (!d.name) return '--'
    if (!d.depth) {
      // 根节点
      if (d.name.charCodeAt(0) < 255 && d.name.charCodeAt(d.name.length - 1) < 255) {
        // 英文 20 个字换行, 且需要考虑单词换行问题
        if (d.name.length > 20) {
          var tmp = d.name.substr(0, 20)
          if (tmp[19]) {
            // 说明最后一个单词被折行了，此时单独处理 不能让其折行
            var tmp2 = []
            tmp.split(' ').map(function (t) {
              tmp2.push(t)
            })
            var tmp4 = tmp2.pop()
            d._lname = tmp4 + ' ' + d.name.substr(20, d.name.length)
            return tmp2.join(' ')
          }
          return tmp
        }
        return d.name || '--'
      } else {
        // 中文 12 个字 换行
        if (d.name.length > 10) {
          var t = d.name
          t = t.substr(0, 10)
          return t
        }
        return d.name || '--'
      }
    }
    if (d._nameIsEn) {
      if (d._namelen > 20) {
        // 11px 长度大于40
        var tmp = d.name.substr(0, 26)
        if (tmp[25]) {
          // 说明最后一个单词被折行了，此时单独处理 不能让其折行
          var tmp2 = []
          tmp.split(' ').map(function (t) {
            tmp2.push(t)
          })
          var tmp4 = tmp2.pop()
          d._lname = tmp4 + ' ' + d.name.substr(26, d.name.length)
          return tmp2.join(' ')
        }
        return tmp
      } else if (d._namelen > 10) {
        // 14px 长度大于 20
        var tmp = d.name.substr(0, 20)
        if (tmp[19]) {
          // 说明最后一个单词被折行了，此时单独处理 不能让其折行
          var tmp2 = []
          tmp.split(' ').map(function (t) {
            tmp2.push(t)
          })
          var tmp4 = tmp2.pop()
          d._lname = tmp4 + ' ' + d.name.substr(20, d.name.length)
          return tmp2.join(' ')
        }
        return tmp
      } else {
        // 长度小于 20 直接展示
        return d.name
      }
    } else {
      // 中文
      if (d._namelen > 10) {
        return d.name.substr(0, 10)
      }
      return d.name
    }
  }
}

export const gqctLabelSecond = (d) => {
  if (!d.depth) {
    if (d.name.charCodeAt(0) < 255 && d.name.charCodeAt(d.name.length - 1) < 255) {
      // 英文 20 个字换行, 且需要考虑单词换行问题
      if (d.name.length > 20) {
        var tmp = d.name.substr(0, 20)
        if (tmp[19]) {
          // 说明最后一个单词被折行了，此时单独处理 不能让其折行
          var tmp2 = []
          tmp.split(' ').map(function (t) {
            tmp2.push(t)
          })
          var tmp4 = tmp2.pop()
          if (d.name.length > 40 - tmp4.length) {
            return d.name.split(tmp2.join(' '))[1].substr(1, 20) + '...'
          }
          return d.name.split(tmp2.join(' '))[1].substr(1, 20)
        }
      }
    } else {
      // 中文 超长 换行
      if (d.name.length > 20) {
        var t = d.name
        t = t.substr(10, 20) + '...'
      } else if (d.name.length > 10 && d.name.length <= 20) {
        var t = d.name
        t = t.substr(10, d.name.length)
      }
    }
  }

  if (d._multiline) {
    // 第二行有内容
    if (!d._nameIsEn) {
      // 中文部展示 第二行
      return ''
    } else {
      // 英文
      if (d.name.length > 13) {
        var tmp = d.name.substr(0, 26)
        if (tmp[25]) {
          // 说明最后一个单词被折行了，此时单独处理 不能让其折行
          var tmp2 = []
          tmp.split(' ').map(function (t) {
            tmp2.push(t)
          })
          var tmp4 = tmp2.pop()
          if (d.name.length > 52 - tmp4.length) {
            return d.name.split(tmp2.join(' '))[1].substr(1, 26) + '...'
          }
          return d.name.split(tmp2.join(' '))[1].substr(1, 26)
        }
      }
    }
  }

  if (d._nameIsEn) {
    if (d._namelen > 20) {
      var tmp = d.name.substr(0, 22)
      if (tmp[21]) {
        // 说明最后一个单词被折行了，此时单独处理 不能让其折行
        var tmp2 = []
        tmp.split(' ').map(function (t) {
          tmp2.push(t)
        })
        var tmp4 = tmp2.pop()
        if (d.name.length > 44 - tmp4.length) {
          return d.name.split(tmp2.join(' '))[1].substr(1, 22) + '...'
        }
        return d.name.split(tmp2.join(' '))[1].substr(1, 22)
      } else {
        return d.name.substr(22, 22) + '...'
      }
    } else if (d._namelen > 10) {
      // 14px 长度大于 20
      var tmp = d.name.substr(0, 20)
      if (tmp[19]) {
        // 说明最后一个单词被折行了，此时单独处理 不能让其折行
        var tmp2 = []
        tmp.split(' ').map(function (t) {
          tmp2.push(t)
        })
        var tmp4 = tmp2.pop()
        if (d.name.length > 40 - tmp4.length) {
          return d.name.split(tmp2.join(' '))[1].substr(1, 20) + '...'
        }
        return d.name.split(tmp2.join(' '))[1].substr(1, 20)
      }
      return tmp
    }
  } else {
    // 中文
    if (d._namelen > 20) {
      return d.name.substr(10, 12) + '...'
    }
    return d.name.substr(10, d._namelen)
  }
}
