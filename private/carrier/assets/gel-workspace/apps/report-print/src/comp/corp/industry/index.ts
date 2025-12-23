import { HorizontalTableElementCreator } from '@/comp/table/Horizontal/creator'
import { createTableNoDataElement } from '@/comp/table/tableComp'
import { IndustrySector, ReportDetailCustomNodeJson } from 'gel-types'
import { convertIndustryDataForTable, createIndustryTableColumns, preProcessIndustrySector } from 'report-util/table'
import { createIndustryDataCell } from './comp'

export const createCorpIndustryTable = (dataSource: IndustrySector[], config: ReportDetailCustomNodeJson) => {
  const dataSourceProcessed = preProcessIndustrySector(dataSource)
  const { dataSourceObj, keys } = convertIndustryDataForTable(dataSourceProcessed)
  const columns = createIndustryTableColumns(dataSourceProcessed, (sector) => {
    return createIndustryDataCell(sector)
  })

  if (keys.length === 0) {
    return createTableNoDataElement(config)
  }

  return HorizontalTableElementCreator.createTable(dataSourceObj, {
    columns,
  })
}
