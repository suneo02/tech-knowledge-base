import React from 'react'
import Table from '@wind/wind-ui-table'
import { HorizontalTableProps } from '@wind/wind-ui-table/lib/HorizontalTable'
import { isArray, isNil, isString } from 'lodash'
import dayjs from 'dayjs'
import { LinksModule } from '@/handle/link'
import { Links } from '@/components/common/links'

const formatLink = (
  value: { name?: string; windId?: string } | { name?: string; windId?: string }[] | string | null,
  options?: { target?: '_blank' | '_self'; linksModule?: LinksModule }
) => {
  if (isNil(value) || value === '') return '--'
  const { target = '_blank' } = options || {}
  const renderLink = (item: { name?: string; windId?: string } | string) => {
    if (isString(item)) {
      return <Links module={options?.linksModule} title={item} target={target} />
    }
    const name = item.name
    const link = `https://www.baidu.com?query=${item.windId}` // Example link
    if (!name) return '--'
    if (!link) return name
    return <Links module={options?.linksModule} id={item.windId} title={name} target={target} />
  }
  if (isArray(value)) {
    return value.map((item, index) => (
      <span key={index} style={{ marginInlineEnd: '8px' }}>
        {renderLink(item)}
      </span>
    ))
  }
  return renderLink(value)
}

const formatDate = (value: string | null, format = 'YYYY-MM-DD') => {
  if (!value) return '--'
  return dayjs(value).format(format)
}

const formatMoney = (value: number | string | null, precision = 2) => {
  if (isNil(value)) return '--'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '--'
  return num.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatNumber = (value: number | null) => {
  if (isNil(value)) return '--'
  return value.toLocaleString()
}

type RowItem = HorizontalTableProps['rows'][0][0]

export interface SimpleRowItem extends RowItem {
  renderParams?: {
    type: 'link' | 'date' | 'money' | 'number'
    options?: any
    linksModule?: LinksModule
  }
}

interface SimpleHorizontalTableProps extends Omit<HorizontalTableProps, 'rows'> {
  rows: SimpleRowItem[][]
}

const renderWithParams = (value: any, renderParams: SimpleRowItem['renderParams']) => {
  if (!renderParams) return value ?? '--'
  const { type, ...rest } = renderParams
  const applyFormat = (singleValue: any, formatter: (val: any, opts?: any) => React.ReactNode) => {
    if (isNil(singleValue) || singleValue === '') return '--'
    if (isArray(singleValue)) {
      if (singleValue.length === 0) return '--'
      return singleValue.map((v, i) => (
        <span key={i}>
          {formatter(v, rest)}
          {i < singleValue.length - 1 && <span>，</span>}
        </span>
      ))
    }
    return formatter(singleValue, rest)
  }
  switch (type) {
    case 'link':
      return applyFormat(value, formatLink)
    case 'date':
      return applyFormat(value, (val, opts) => formatDate(val, opts?.format))
    case 'money':
      return applyFormat(value, (val, opts) => formatMoney(val, opts?.precision))
    case 'number':
      return applyFormat(value, formatNumber)
    default:
      return value ?? '--'
  }
}

const SimpleHorizontalTable: React.FC<SimpleHorizontalTableProps> = (props) => {
  const { rows, dataSource, ...restProps } = props

  const processedRows = rows.map((row) =>
    row.map((item) => {
      const { titleAlign = 'left', render, renderParams, dataIndex } = item

      if (renderParams) {
        if (render && process.env.NODE_ENV === 'development') {
          console.warn(
            `[SimpleHorizontalTable]: For dataIndex="${dataIndex}", 'renderParams' is used, so 'render' function will be ignored. Please remove the 'render' prop to avoid confusion.`
          )
        }
        return {
          ...item,
          titleAlign,
          render: (text: any, record: any) => {
            const value = dataIndex ? record[dataIndex as string] : text
            return renderWithParams(value, renderParams)
          },
        }
      }

      return {
        ...item,
        titleAlign,
        render: (text: any, record: any, index: number) => {
          const value = dataIndex ? record[dataIndex as string] : text
          if (render) {
            const renderedValue = render(text, record, index)
            return isNil(renderedValue) || renderedValue === '' ? '--' : renderedValue
          }
          if (isNil(value) || value === '') return '--'
          if (isArray(value) && value.length === 0) return '--'
          return value
        },
      }
    })
  )

  return <Table.HorizontalTable {...restProps} rows={processedRows} dataSource={dataSource} />
}

export default SimpleHorizontalTable
