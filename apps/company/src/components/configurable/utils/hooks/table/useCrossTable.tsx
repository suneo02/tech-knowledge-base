import { formatCurrency } from '../../common'
import { TableProps } from 'antd'
import { cloneDeep } from 'lodash'
import { useMemo } from 'react'

export interface CrossTableProps {
  dataSource: TableProps['dataSource']
  columns: TableProps['columns']
  crossList: { title: string; dataIndex: string; align?: 'left' | 'right' }[]
  filter: any
}

/** 处理交叉报表和透视表 */
export const useCrossTable = (props: CrossTableProps) => {
  const crossData = useMemo(() => {
    if (!props.dataSource?.length) return []
    const cloneDataSource = cloneDeep(props.dataSource)
    const cloneCrossList = cloneDeep(props.crossList)
    const _dataSource = cloneCrossList?.map((res) => {
      const _arr = cloneDataSource?.flatMap((element, index) => ({ [`cross-${index + 1}`]: element?.[res?.dataIndex] }))
      // TODO 这里可以操作找到最大值和最小值
      return _arr?.length ? Object.assign({ crossName: res.title }, ..._arr) : _arr
    })

    const otherColumns: TableProps['columns'] = cloneDeep(props.dataSource).map((res, index) => ({
      title: res._reportDate,
      dataIndex: `cross-${index + 1}`,
      align: 'right',
      render: (txt: string | number) => (props?.filter?.label ? formatCurrency(txt, props.filter.label) : txt),
    }))

    const _columns = (props.columns || []).concat(otherColumns)
    return [_dataSource, _columns]
  }, [props.dataSource])

  return [...crossData] as const
}
