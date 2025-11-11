import { cellConfig } from './comp/AiChartsExcel/config'

export function parseConfig(config?: any, chatName?: string) {
  return config
    ? config instanceof Object
      ? config
      : {
          ...JSON.parse(config),
          name: chatName,
        }
    : {
        type: '未知Type',
      }
}

// 对AI返回的数据进行兜底处理，确保能够正确生成图谱
export function formatChatData(chatData: any) {
  if (!chatData.relations) {
    return chatData
  }
  function removeDuplicates(arr: any[]) {
    const seen = new Set() // 用于存储已出现元素的唯一标识
    return arr.filter((item) => {
      // 生成唯一键：组合三个属性（假设均为字符串）
      const key = `${item.fromNodeId}|${item.toNodeId}|${item.relationshipType}`
      // 如果键已存在，则跳过当前元素；否则保留并记录键
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
  return {
    ...chatData,
    relations: removeDuplicates(chatData.relations),
  }
}

export function formatRelation(relations, list) {
  return relations?.map((row) => {
    const source = list.find((node: any) => node.nodeId === row.fromNodeId)
    const target = list.find((node: any) => node.nodeId === row.toNodeId)
    return {
      ...row,
      fromNodeName: source?.nodeName || '--',
      toNodeName: target?.nodeName || '--',
    }
  })
}
// 根据图谱统一数据config的type和layout, 转换成数据表格下拉框所需的value
export const getGraphTypeValue = (type: string, layout: string) => {
  const GraphTypeConfig = cellConfig['graphType']
  const option = GraphTypeConfig.options.find((o) => o.type === type && o.layout == layout)
  return option?.key
}

export const getGraphTypeFromValue = (value: number) => {
  const GraphTypeConfig = cellConfig['graphType']
  const option = GraphTypeConfig.options.find((o) => o.key === value)
  return {
    type: option?.type,
    layout: option?.layout,
    name: option?.name,
  }
}

export const getSaveModifiedGraphQuestion = (changedTableValueMap: any) => {
  function transformData(changedValueMap) {
    const result = {
      basic: { update: [] },
      relation: { update: [], delete: [], add: [] },
      node: { update: [], delete: [], add: [] },
    }
    for (const key in changedValueMap) {
      if (changedValueMap.hasOwnProperty(key)) {
        const entry = changedValueMap[key]
        const { action, sheetType } = entry

        if (sheetType === 'relation' || sheetType === 'node' || sheetType === 'basic') {
          if (['add', 'update', 'delete'].includes(action)) {
            result[sheetType][action].push(entry)
          }
        }
      }
    }
    return result
  }

  function getChangedValue(key: string, value: any) {
    if (key === 'graphType') {
      return getGraphTypeFromValue(value as number)?.name
    }
    if (value === '' || value === undefined) {
      return '空'
    }
    if (typeof value === 'boolean') {
      return value ? '是' : '否'
    }

    return value
  }

  function generateQuestion(data) {
    const tableNames = {
      basic: '设置图谱',
      node: '节点信息表',
      relation: '节点关系表',
    }
    const result = []
    function getLines(sheet: any, isBasic?: boolean) {
      const lines = []

      if (sheet && Object.values(sheet).some((arr: any[]) => arr.length > 0)) {
        // 处理新增
        if (sheet.add && sheet.add.length > 0) {
          lines.push(`新增了${sheet.add.length}条数据`)
        }

        // 处理删除
        if (sheet.delete && sheet.delete.length > 0) {
          const indices = sheet.delete.map((item) => item.rowIndex + 1)
          lines.push(`删除了第${indices.join('、')}行数据`)
        }

        // 处理更新
        if (sheet.update && sheet.update.length > 0) {
          for (const update of sheet.update) {
            const changes = []
            for (const [key, value] of Object.entries(update)) {
              if (['rowIndex', 'action', 'sheetType'].includes(key)) continue
              changes.push(`${cellConfig[key].name}更改为${getChangedValue(key, value)}`)
            }
            lines.push(!isBasic ? `将第${update.rowIndex + 1}行数据，${changes.join(';')}` : `${changes.join(';')}`)
          }
        }
      }

      return lines
    }

    const relationLines = getLines(data.relation)
    relationLines.length && result.push(`${tableNames.relation}：${relationLines.join(';')}`)

    const nodeLines = getLines(data.node)
    nodeLines.length && result.push(`${tableNames.node}：${nodeLines.join(';')}`)

    const basicLines = getLines(data.basic, true)
    basicLines.length && result.push(`${tableNames.basic}：${basicLines.join(';')}`)

    return result.join('。') + '。'
  }

  const data = transformData(changedTableValueMap)

  let question = generateQuestion(data)

  return question

  // return '依据我刚才在数据表格编辑的内容，生成新的图谱'
}

// 格式化成接口请求需要的数据格式
export const getSaveModifiedGraphParams = (chatData, changedTableValueMap: any) => {
  let config = ''
  const relations = []
  const list = []

  Object.keys(changedTableValueMap).forEach((key) => {
    if (key === 'config') {
      const graphType = changedTableValueMap[key]['graphType']
      const orginConfig = parseConfig(chatData.config, chatData.name)
      config = JSON.stringify({
        ...orginConfig,
        ...changedTableValueMap['config'],
        ...(graphType ? getGraphTypeFromValue(graphType) : {}),
      })
      return
    }
    const changedTableValue = changedTableValueMap[key]
    const changedType = changedTableValue['sheetType']

    if (changedType === 'relation') {
      if (changedTableValue.action === 'update') {
        const originList = formatRelation(chatData?.relations, chatData?.nodeInfo?.list)
        const originRowValue = originList.find((r) => r.rowId === key)
        relations.push({
          ...originRowValue,
          ...changedTableValue,
        })
      } else {
        relations.push(changedTableValue)
      }

      return
    }

    // 节点属性表
    if (changedTableValue.action === 'update') {
      const originRowValue = chatData?.nodeInfo?.list.find((r) => r.rowId === key)
      list.push({
        ...originRowValue,
        ['properties']: {
          ...originRowValue.properties,
          ...changedTableValue,
        },
        ...changedTableValue,
      })
    } else {
      list.push(changedTableValue)
    }
  })
  return {
    config,
    relations,
    list,
  }
}

export const getRandomId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`
}
