import { ReactNode } from 'react'

export type HorizontalTableCol<T = any> = {
  title: ReactNode
  dataIndex: keyof T | ''
  render?: (txt: any, record: T) => ReactNode
  colSpan?: number
  titleWidth?: number | string
  contentWidth?: number | string
}
export type HorizontalTableColumns<T = any> = HorizontalTableCol<T>[][]
