import { configTableCreator } from '../table/ConfigTable/creator'
import { RPPrintState } from '../TableSectionsHelper/type'
import { TableSectionsElements } from './type'

export const addTable = (item: { type: 'table'; id: string }, state: RPPrintState, elements: TableSectionsElements) => {
  const { apiDataStore, tableConfigsStore } = state
  try {
    const tableConfig = tableConfigsStore[item.id]
    const dataSource = apiDataStore[item.id]
    if (tableConfig) {
      const tableElement = configTableCreator(dataSource, tableConfig)
      elements.push({ type: 'table', element: tableElement })
    }
  } catch (error) {
    console.error('Error creating table for ', item, error)
  }
}
