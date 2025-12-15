import { ReactNode } from 'react'

export type HorizontalTableColumnRender<T = any, K extends keyof T = keyof T> = (
  txt: T[K],
  record: T,
  index: number
) => ReactNode

export type HorizontalTableCol<T = any> = {
  title: ReactNode
  dataIndex: keyof T | ''
  render?: HorizontalTableColumnRender<T>
  colSpan?: number
  titleWidth?: number | string
  contentWidth?: number | string
}

export type HorizontalTableColumns<T = any> = HorizontalTableCol<T>[][]
