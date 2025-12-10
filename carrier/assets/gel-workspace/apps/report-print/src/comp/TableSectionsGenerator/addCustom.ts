import { createCorpIndustryTable } from '../corp/industry'
import { RPPrintState } from '../TableSectionsHelper/type'
import { TableSectionsElements } from './type'

export const addCustom = (
  item: { type: 'custom'; id: string },
  state: RPPrintState,
  elements: TableSectionsElements
) => {
  const { customNodeConfigStore, apiDataStore } = state
  const config = customNodeConfigStore[item.id]
  const dataSource = apiDataStore[item.id]
  if (!config) {
    return
  }
  switch (config.key) {
    case 'BelongIndustry':
      elements.push({
        type: 'table',
        element: createCorpIndustryTable(dataSource, config),
      })
      break
    default:
      break
  }
}
