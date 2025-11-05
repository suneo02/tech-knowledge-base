// import LOGO from '../../../assets/logo.png'
import { QuestionCircleOutlined, RiseOutlined } from '@ant-design/icons'
import { Table, TableColumnProps, TableColumnsType, TableProps, Tooltip, Typography } from 'antd'
import React, { useMemo } from 'react'
// import InnerHtml from '../../../components/InnerHtml'
// import { Links } from '../../../components/Links'
import { DateTypeEnum, TableColumnsProps } from '../../../types'
import { ColumnTypeEnum } from '../../../types/emun'
import { getBrowserLocale } from '../../common'
import useChain from '../useChain'

const defaultEmptyValue = '--'

const formatNumber = (num: number | string, toFixed: number = 2) => {
  const pattern = /^-?\d+(\.\d+)?$/
  const isNumericAdvanced = num && pattern.test(String(num))
  return {
    value: isNumericAdvanced
      ? Number(num).toLocaleString(getBrowserLocale(), {
          minimumFractionDigits: toFixed,
          maximumFractionDigits: toFixed,
        })
      : defaultEmptyValue,
    boolean: isNumericAdvanced,
  }
}

const formatDateBasedOnLocale = (dateStr: string, separator?: string) => {
  try {
    const valid = !isNaN(new Date(String(dateStr)).getTime())
    const dateObj = valid
      ? new Date(String(dateStr))
      : new Date(Number(dateStr.slice(0, 4)), parseInt(dateStr.slice(4, 6)) - 1, Number(dateStr.slice(6)))
    const date = new Intl.DateTimeFormat(getBrowserLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj)
    return separator ? date.replace(/\//g, separator) : date
  } catch {
    return defaultEmptyValue
  }
}

const formatDate = (column: TableColumnsProps, row: Record<string, unknown>, res: any) => {
  const dateStr = res as string
  const dateRangeKey = column.date?.dateRangeKey as string
  const startDate = formatDateBasedOnLocale(dateStr, column.date?.separator)
  const endDate = formatDateBasedOnLocale(row[dateRangeKey] as string, column.date?.separator)
  const dateRange = startDate !== '--' && endDate !== '--' ? `${startDate} 至 ${endDate}` : '--'
  return column.date?.type === DateTypeEnum.DATE_RANGE ? dateRange : startDate
}

const useColumns = (columns: TableColumnsType) => {
  // TODO 此处的any也很麻烦
  const handleColumn = (column: any) => {
    if (column?.type === ColumnTypeEnum.INFO) {
      return Table.EXPAND_COLUMN
    }
    if (column?.type === ColumnTypeEnum.IMAGE) {
      column.width = 60
    }
    ;(column as TableColumnProps).render = (res, row) => {
      switch (column?.type) {
        case ColumnTypeEnum.TEXTAREA:
          return (
            <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}>{res}</Typography.Paragraph>
          )
        case ColumnTypeEnum.CHG:
          return <Typography.Text>{<RiseOutlined />}</Typography.Text>
        case ColumnTypeEnum.LINKS:
          if (column?.links?.key && Array.isArray(row?.[column?.links?.key])) {
            return row[column?.links?.key]?.map(
              (col: Record<string, any>, index: number) => '链接开发中'
              // <Links key={`links-${index + 1}`} id={col?.[column?.links?.id as string]} label={col?.[column?.links?.label as string]} module={column?.links?.module} />
            )
          } else {
            return '链接开发中'
            // <Links id={row?.[column?.links?.id as string]} label={res} module={column?.links?.module} />
          }
        case ColumnTypeEnum.NUMBER:
          const formattedNumber = formatNumber(res, column.toFixed)
          return formattedNumber.value
        case ColumnTypeEnum.PERCENT:
          const percent = formatNumber(res)
          return percent.boolean ? `${percent.value}%` : defaultEmptyValue
        case ColumnTypeEnum.CURRENCY:
          const currency = formatNumber(res)
          return currency.boolean
            ? `${currency.value}${column.currencyUnit ? row[column.currencyUnit] || '' : ''}`
            : defaultEmptyValue
        case ColumnTypeEnum.CHAIN:
          const { renderChainInfo } = useChain()
          return renderChainInfo(res)
        case ColumnTypeEnum.DATE:
          return formatDate(column, row, res)
        case ColumnTypeEnum.HTML:
          // return <InnerHtml html={res} />
          return 'innerHtml 开发中'
        case ColumnTypeEnum.IMAGE:
          return '图像开发中'
        // <Tooltip title={<Image width={200} src={res} fallback={LOGO} preview={false} />} placement="right">
        //   <Image width={60} src={res} fallback={LOGO} preview={false} />
        // </Tooltip>
        default:
          return res || defaultEmptyValue
      }
    }

    return {
      ...column,
      title: column?.tooltip ? (
        <>
          {column.title}
          <Tooltip title={column.tooltip} color="#fff" style={{ color: '#000' }}>
            <QuestionCircleOutlined style={{ marginInlineStart: 2 }} />
          </Tooltip>
        </>
      ) : (
        column.title
      ),
    }
  }

  const handleColumns = (columns: TableProps['columns']) =>
    columns?.map((column) => {
      if ('children' in column) column.children = handleColumns(column.children) || []
      return handleColumn(column)
    }) || []

  const memoizedColumns = useMemo(() => {
    return handleColumns(columns)
  }, [columns])

  return { columns: memoizedColumns }
}

export default useColumns
