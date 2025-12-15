import React from 'react'
import type { BasicColumn, BasicRecord } from './types'

export interface TableContextValue {
  columns: BasicColumn[]
  dataSource: BasicRecord[]
}

export const TableContext = React.createContext<TableContextValue | null>(null)
