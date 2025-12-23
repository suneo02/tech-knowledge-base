import { GetProp, PaginationProps, Table } from 'antd'

/** 处理序号的问题 */
export const useIndex = () => {
  const indexColumn: any[] = [
    {
      dataIndex: 'index',
      title: '',
      align: 'center',
      width: 80,
    },
  ]
  const getIndexDataSource = (
    dataSource: GetProp<typeof Table, 'dataSource'>,
    pagination?: PaginationProps | false
  ) => {
    const { current = 1, pageSize = 10 } = pagination || {}
    return (
      dataSource?.map((item: any, index) => ({ ...(item || {}), index: (current - 1) * pageSize + index + 1 })) ||
      dataSource
    )
  }

  return {
    indexColumn,
    getIndexDataSource,
  }
}
