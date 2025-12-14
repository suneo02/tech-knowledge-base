import MarkdownIt from 'markdown-it'
import type { TableProps } from 'antd'

export interface TablePluginOptions {
  bordered?: boolean
  size?: 'small' | 'middle' | 'large'
}

type TokenContent = {
  content: string
  type: string
  children?: TokenContent[]
}

function parseTableData(tokens: TokenContent[], idx: number) {
  const token = tokens[idx]
  if (!token || token.type !== 'table_open') return null

  // 查找表头行
  const headerRow = tokens[idx + 1]
  if (!headerRow || headerRow.type !== 'thead_open') return null

  // 解析表头
  const headers: string[] = []
  let currentIdx = idx + 2 // 跳过 thead_open
  while (currentIdx < tokens.length && tokens[currentIdx].type !== 'thead_close') {
    const cell = tokens[currentIdx]
    if (cell.type === 'th_open') {
      const content = tokens[currentIdx + 1]
      if (content.type === 'inline') {
        headers.push(content.content)
      }
    }
    currentIdx++
  }

  // 解析数据行
  const rows: Record<string, string>[] = []
  currentIdx++ // 跳过 thead_close

  while (currentIdx < tokens.length && tokens[currentIdx].type !== 'table_close') {
    if (tokens[currentIdx].type === 'tr_open') {
      const rowData: Record<string, string> = { key: `row${rows.length}` }
      let colIdx = 0

      currentIdx++ // 移动到第一个单元格
      while (currentIdx < tokens.length && tokens[currentIdx].type !== 'tr_close') {
        if (tokens[currentIdx].type === 'td_open') {
          const content = tokens[currentIdx + 1]
          if (content.type === 'inline') {
            rowData[`col${colIdx}`] = content.content
            colIdx++
          }
        }
        currentIdx++
      }

      rows.push(rowData)
    }
    currentIdx++
  }

  return {
    columns: headers.map((title, index) => ({
      title,
      dataIndex: `col${index}`,
      key: `col${index}`,
    })),
    dataSource: rows,
  }
}

export function tablePlugin(md: MarkdownIt) {
  const defaultRender = md.renderer.rules.table || md.renderer.renderToken.bind(md.renderer)

  md.renderer.rules.table = (tokens, idx, options, env, self) => {
    console.log('🚀 ~ tablePlugin ~ tokens:', tokens)

    const tableData = parseTableData(tokens as unknown as TokenContent[], idx)
    if (!tableData) return defaultRender(tokens, idx, options, env, self)

    const tableProps: TableProps<Record<string, string>> = {
      ...tableData,
      pagination: false,
      bordered: true,
      size: 'middle',
    }

    return `<div class="antd-table-placeholder" data-table-props='${JSON.stringify(tableProps)}'></div>`
  }
}
