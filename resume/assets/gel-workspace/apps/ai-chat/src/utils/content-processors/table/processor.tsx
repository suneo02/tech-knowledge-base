import type { MarkdownTable } from './types'
import { hasMarkdownTable, parseMarkdownTable, extractTableContent } from './parser'
import { MarkdownTableComponent } from './component'
import { createProcessor } from '../processor'

/**
 * 检查文本是否包含表格
 */
export const checkTable = hasMarkdownTable

/**
 * 表格处理器
 */
export const tableProcessor = createProcessor<MarkdownTable>({
  name: 'table',
  check: hasMarkdownTable,
  parse: (text: string) => {
    const tableContent = extractTableContent(text)
    const tableData = parseMarkdownTable(tableContent)

    if (tableData.isTable) {
      const start = text.indexOf(tableContent)
      const end = start + tableContent.length

      return {
        data: tableData,
        position: {
          start,
          end,
        },
        beforeText: text.substring(0, start),
        afterText: text.substring(end),
      }
    }

    return null
  },
  render: (data) => <MarkdownTableComponent tableData={data} />,
})
