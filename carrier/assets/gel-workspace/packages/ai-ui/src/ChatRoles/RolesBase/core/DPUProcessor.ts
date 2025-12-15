import { DPU_STOCK_CODE } from '@/constants'
import { uniqueId } from 'lodash-es'

export const toJsonObject = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (error) {
      return null
    }
  }
  return value
}

class DPUProcessor {
  constructor(_options = {}) {}

  build(dataSource: any[] = []) {
    if (!Array.isArray(dataSource)) {
      dataSource = [dataSource]
    }

    dataSource = dataSource.filter((item) => item.Headers && item.Content)

    const reducer = (accu, item) => {
      try {
        const adaptedItem = this.dataAdapter(item)
        const tbItem = this.buildTableItem(adaptedItem)
        accu.push(tbItem)
      } catch (err) {}
      return accu
    }

    return dataSource.reduce(reducer, [])
  }

  dataAdapter(data) {
    const { Headers, ...rest } = data
    return {
      ...rest,
      Headers: Headers.map((item) => ({
        ...item,
        Unit: item.Dimensions,
      })),
    }
  }

  findWindCodes(columns, rows) {
    let windCodes = []

    const index = columns.findIndex((item) => {
      return DPU_STOCK_CODE.includes(item.Name) && item.DataType === 'composite'
    })

    if (index > -1) {
      const codeSet = rows.reduce((set, row) => {
        const { Id, WindCodeType } = toJsonObject(row[index]) || {}
        if (Id && ['STOCKCN', 'STOCKHK', 'STOCKUS'].includes(WindCodeType)) {
          set.add(Id)
        }
        return set
      }, new Set())

      if (codeSet.size > 0) {
        windCodes = Array.from(codeSet)
      }
    }

    return windCodes
  }

  buildTableItem(record) {
    const { Headers: columns = [], Content: rows = [], SourceType: sourceType, Total } = record

    const tbItem: any = {
      columns: [],
      dataSource: [],
      total: Total,
      sourceType,
      // sourceQuestion: rawSentence || tbQuestion,
      // edbIndicators: [], // EDB指标列表
      // edeIndicators: [], // EDE指标列表
      // windCodes: [], // 证券代码列表
    }

    const windCodes = this.findWindCodes(columns, rows)
    tbItem.windCodes = windCodes

    tbItem.columns = columns.reduce((accu, item) => {
      const { Name, DataType, Unit } = item

      const dataIndex = uniqueId('column_')

      const columnItem = {
        dataIndex,
        name: Name,
        dataType: DataType,
        unit: Unit,
      }

      accu.push(columnItem)
      return accu
    }, [])

    tbItem.dataSource = rows.reduce((accu, row) => {
      const rowItem = row.reduce((obj, value, colIdx) => {
        const { dataIndex, dataType } = tbItem.columns[colIdx] || {}

        if (dataType === 'composite') {
          value = toJsonObject(value)
        }

        obj[dataIndex] = value
        return obj
      }, {})

      rowItem.key = uniqueId('key_')
      accu.push(rowItem)
      return accu
    }, [])

    return tbItem
  }
}

export default DPUProcessor
