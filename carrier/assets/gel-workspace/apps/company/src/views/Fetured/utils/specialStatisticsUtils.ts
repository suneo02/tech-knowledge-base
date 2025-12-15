import { createRequest } from '@/api/request'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { featuredCompany } from './common'

// 统一的API请求函数
export const requestRankListAggSelectV2 = async (
  {
    corpListId,
    areaCode,
  }: {
    corpListId: string
    areaCode: string
  },
  queryType: 'institutionType' | 'bedNumber'
) => {
  const api = createRequest({ noHashParams: true, noExtra: true })
  return api('rankinglist/rankListAggSelectV2', {
    params: {
      queryType,
      corpListId,
      areaCode,
    },
  })
}

// 获取原始数据
export const getOriginData = (res: any, component: any) => {
  // 根据不同的 queryType 获取对应的数据字段
  const dataFieldMap = {
    institutionType: 'institutionType',
    bedNumber: 'bedNumber',
  }

  const dataField = dataFieldMap[component.queryType]
  return res.Data?.[dataField] || []
}

// 处理数据
export const processData = (originData: any[]) => {
  const tableData = []
  const chartData = []

  for (let i = 0; i < originData.length; i++) {
    const tmp = {
      doc_count: originData[i].doc_count,
      key: featuredCompany.switchZhEn[originData[i].key] || originData[i].key,
    }
    tableData.push(tmp)
    if (tmp.doc_count) {
      chartData.push(tmp)
    }
  }

  return { tableData, chartData }
}

// 生成表格列配置
export const generateColumns = (columnConfigs: any[], total: number) => {
  return columnConfigs.map((config) => ({
    title: intl(config.titleIntl, config.title),
    dataIndex: config.dataIndex,
    align: config.align || 'left',
    render: (text: any) => {
      if (config.render === 'percent') {
        return wftCommon.formatPercent((text / total) * 100)
      } else if (config.render === 'money') {
        return text && wftCommon.formatMoneyComma(text)
      }
      return text || '--'
    },
  }))
}
