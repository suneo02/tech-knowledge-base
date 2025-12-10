import { Flex, Result, Table, TableProps, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
// import { renderComponent } from '../../../components/WComponent/render/renderComponent'

const renderComponent = (props: any) => {
  console.log('🚀 ~ renderComponent ~ props:', props)
  return '开发中'
}

export const useExpandable = (column: Record<string, any>) => {
  const [expandable, setExpandable] = useState<TableProps<any>['expandable']>({})
  const ComponentJSON: any[] = []

  const ExpandedRow = memo((row: { record: any; column: any }) => {
    const params: Record<string, unknown> = {}
    if (row?.column?.info?.params) {
      const _params = row.column.info.params
      _params?.forEach((par: any) => {
        if (par.type === 'dynamic') {
          if (par?.apiKey) params[par.apiKey] = row?.record?.[par?.key as string] as any
        } else {
          params[par.apiKey] = par.value
        }
      })
    }
    return row?.column?.info?.componentId ? (
      // '关联组件id' + row?.column?.info?.componentId
      // TODO 考虑后续关联组件
      renderComponent({
        ...ComponentJSON.find((res) => res.id === row.column.info.componentId),
        filter: params,
      })
    ) : row?.column?.info?.component ? (
      renderComponent({ ...row.column.info.component, filter: params })
    ) : (
      <Result status="404" title={`组件失踪啦`} subTitle="还未关联组件集或组件" />
    )
    //   renderComponent({ ...ComponentJSON.find((res) => res.id === row.column.info.componentId), filter: params })
  })
  ExpandedRow.displayName = 'ExpandedRow'

  const getExpandable = () => {
    setExpandable({
      columnTitle: (
        <Flex align="center" justify="center">
          {column.title}
        </Flex>
      ),
      columnWidth: column.width && `${column.width}px`,
      expandedRowRender: (record) => (column?.componentId ? <ExpandedRow column={column} record={record} /> : null),
      expandIcon: ({ record, expanded, onExpand }) => (
        <Typography.Link onClick={(e) => onExpand(record, e)} data-uc-id="aDd4KYMQUI" data-uc-ct="">
          {expanded
            ? '收起'
            : column?.info?.showInfoKey
              ? record?.[column?.info?.showInfoKey || '']
                ? '详情'
                : ''
              : '详情'}
        </Typography.Link>
      ),
    })
    return Table.EXPAND_COLUMN
  }
  useEffect(() => {
    getExpandable()
  }, [])
  return {
    expandable,
  }
}
