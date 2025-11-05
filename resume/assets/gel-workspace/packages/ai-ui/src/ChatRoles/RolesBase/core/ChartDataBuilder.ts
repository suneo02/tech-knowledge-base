import { ALICE_CHART_TYPE, DPU_STOCK_CODE, DPU_STOCK_NAME, TB_SRCTYPE } from '@/constants'
import { toNumber } from 'lodash'
import DEFAULT_CONFIG, { DEFAULT_YAXIS } from './basicConfig'

const NUMBER_TYPES = ['double', 'int', 'int32', 'int64', 'float', 'ushort']
const DATETIME_TYPES = ['datetime', 'char8date', 'year']
const DATETIME_NAMES = ['年份', 'Year', '月份']

const MAX_INDICATORS = 100

class ChartDataBuilder {
  data: any
  options: any
  type: any
  axisType: any
  src: any

  constructor(data: any, options: any = {}) {
    options = Object.assign({ chartType: '2' }, options)
    const { chartType } = options
    this.options = options
    this.type = ALICE_CHART_TYPE[chartType] // "line"、"bar"、"pie"
    const { table, src } = this.sanitizer(data)
    this.data = table
    this.src = src // chartSource; // "edb"、"function"
    this.axisType = null
  }

  getChart() {
    if (!(this.data && this.type)) return null
    console.log(this.data, 'this.data???')
    const chart: any = {
      module: 'AliceChat',
      config: DEFAULT_CONFIG,
      indicators: null,
      dataSource: null,
    }

    // 饼图
    if (this.type === ALICE_CHART_TYPE['3']) {
      return this.pieChartProcess(chart)
    }

    if (Array.isArray(this.data)) {
      const nestIndicators = this.data.map((item) => this.getIndicator(item)).filter((item) => item && item.length)
      chart.dataSource = this.data[0]

      console.log('NestIndicators >>>', nestIndicators)

      if (nestIndicators.length === 1) {
        chart.indicators = nestIndicators[0]
      } else if (nestIndicators.length > 1) {
        let firstIndicators = nestIndicators.reduce((accu, item, idx) => {
          const inds = item.map((indi) => ({ ...indi, meta: { ...indi.meta, yAxisIndex: idx } }))
          accu.push(...inds)
          return accu
        }, [])

        chart.indicators = firstIndicators.map((item) => {
          const { meta, ...rest } = item
          return {
            ...rest,
            meta: {
              ...meta,
              xAxisIndex: 0,
              // yAxisIndex: unitSet.size > 1 ? idx : 0,
            },
          }
        })

        const yAxis = chart.indicators.reduce((axis, item, index) => {
          const { meta } = item
          axis[`0:0-yAxis-${index}`] = {
            ...DEFAULT_YAXIS,
            name: meta.name,
            position: index === 0 ? 'left' : 'right',
          }
          return axis
        }, {})

        chart.config = {
          ...DEFAULT_CONFIG,
          yAxis,
        }
      }
    } else {
      const indicators = this.getIndicator(this.data)
      if (indicators && indicators.length) {
        chart.dataSource = this.data
        chart.indicators = indicators
      }
    }

    if (chart.indicators) {
      if (this.axisType) {
        chart.chart = {
          categoryAxisDataType: this.axisType,
        }
      }
      return chart
    }

    return null
  }

  // 数据清洗
  sanitizer(data: any) {
    const ret: any = {
      table: null,
      src: null,
    }

    if (!data) return ret

    if (Array.isArray(data) && data.length) {
      if (data.length > 1) {
        ret.table = data
      } else {
        ret.table = data[0]
      }
    } else {
      ret.table = data
    }

    return ret
  }

  transformNormalTable(item) {
    if ([TB_SRCTYPE.EDB, TB_SRCTYPE.EDE].includes(item.sourceType)) {
      return item
    }

    const { columns } = item
    const windCode = columns.find((item) => DPU_STOCK_CODE.includes(item.name))
    const windName = columns.find((item) => DPU_STOCK_NAME.includes(item.name))
    // 转换成EDE表格
    if (windName && windCode) {
      item.sourceType = TB_SRCTYPE.EDE
    }
    return item
  }

  getIndicator(data) {
    const { columns: rawColumns = [], dataSource, sourceType } = data
    const [xItem, columns, rows, type] = this.getXAxisIndex(rawColumns, dataSource, sourceType)
    if (!xItem) return null

    // 有柱状图时需要设置坐标轴
    if (type === 'bar') {
      this.axisType = 'category'
    }

    const { dataIndex: xIndex } = xItem

    /**
     * 指标序列
     * 1）指标值是数值类型
     * 2）序列中不含空数据
     */
    const indicators = columns.reduce((accu, item) => {
      const { name, unit, dataType, dataIndex } = item
      if (NUMBER_TYPES.includes(dataType)) {
        let allEmptyData = true

        const indicator = {
          meta: {
            name,
            unit,
            type,
            // type: this.type,
            // subType: ["stack"], // 是否堆叠显示
            barMaxWidth: 20,
          },
          data: rows.map((row) => {
            const value = row[dataIndex]
            allEmptyData = allEmptyData && value !== 0 && !value

            let label = row[xIndex]
            if (label && label.Label) {
              label = label.Label
            }
            return {
              name: label,
              value: [label, value !== 0 && !value ? null : toNumber(value).toFixed(2)],
            }
          }),
        }

        // 过滤掉数值数列都是空值的指标
        if (!allEmptyData) {
          accu.push(indicator)
        }
      }
      return accu
    }, [])

    /**
     * 筛选单位频次最高的指标
     * 20240723-不限制指标数量和单位
     */
    const targetUnit = '' // mode(indicators.map(item => item.meta).filter(item => !!item.unit));

    // 同维度的指标作图
    const unitedIndicators = indicators
      .filter((item) => item.meta.unit === targetUnit || !targetUnit)
      .slice(0, MAX_INDICATORS)
    // console.log("indicators >>>", indicators, targetUnit, unitedIndicators);
    // if (this.type === "bar") {
    //   return unitedIndicators.map(item => ({
    //     ...item,
    //     // 避免柱状图太密集，取前20条数据
    //     data: item.data.slice(0, MAX_DATA_SIZE)
    //   }));
    // }
    return unitedIndicators
  }

  getXAxisIndex(columns, rows, sourceType) {
    /** 修正数据表字段类型 */
    columns = columns.map((col) => {
      const colName = col.name || ''
      if (!colName) return col

      let fixedType = ''
      if (colName.indexOf('日期') > -1 || DATETIME_NAMES.includes(colName)) {
        fixedType = 'datetime'
      } else if (colName.indexOf('名次') > -1) {
        fixedType = 'string'
      }
      if (fixedType) {
        return {
          ...col,
          dataType: fixedType,
        }
      }
      return col
    })

    let item
    let type = this.type

    if ([TB_SRCTYPE.EDB].includes(sourceType)) {
      item = columns.find((item) => DATETIME_TYPES.includes(item.dataType))
    } else if (sourceType === TB_SRCTYPE.EDE) {
      let stockColIndex, dateColIndex

      // 证券代码字段
      item = columns.find((item) => DPU_STOCK_NAME.includes(item.name))
      if (item) {
        stockColIndex = item.dataIndex
      }

      // 查找日期字段，判断是否为时序数据
      const dateCol = columns.find((item) => DATETIME_TYPES.includes(item.dataType))
      if (dateCol) {
        dateColIndex = dateCol.dataIndex
      }

      // 聚合证券代码和日期
      const [stockSet, dateSet] = rows.reduce(
        (accu, item) => {
          const [stkSet, dtSet] = accu
          if (item) {
            const { Id, Label } = item[stockColIndex] || {}
            if (Id && Label) {
              stkSet.add(`${Id},${Label}`)
            }

            if (dateColIndex) {
              const dateValue = item[dateColIndex]
              if (dateValue) {
                dtSet.add(dateValue)
              }
            }
          }

          return [stkSet, dtSet]
        },
        [new Set(), new Set()]
      )

      // console.log(">>>>> CHART INDICATOR <<<<<\n", stockSet, "\n", dateSet);

      // 如果是时序数据，X轴坐标为日期
      if (dateSet.size > 1) {
        /**
         * 时序数据，且证券代码不唯一的，需要转置表格，把表格行中不同的指标转为表格列
         */
        if (stockSet.size > 1) {
          const stkExtendIndex = {}

          // 表格的多证券指标转置为列指标
          columns = columns
            .filter((item) => NUMBER_TYPES.includes(item.dataType))
            .reduce(
              (newCols, item) => {
                const { name, unit, dataType, dataIndex } = item
                stockSet?.forEach((stk) => {
                  const [stkId, stkName] = stk.split(',')
                  const idx = `column_temp_${newCols.length + 1}`
                  stkExtendIndex[stkId] = `${dataIndex},${idx}`
                  newCols.push({
                    unit,
                    dataType,
                    dataIndex: idx,
                    name: `${stkName}:${name}`,
                    width: '100px',
                  })
                })
                return newCols
              },
              [dateCol]
            )
          // console.log(">>>>> EXTIDX <<<<<", stkExtendIndex, columns);

          const dateJoinedRows = rows.reduce((accu, item) => {
            const dateStr = item[dateColIndex]
            if (!accu[dateStr]) {
              accu[dateStr] = []
            }
            accu[dateStr].push(item)
            return accu
          }, {})
          // console.log(">>>>> DateJoinedRows <<<<<", Object.values(dateJoinedRows));

          const dateMergedRows = Object.values(dateJoinedRows).reduce((accu: any, items: any) => {
            const item = items.reduce((ret, row) => {
              ret[dateColIndex] = row[dateColIndex]
              const { Id } = row[stockColIndex] || {}
              const [rawIdx, expIdx] = (stkExtendIndex[Id] || '').split(',')
              ret[expIdx] = row[rawIdx]
              return ret
            }, {})

            accu.push(item)
            return accu
          }, [])
          // console.log(">>>>> MERGED <<<<<", dateMergedRows);

          rows = dateMergedRows
        }

        try {
          // @ts-expect-error
          rows = rows.sort((a, b) => new Date(a[dateCol.dataIndex]) - new Date(b[dateCol.dataIndex]))
        } catch (err) {}

        return [dateCol, columns, rows, type]
      }

      // 只有单一的证券名称时，使用其他指标名作为X轴
      if (stockSet.size === 1) {
        const bizItem = columns.find(
          (item) =>
            !DPU_STOCK_CODE.includes(item.name) && !DPU_STOCK_NAME.includes(item.name) && item.dataType === 'string'
        )
        if (bizItem) {
          item = bizItem
        }
      }

      // 无法绘制折线图时，强制转为柱状图
      if (type === 'line') {
        type = 'bar'
      }
    }
    return [item, columns, rows, type]
  }

  pieChartProcess(chart) {
    const percentRegex = /占.*比/
    const findPercentData = (data) => {
      const nameCol = data.find((item) => item.name.includes('名称'))
      const percentCol = data.find((item) => percentRegex.test(item.name))
      if (percentCol && nameCol) {
        return {
          nameCol,
          percentCol,
        }
      }
      return null
    }

    let cols
    let colsData = []

    if (Array.isArray(this.data)) {
      const index = this.data.findIndex((item) => {
        const val = findPercentData(item.columns)
        if (val) {
          cols = val
          colsData = item.dataSource
          return true
        }
        return false
      })

      if (index !== -1) {
        chart.dataSource = this.data[index]
      }
    } else {
      const { columns, dataSource } = this.data
      cols = findPercentData(columns)
      colsData = dataSource
      chart.dataSource = this.data
    }

    if (!cols) {
      return null
    }

    const { nameCol = '', percentCol = '' } = cols || {}

    const { indicatorData } = colsData.reduce(
      (acc, pre, index, arr) => {
        const key = pre[nameCol.dataIndex]
        const percent = pre[percentCol.dataIndex]

        if (!key || (!percent && percent !== 0)) {
          return acc
        }

        const compatPercent = percent > 1 ? percent * 1 : percent * 100
        const value = toNumber(compatPercent.toFixed(2))

        // @ts-expect-error
        acc.indicatorData[key] = value
        acc.total += value
        if (index === arr.length - 1 && acc.total < 100) {
          acc.indicatorData['其他'] = 100 - acc.total
        }
        return acc
      },
      { indicatorData: {}, total: 0 }
    )

    if (indicatorData && Object.keys(indicatorData).length === 0) {
      return null
    }

    chart.config = {
      layoutConfig: {
        isSingleSeries: true,
      },
    }

    chart.indicators = [
      {
        meta: {
          type: 'pie',
          name: cols.nameCol && cols.nameCol.name,
          unit: '%',
        },
        data: indicatorData,
      },
    ]

    chart.chart = { categoryAxisDataType: 'category' }

    return chart
  }
}

export default ChartDataBuilder
