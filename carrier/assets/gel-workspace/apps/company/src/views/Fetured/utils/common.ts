import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { colorList } from '../config'
import * as echarts5 from 'echarts/core'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { BarChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts5.use([GridComponent, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, BarChart, PieChart])

export const featuredCompany = {
  root_id: '',
  root_name: '',
  getDateLabel: function (str, updatefreq) {
    if (updatefreq === 6) {
      return window.en_access_config ? str.substring(0, 4) : str.substring(0, 4) + '年'
    } else if ([5, 4, 3].indexOf(updatefreq) > -1) {
      return window.en_access_config
        ? str.substring(0, 4) + '-' + Number(str.substring(4, 6))
        : str.substring(0, 4) + '年' + Number(str.substring(4, 6)) + '月'
    } else {
      return window.en_access_config
        ? str.substring(0, 4) + '-' + Number(str.substring(4, 6)) + '-' + Number(str.substring(6, 8))
        : str.substring(0, 4) + '年' + Number(str.substring(4, 6)) + '月' + Number(str.substring(6, 8)) + '日'
    }
  },
  switchZhEn: {
    '0-100万元': intl('257833', '0-100万元'),
    '100-500万元': intl('437795', '100-500万元'),
    '500-1000万元': intl('437198', '500-1000万元'),
    '1000-3000万元': intl('437218', '1000-3000万元'),
    '3000-5000万元': intl('437199', '3000-5000万元'),
    '5000万元以上': intl('437219', '5000万元以上'),
    '0-19人': intl('258381', '0-19人'),
    '20-99人': intl('214244', '20-99人'),
    '100-199人': intl('261015', '100-199人'),
    '200-499人': intl('261023', '200-499人'),
    '500-999人': intl('214246', '500-999人'),
    '1000-4999人': intl('265551', '1000-4999人'),
    '5000-9999人': intl('437753', '5000-9999人'),
    '10000人以上': intl('214248', '10000人以上'),
    '500-': intl('452319', '500及以上'),
    '0-50': intl('452320', '小于50'),
    已上市: intl('16277', '已上市'),
    主板: intl('35753', '主板'),
    科创板: intl('153470', '科创板'),
    创业板: intl('3208', '创业板'),
    中小板: intl('41736', '中小板'),
    未上市: intl('14816', '未上市'),
    新三板: intl('420097', '新三板'),
    新四板: intl('420070', '新四板'),
    北交所: intl('332933', '北交所'),
    北证: intl('437888', '北证'),
    全部A股: intl('437974', '全部A股'),
    其他: intl('23435', '其他'),
    公办: intl('451776', '公办'),
    民办: intl('451775', '民办'),
    公建民营: intl('451777', '公建民营'),
    公办民营: intl('451778', '公办民营'),
  },
  showIpoPie: function (chartDom, data) {
    if (!chartDom) return
    const seriesData = []
    data.forEach(({ doc_count, key }) => {
      const obj = {
        value: null,
        name: '',
      }
      obj.value = doc_count
      obj.name = key
      // 过滤掉0
      if (doc_count) {
        seriesData.push(obj)
      }
    })
    const myChart = echarts5.init(chartDom)
    let option = {
      color: [
        '#2277a2',
        '#f68717',
        '#5fbebf',
        '#e05d5d',
        '#4a588e',
        '#e4c557',
        '#63a074',
        '#906f54',
        '#9da9b4',
        '#8862ac',
      ],
      tooltip: {
        formatter: '{b}:{d}%',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        bottom: '0%',
        left: 'center',
        orient: 'horizontal',

        textStyle: {
          rich: {
            a: {
              padding: [2.5, 0, 0, 0],
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          data: seriesData,
          label: {
            show: false,
          },
          center: ['50%', '40%'],
        },
      ],
    }
    if (!data.length) {
      option = {} as any
    }
    myChart.setOption(option, true)
  },
  showTypeHandler: function (total, originData, en) {
    const tablePieData = []
    const resPie = []

    for (let i = 0; i < originData.length; i++) {
      const tmp = {} as any
      if (i > 5) {
        tablePieData[5] = {
          key: intl('23435', '其他'),
          doc_count: tablePieData[5].doc_count + originData[i].doc_count,
        }
      } else {
        tmp.doc_count = originData[i].doc_count
        tmp.key = en ? en[i] : originData[i].key
        tablePieData.push(tmp)
        resPie.push(tmp)
      }
    }
    const column = [
      {
        title: intl('60452', '企业类型'),
        dataIndex: 'key',
      },
      {
        title: intl('208504', '企业数量'),
        dataIndex: 'doc_count',
        align: 'right',
        render: (text) => {
          return text && wftCommon.formatMoneyComma(text)
        },
      },
      {
        title: intl('105862', '占比'),
        dataIndex: 'doc_count',
        align: 'right',
        render: (text) => {
          return wftCommon.formatPercent((text / total) * 100)
        },
      },
    ]

    return { tablePieData, column }
    // setTypeTable(tablePieData)
    // setTypeColumns(column)
    // featuredCompany.drawRoundType(typeChartRef?.current, tablePieData, total)
  },
  drawRoundType: function (chartDom, data, total) {
    if (!chartDom) return
    chartDom.style.height = '400px'
    const seriesData = []
    data.forEach((item) => {
      const obj = {
        value: null,
        name: '',
      }
      obj.value = item.doc_count
      obj.name = item.key
      seriesData.push(obj)
    })
    const myChart = echarts5.init(chartDom)
    const option = {
      color: [
        '#2277a2',
        '#f68717',
        '#5fbebf',
        '#e05d5d',
        '#4a588e',
        '#e4c557',
        '#63a074',
        '#906f54',
        '#9da9b4',
        '#8862ac',
      ],
      tooltip: {
        formatter: function (item) {
          return item.data.name + ':' + wftCommon.formatPercent((item.data.value / total) * 100)
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      series: [
        {
          type: 'pie',
          top: -50,
          radius: ['40%', '55%'],
          data: seriesData,
          label: {
            show: false,
          },

          center: ['50%', '45%'],
        },
      ],
      legend: {
        padding: [150, 0, 0, 0],
        bottom: '20',
        formatter: function (name) {
          return ['{a|' + name + '}']
        },
        left: null,
        textStyle: {
          rich: {
            a: {
              padding: [2.5, 0, 0, 0],
            },
          },
        },
      },
    }
    if (window.en_access_config) {
      option.legend.left = '0'
      option.series[0].radius = ['30%', '45%']
    }
    myChart.setOption(option)
  },

  drawBarStatistics: function (chartDom, drawData) {
    if (!chartDom) return
    chartDom.style.height = '400px'
    chartDom.style.width = '550px'
    const myChartBar = echarts5.init(chartDom)
    const keyArr = []
    const valueArr = []

    let max = 0
    const index = drawData.findIndex((i) => i.key == '其他')
    const other = drawData.splice(index, index > -1 ? 1 : 0)
    const len = drawData.length > 10 ? 10 : drawData.length
    if (other.length) {
      keyArr.push(other[0]?.key)
      valueArr.push(other[0]?.doc_count)
    }
    for (let i = 0; i < len; i++) {
      keyArr.push(drawData[i].key)
      valueArr.push(drawData[i].doc_count)
      if (max < drawData[i].doc_count) {
        max = drawData[i].doc_count
      }
    }
    const option = {
      grid: {
        left: 100,
        top: 20,
      },
      color: colorList,
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        splitNumber: 5 < max ? 5 : max === 0 ? 1 : max,
        type: 'value',
        axisLabel: {
          width: 400 + 'px',
        },
      },
      yAxis: {
        type: 'category',
        data: keyArr,
      },

      series: [
        {
          data: valueArr,
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            formatter: function (p) {
              return Number(p.value) === 0 ? 0 : wftCommon.formatMoney(p.value, [4, ' '])
            },
          },
          barMaxWidth: 30,
        },
      ],
    }
    myChartBar.setOption(option)
  },

  drawBarHighChart: function (chartDom, drawData, setIsNoDataBar) {
    if (!chartDom) return
    chartDom.style.height = '400px'
    chartDom.style.width = '520px'
    const myChartBar = echarts5.init(chartDom)
    const keyArr = []
    const valueArr = []
    const len = drawData.length > 10 ? 10 : drawData.length
    for (let i = 0; i < len; i++) {
      keyArr.push(drawData[i].key)
      valueArr.push(drawData[i].doc_count)
    }
    let max = 0
    for (let i = 0; i < len; i++) {
      if (max < drawData[i].doc_count) {
        max = drawData[i].doc_count
      }
    }
    let option: any = {
      color: [
        '#2277a2',
        '#f68717',
        '#5fbebf',
        '#e05d5d',
        '#4a588e',
        '#e4c557',
        '#63a074',
        '#906f54',
        '#9da9b4',
        '#8862ac',
      ],
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: wftCommon.en_access_config ? 150 : 100,
      },
      title: {
        text: intl('315078', '企业数量排名Top10'),
        textStyle: {
          fontSize: 16,
          textAlign: 'center',
          color: '#333333',
          fontWeight: 'normal',
        },
        left: 'center',
      },
      xAxis: {
        splitNumber: 5 < max ? 5 : max === 0 ? 1 : max,
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: keyArr.reverse(),
      },
      axisLabel: {
        width: 400,
      },
      series: [
        {
          data: valueArr.reverse(),
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            formatter: function (p) {
              return p.value == '0' ? 0 : wftCommon.formatMoney(p.value, [4, ''], null, true)
            },
          },
          barMaxWidth: 25,
          //barMaxHeight:50,
          itemStyle: {
            color: function (params) {
              return option.color[params.dataIndex]
            },
          },
        },
      ],
    }
    if (!drawData || !drawData.length) {
      if (setIsNoDataBar) {
        setIsNoDataBar(true)
      }
      option = {
        title: {
          text: intl('315078', '企业数量排名Top10'),
          textStyle: {
            fontSize: 16,
            textAlign: 'center',
            color: '#333333',
            fontWeight: 'normal',
          },
          left: 'center',
          y: 50,
        },
      }
    } else {
      if (setIsNoDataBar) {
        setIsNoDataBar(false)
      }
    }
    myChartBar.setOption(option, true)
  },

  drawRound: function (chartDom, data, total) {
    if (!chartDom) return
    chartDom.style.height = '360px'
    let seriesData = []
    data.forEach((item) => {
      const obj = {
        value: null,
        name: '',
      }
      obj.value = item.doc_count
      obj.name = item.key
      seriesData.push(obj)
    })
    seriesData = seriesData.slice(0, 10)

    const myChart = echarts5.init(chartDom)
    let option: any = {
      color: [
        '#2277a2',
        '#f68717',
        '#5fbebf',
        '#e05d5d',
        '#4a588e',
        '#e4c557',
        '#63a074',
        '#906f54',
        '#9da9b4',
        '#8862ac',
      ],
      tooltip: {
        formatter: function (item) {
          return item.data.name + ':' + wftCommon.formatPercent((item.data.value / total) * 100)
        },
        axisPointer: {
          type: 'shadow',
        },
      },

      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          data: seriesData,
          label: {
            show: false,
          },
          center: ['18%', '50%'],
        },
      ],
      legend: {
        left: '500',
        top: 'middle',
        orient: 'vertical',
        formatter: function (name) {
          return ['{a|' + name + '}']
        },
        textStyle: {
          rich: {
            a: {
              padding: [2.5, 0, 0, 0],
            },
          },
        },
      },
    }

    if (!data.length) {
      option = {
        title: {
          text: intl('17235', '暂无数据'),
          textStyle: {
            fontSize: 16,
            textAlign: 'left',
            color: '#333',
            fontWeight: 'normal',
          },
          x: 'center',
          y: 'center',
        },
      }
    }
    myChart.setOption(option, true)
  },
}
