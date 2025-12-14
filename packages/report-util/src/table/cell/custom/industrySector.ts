import { TablePropsHorizontalShared } from '@/types'
import { IndustrySector, IndustrySectorConfidence, IndustrySectorItem } from 'gel-types'

export const customIndustryList = ['laimiTrack', 'windIndustryChain']

export const getCorpIndustrySeparator = (sectorKey?: string) => {
  return customIndustryList.indexOf(sectorKey) !== -1 ? '、' : ' > '
}

export const getCorpIndustryDisplayConfidence = (item: IndustrySectorConfidence | undefined): number | undefined => {
  if (!item) {
    return
  }
  // 0 置信度 不显示
  if (item.confidence === 0) {
    return
  }
  return item.confidence
}

/**
   * 预处理行业数据
   *
   * * {
  "key": "laimiTrack",
  "list": [
    {
      "list": [
        {
          "id": "35197710154",
          "name": "家居物联网"
        }
      ]
    },
    {
      "list": [
        {
          "id": "35506660872",
          "name": "智能手机"
        }
      ]
    }
  ],
  "name": "来觅赛道",
  "total": 2
}

->

{
  "key": "laimiTrack",
  "list": [
    {
      "list": [
        {
          "id": "35197710154",
          "name": "家居物联网"
        },
         {
          "id": "35506660872",
          "name": "智能手机"
        }
      ]
    },
  ],
  "name": "来觅赛道",
  "total": 2
}
   * 将 customIndustryList 这些行业的数据平铺到第一个 list
   * @param {*} dataSource
   */
export const preProcessSector = (
  sectorItem: IndustrySector
):
  | (Omit<IndustrySector, 'list'> & {
      list: [{ list: IndustrySectorItem[] }]
    })
  | IndustrySector => {
  try {
    if (customIndustryList.indexOf(sectorItem.key) === -1) {
      return sectorItem
    }
    var newList = []
    for (var j = 0; j < sectorItem.list.length; j++) {
      var confidenceGroup = sectorItem.list[j]
      for (var k = 0; k < confidenceGroup.list.length; k++) {
        var item = confidenceGroup.list[k]
        newList.push(item)
      }
    }
    return {
      key: sectorItem.key,
      list: [
        {
          list: newList,
        },
      ],
      name: sectorItem.name,
      total: sectorItem.total,
    }
  } catch (error) {
    console.error(error)
    return sectorItem
  }
}
/**
 * 预处理行业数据
 * 
 
 * 将 customIndustryList 这些行业的数据平铺到第一个 list
 * @param {*} dataSource 
 */
export const preProcessIndustrySector = (dataSource: IndustrySector[]) => {
  try {
    if (!dataSource || dataSource.length === 0) {
      return []
    }
    var newDataSource = []
    for (var i = 0; i < dataSource.length; i++) {
      var sectorItem = dataSource[i]
      var newSector = preProcessSector(sectorItem)
      newDataSource.push(newSector)
    }
    return newDataSource
  } catch (error) {
    console.error(error)
    return dataSource
  }
}

export const convertIndustryDataForTable = (data: IndustrySector[]) => {
  if (!data || data.length === 0) {
    return { dataSourceObj: {}, keys: [] }
  }

  const dataSourceObj: Record<string, IndustrySector> = {}
  const keys: string[] = []

  data.forEach((sector) => {
    if (sector) {
      dataSourceObj[sector.key] = sector
      keys.push(sector.key)
    }
  })

  return { dataSourceObj, keys }
}

export const createIndustryTableColumns = (
  dataSource: IndustrySector[],
  industryRender: (sector: IndustrySector) => any
) => {
  const { dataSourceObj, keys } = convertIndustryDataForTable(dataSource)
  const columns: TablePropsHorizontalShared['columns'] = []
  // 遍历 keys 生成 columns， keys 保持了 array 的顺序
  for (const key of keys) {
    const sector = dataSourceObj[key]
    columns.push([
      {
        title: sector?.name,
        dataIndex: key,
        colSpan: 5,
        render: (sectorData: IndustrySector) => {
          return industryRender(sectorData)
        },
      },
    ])
  }
  return columns
}
