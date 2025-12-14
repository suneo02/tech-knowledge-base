import { createTableComment } from '../TableComment/tableComment'
import { RPPrintState } from '../TableSectionsHelper/type'
import { addComment } from './addComment'
import { addCustom } from './addCustom'
import { addHeading } from './addHeading'
import { addRawHtml } from './addRawHtml'
import { addTable } from './addTable'
import { TableSectionsElements } from './type'

export const tableSectionsCreator = (state: RPPrintState): TableSectionsElements => {
  const elements: TableSectionsElements = []
  const { renderOrder } = state

  for (const item of renderOrder) {
    if (item.type === 'heading') {
      addHeading(item, state, elements)
    } else if (item.type === 'table') {
      addTable(item, state, elements)
      addComment(item, state, elements)
    } else if (item.type === 'custom') {
      addCustom(item, state, elements)
      addComment(item, state, elements)
    } else if (item.type === 'rawHtml') {
      addRawHtml(item, state, elements)
      addComment(item, state, elements)
    } else if (item.type === 'element') {
      elements.push({
        type: 'paragraph',
        element: createTableComment(item.element),
      })
    } else {
      console.error('tableSectionsCreator: 不支持的节点类型', item)
    }
  }
  return elements
}
