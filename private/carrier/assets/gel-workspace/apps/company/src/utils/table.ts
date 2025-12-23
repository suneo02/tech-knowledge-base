import React from 'react'

export interface IColumn {
  title: string
  dataIndex?: string
  key?: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (text: any, record: any, index: number) => React.ReactNode
}

export function convertAntDColumns(antdColumns: IColumn[]) {
  const alignMap = {
    left: 0,
    center: 1,
    right: 2,
  }

  const thWidthRadio = antdColumns.map((c) => c.width || '')
  const thName = antdColumns.map((c) => c.title)
  const align = antdColumns.map((c) => alignMap[c.align || 'left'])
  const fields = antdColumns.map((c) => c.dataIndex || '')
  const columns = antdColumns.map((c) => (c.render ? { render: c.render } : null))

  return { thWidthRadio, thName, align, fields, columns }
}
